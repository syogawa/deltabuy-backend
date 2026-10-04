import { Injectable } from "@nestjs/common";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { DatabaseService } from "../database/database.service";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class DealService {
  constructor(private readonly db: DatabaseService) {}

  create(createDealDto: CreateDealDto, userId: number, productId: number) {
    return this.db.deal.create({
      data: {
        buyerId: userId,
        productId: productId,
        quantity: createDealDto.quantity,
        productSnapshot: Prisma.JsonNull,
        priceAtPurchase: createDealDto.price, // ← обязательно
        currency: createDealDto.currency, // ← обязательно
      },
    });
  }

  findOne(id: number) {
    return this.db.deal.findUnique({ where: { id } });
  }

  update(id: number, updateDealDto: UpdateDealDto) {
    return this.db.deal.update({
      where: { id },
      data: { status: updateDealDto.status },
    });
  }

  remove(id: number) {
    return this.db.deal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
