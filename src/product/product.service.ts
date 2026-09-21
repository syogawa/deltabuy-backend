import { Injectable } from "@nestjs/common";
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
    await this.db.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        sellerId: userId,
      },
    });
  }
  // findAll() {
  //   return `This action returns all product`;
  // }

  findOne(id: number) {
    return this.db.product.findFirst({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.db.product.updateMany({
      where: { id: id },
      data: {
        is_active: updateProductDto.isActive,
        price: updateProductDto.price,
        name: updateProductDto.name,
        description: updateProductDto.description,
      },
    });
  }

  async remove(id: number) {
    await this.db.product.updateMany({
      where: { id: id },
      data: { hidden: true },
    });
  }
}
