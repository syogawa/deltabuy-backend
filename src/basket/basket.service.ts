import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class BasketService {
  constructor(private readonly db: DatabaseService) {}

  async getCart(userId: number) {
    const items = await this.db.basket.findMany({
      where: { userId, hidden: false },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    // предполагается, что у Product есть поле price
    const totalPrice = items.reduce(
      (sum, i) => sum + Number(i.product.salePrice) * i.quantity,
      0,
    );

    return { items, totalCount, totalPrice };
  }

  async findOne(userId: number, id: number) {
    const item = await this.db.basket.findFirst({
      where: { id, userId, hidden: false },
      include: { product: true },
    });
    if (!item) throw new NotFoundException("Basket item not found");
    return item;
  }

  async add(userId: number, productId: number, quantity = 1) {
    const product = await this.db.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException("Product not found");

    const existing = await this.db.basket.findFirst({
      where: { userId, productId, hidden: false },
    });

    // если товар уже в корзине, увеличиваем количество, а не плодим дубли
    if (existing) {
      return this.db.basket.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantity } },
      });
    }

    return this.db.basket.create({
      data: { userId, productId, quantity },
    });
  }

  async updateQuantity(userId: number, id: number, quantity: number) {
    await this.findOne(userId, id); // проверка владельца + существования
    return this.db.basket.update({
      where: { id },
      data: { quantity },
    });
  }

  async remove(userId: number, id: number) {
    const { count } = await this.db.basket.updateMany({
      where: { id, userId, hidden: false },
      data: { hidden: true },
    });
    if (count === 0) throw new NotFoundException("Basket item not found");
    return { success: true };
  }

  async clear(userId: number) {
    const { count } = await this.db.basket.updateMany({
      where: { userId, hidden: false },
      data: { hidden: true },
    });
    return { success: true, removed: count };
  }
}
