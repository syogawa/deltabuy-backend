import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  async create(createProductDto: CreateProductDto): Promise<void> {
    await this.db.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        sellerId: 1,
      },
    });
  }
  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return this.db.product.findFirst({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
