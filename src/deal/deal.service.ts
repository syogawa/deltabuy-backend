import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealStatusDto } from "./dto/update-deal-status.dto";
import { DatabaseService } from "../database/database.service";
import { Role } from "../../generated/prisma/enums";

type Actor = { id: number; role?: Role };

@Injectable()
export class DealService {
  constructor(private readonly db: DatabaseService) {}

  private isStaff(role?: Role) {
    return role === "ADMIN" || role === "MODERATOR";
  }

  // ---------- создание сделки ----------
  async create(dto: CreateDealDto, buyerId: number) {
    // всё в одной транзакции: либо и остаток списан, и сделка создана, либо ничего
    return this.db.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: {
          id: dto.productId,
          isActive: true,
          hidden: false,
          deletedAt: null,
        },
        include: {
          productImages: {
            where: { hidden: false },
            orderBy: { position: "asc" },
          },
          productCategories: true,
        },
      });
      if (!product) throw new NotFoundException("Товар не найден");

      if (product.sellerId === buyerId) {
        throw new BadRequestException("Нельзя купить собственный товар");
      }

      // атомарное списание: условие quantity >= N проверяется самой БД,
      // поэтому два параллельных покупателя не уведут остаток в минус
      const { count } = await tx.product.updateMany({
        where: { id: product.id, quantity: { gte: dto.quantity } },
        data: { quantity: { decrement: dto.quantity } },
      });
      if (count === 0) {
        throw new BadRequestException("Недостаточно товара в наличии");
      }

      // цену и валюту берём ТОЛЬКО из БД, а не из запроса
      const unitPrice = product.salePrice ?? product.price;

      return tx.deal.create({
        data: {
          buyerId,
          productId: product.id,
          quantity: dto.quantity,
          priceAtPurchase: unitPrice,
          currency: product.currency,
          productSnapshot: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            salePrice: product.salePrice?.toString() ?? null,
            currency: product.currency,
            sellerId: product.sellerId,
            images: product.productImages.map((i) => i.url),
            categoryIds: product.productCategories.map((c) => c.categoryId),
          },
        },
      });
    });
  }

  // ---------- чтение: только покупатель, продавец или персонал ----------
  async findOne(id: number, actor: Actor) {
    const deal = await this.db.deal.findUnique({
      where: { id },
      include: { product: { select: { sellerId: true } } },
    });
    if (!deal) throw new NotFoundException("Сделка не найдена");

    const isParticipant =
      deal.buyerId === actor.id || deal.product.sellerId === actor.id;
    if (!isParticipant && !this.isStaff(actor.role)) {
      throw new ForbiddenException("Нет доступа к этой сделке");
    }

    const { product, ...rest } = deal;
    return { ...rest, sellerId: product.sellerId };
  }

  // ---------- смена статуса ----------
  // PAID -> COMPLETED : покупатель (подтвердил получение) или персонал
  // PAID -> REFUNDED  : продавец (вернул деньги) или персонал, остаток возвращается на склад
  // COMPLETED / REFUNDED — конечные статусы
  async updateStatus(id: number, dto: UpdateDealStatusDto, actor: Actor) {
    if (dto.status === "PAID") {
      throw new BadRequestException("Нельзя вернуть сделку в статус PAID");
    }

    const deal = await this.db.deal.findUnique({
      where: { id },
      include: { product: { select: { sellerId: true } } },
    });
    if (!deal) throw new NotFoundException("Сделка не найдена");

    const staff = this.isStaff(actor.role);
    const isBuyer = deal.buyerId === actor.id;
    const isSeller = deal.product.sellerId === actor.id;

    if (!isBuyer && !isSeller && !staff) {
      throw new ForbiddenException("Нет доступа к этой сделке");
    }
    if (dto.status === "COMPLETED" && !isBuyer && !staff) {
      throw new ForbiddenException("Завершить сделку может только покупатель");
    }
    if (dto.status === "REFUNDED" && !isSeller && !staff) {
      throw new ForbiddenException("Оформить возврат может только продавец");
    }

    return this.db.$transaction(async (tx) => {
      // where status = PAID защищает от двойного возврата / гонки двух запросов
      const { count } = await tx.deal.updateMany({
        where: { id, status: "PAID" },
        data: { status: dto.status },
      });
      if (count === 0) {
        throw new ConflictException("Статус этой сделки уже нельзя изменить");
      }

      if (dto.status === "REFUNDED") {
        await tx.product.update({
          where: { id: deal.productId },
          data: { quantity: { increment: deal.quantity } },
        });
      }

      return tx.deal.findUnique({ where: { id } });
    });
  }
}
