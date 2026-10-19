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
}
