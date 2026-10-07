import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<void> {
    // убираем дубли, иначе упадёт на составном ключе [productId, categoryId]
    const categoryIds = [...new Set(createProductDto.categoryIds)];

    // проверяем, что все категории существуют и не удалены
    const count = await this.db.category.count({
      where: { id: { in: categoryIds }, deletedAt: null, hidden: false },
    });
    if (count !== categoryIds.length) {
      throw new BadRequestException("Одна или несколько категорий не найдены");
    }

    await this.db.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        salePrice: createProductDto.price,
        description: createProductDto.description,
        sellerId: userId,
        productCategories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    });
  }
  // findAll() {
  //   return `This action returns all product`;
  // }

  findOne(id: number) {
    return this.db.product.findFirst({ where: { id } });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.db.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        salePrice: dto.price,
        ...(dto.categoryIds && {
          productCategories: {
            deleteMany: {},
            create: [...new Set(dto.categoryIds)].map((categoryId) => ({
              categoryId,
            })),
          },
        }),
      },
    });
  }

  async deactivate(id: number) {
    await this.db.product.updateMany({
      where: { id: id },
      data: { isActive: false },
    });
  }

  async activate(id: number) {
    await this.db.product.updateMany({
      where: { id: id },
      data: { isActive: true },
    });
  }

  async remove(id: number) {
    await this.db.product.updateMany({
      where: { id: id },
      data: { hidden: true },
    });
  }
}
