import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { DatabaseService } from "../database/database.service";
import { Role } from "../../generated/prisma/enums";
@Injectable()
export class ReviewService {
  constructor(private readonly db: DatabaseService) {}

  async create(createReviewDto: CreateReviewDto, userId: number) {
    const order = await this.db.deal.findUnique({
      where: { id: createReviewDto.dealId },
    });
    if (!order) {
      throw new NotFoundException("Заказ не найден!");
    }
    if (order.buyerId !== userId) {
      throw new ForbiddenException("Заказ не ваш!");
    }
    if (order.status !== "COMPLETED") {
      throw new BadRequestException(
        "Отзыв можно оставить после завершения покупки",
      );
    }
    try {
      return this.db.review.create({
        data: {
          rating: createReviewDto.rating,
          text: createReviewDto.text,
          productId: createReviewDto.productId,
          authorId: userId,
          dealId: createReviewDto.dealId,
        },
      });
    } catch (e) {
      throw new ConflictException(e);
    }
  }

  async update(
    id: number,
    dto: UpdateReviewDto,
    userId: number,
    userRole: Role,
  ) {
    const review = await this.getOwned(userId, id, userRole);
    return this.db.review.update({ where: { id: review.id }, data: dto });
  }

  async remove(userId: number, id: number, userRole: Role) {
    const review = await this.getOwned(userId, id, userRole);
    return this.db.review.update({
      where: { id: review.id },
      data: { hidden: true },
    });
  }

  private async getOwned(userId: number, id: number, userRole: Role) {
    const review = await this.db.review.findFirst({
      where: { id, hidden: false },
    });
    if (!review) throw new NotFoundException();
    if (review.authorId !== userId && userRole === "USER")
      throw new ForbiddenException();
    return review;
  }
}
