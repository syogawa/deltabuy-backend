import { Injectable } from "@nestjs/common";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealStatusDto } from "./dto/update-deal-status.dto";
import { DatabaseService } from "../database/database.service";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class DealService {
  constructor(private readonly db: DatabaseService) {}

  async create(createDealDto: CreateDealDto, userId: number) {
    return this.db.deal.create({
      data: {
        buyerId: userId,
        productId: createDealDto.productId,
        quantity: createDealDto.quantity,
        productSnapshot: Prisma.JsonNull,
        priceAtPurchase: createDealDto.price,
        currency: createDealDto.currency,
      },
    });
  }

  async findOne(id: number) {
    return await this.db.deal.findUnique({ where: { id } });
  }

  async updateStatus(id: number, updateDealStatusDto: UpdateDealStatusDto) {
    return this.db.deal.update({
      where: { id },
      data: { status: updateDealStatusDto.status },
    });
  }
}
