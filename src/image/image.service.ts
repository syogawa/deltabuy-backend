import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { mkdir, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { DatabaseService } from "../database/database.service";
import { basename } from "path";

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
const DIR = join(process.cwd(), "data", "images");
const MAX_IMAGES_PER_PRODUCT = 10;

@Injectable()
export class ProductImageService {
  constructor(private readonly db: DatabaseService) {}

  async addImages(
    userId: number,
    productId: number,
    files: Express.Multer.File[],
    positions?: number[],
  ) {
    const product = await this.db.product.findUnique({
      where: { id: productId },
      select: { id: true, sellerId: true },
    });
    if (!product) throw new NotFoundException("Товар не найден");
    if (product.sellerId !== userId) throw new ForbiddenException();

    await mkdir(DIR, { recursive: true });

    const names = files.map((f) => `${randomUUID()}${EXT[f.mimetype]}`);
    const written: string[] = [];

    try {
      // 1. пишем файлы на диск
      await Promise.all(
        files.map(async (f, i) => {
          await writeFile(join(DIR, names[i]), f.buffer);
          written.push(names[i]);
        }),
      );

      // 2. пишем в БД одной транзакцией
      return await this.db.$transaction(async (tx) => {
        const agg = await tx.productImage.aggregate({
          where: { productId },
          _count: true,
          _max: { position: true },
        });

        if (agg._count + files.length > MAX_IMAGES_PER_PRODUCT) {
          throw new BadRequestException(
            `У товара не может быть больше ${MAX_IMAGES_PER_PRODUCT} изображений ` +
              `(сейчас ${agg._count})`,
          );
        }

        const startAt = (agg._max.position ?? -1) + 1;

        return tx.productImage.createManyAndReturn({
          data: names.map((name, i) => ({
            productId,
            url: `images/${name}`,
            position: positions ? positions[i] : startAt + i,
          })),
        });
      });
    } catch (e: any) {
      // откат: удаляем записанные файлы
      await Promise.all(
        written.map((n) => unlink(join(DIR, n)).catch(() => {})),
      );
      if (e?.code === "P2002") {
        throw new ConflictException("Позиция уже занята другой картинкой");
      }
      throw e;
    }
  }
  private async assertOwner(userId: number, productId: number) {
    const product = await this.db.product.findUnique({
      where: { id: productId },
      select: { sellerId: true },
    });
    if (!product) throw new NotFoundException("Товар не найден");
    if (product.sellerId !== userId) throw new ForbiddenException();
  }
  private async findImage(productId: number, imageId: number) {
    const image = await this.db.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!image) throw new NotFoundException("Изображение не найдено");
    return image;
  }

  private filePath(url: string) {
    return join(DIR, basename(url)); // basename защищает от выхода за папку
  }

  // ---------- порядок ----------
  async reorder(userId: number, productId: number, ids: number[]) {
    await this.assertOwner(userId, productId);

    const images = await this.db.productImage.findMany({
      where: { productId },
      select: { id: true },
    });
    const valid =
      ids.length === images.length &&
      new Set(ids).size === ids.length &&
      images.every((img) => ids.includes(img.id));
    if (!valid) {
      throw new BadRequestException(
        "ids должен содержать все изображения товара ровно по одному разу",
      );
    }

    return this.db.$transaction(async (tx) => {
      // шаг 1: временные отрицательные позиции, чтобы не словить P2002
      // при перестановке (например, обмен 0 <-> 1)
      for (const id of ids) {
        await tx.productImage.update({
          where: { id },
          data: { position: -id },
        });
      }
      // шаг 2: финальные позиции 0..n-1 в порядке из запроса
      for (let i = 0; i < ids.length; i++) {
        await tx.productImage.update({
          where: { id: ids[i] },
          data: { position: i },
        });
      }
      return tx.productImage.findMany({
        where: { productId },
        orderBy: { position: "asc" },
      });
    });
  }

  // ---------- замена файла ----------
  async replace(
    userId: number,
    productId: number,
    imageId: number,
    file: Express.Multer.File,
  ) {
    await this.assertOwner(userId, productId);
    const image = await this.findImage(productId, imageId);

    await mkdir(DIR, { recursive: true });
    const name = `${randomUUID()}${EXT[file.mimetype]}`;
    await writeFile(join(DIR, name), file.buffer);

    let updated;
    try {
      updated = await this.db.productImage.update({
        where: { id: imageId },
        data: { url: `images/${name}` },
      });
    } catch (e) {
      await unlink(join(DIR, name)).catch(() => {});
      throw e;
    }

    // старый файл удаляем только после успешного обновления БД
    await unlink(this.filePath(image.url)).catch(() => {});
    return updated;
  }

  // ---------- удаление ----------
  async remove(userId: number, productId: number, imageId: number) {
    await this.assertOwner(userId, productId);
    const image = await this.findImage(productId, imageId);

    await this.db.productImage.delete({ where: { id: imageId } });
    await unlink(this.filePath(image.url)).catch(() => {});
    return { deleted: true };
  }
}
