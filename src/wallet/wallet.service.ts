import { BadRequestException, Injectable } from "@nestjs/common";
import { walletTransactionDto } from "./dto/create-transaction.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { Product } from "../../generated/prisma/client";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class WalletService {
  constructor(private readonly db: DatabaseService) {}

  async createTransaction(
    walletTransactionDto: walletTransactionDto,
    product: Product,
    userId: number,
  ) {
    //КРЧ НАЧАЛ ТРАНЗАКЦИИ ПИСАТЬ
    await this.db.$transaction(async (tx) => {
      const wallet = await this.findIfHadCreateIfHadnt(userId);
      if (product.quantity > 0 && wallet.balance > product.price) {
        const buyer = await tx.wallet.update({
          where: { userId },
          data: {
            balance: { decrement: product.price },
            holdBalance: { increment: product.price },
          },
        });
        await this.db.walletTransaction.create({
          data: {
            id: userId,
            dealId: walletTransactionDto.dealId,
            status: "PENDING",
          },
        });
      }
    });
  }

  private async findIfHadCreateIfHadnt(userId: number) {
    const wallet = await this.db.wallet.findUnique({
      where: { id: userId },
    });
    if (wallet) {
      return wallet;
    }

    return this.db.wallet.create({ data: { userId } });
  }
  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
