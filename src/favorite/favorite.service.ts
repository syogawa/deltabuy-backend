import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AddFavoriteDto } from "./dto/add-favorite.dto";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class FavoriteService {
  constructor(private readonly db: DatabaseService) {}

  async addFavorite(addFavoriteDto: AddFavoriteDto, userId: number) {
    const product = await this.db.product.findUnique({
      where: { id: addFavoriteDto.productId },
    });
    if (!product) {
      throw new NotFoundException("Товар не найден!");
    }
    const fav = await this.findFav(userId, addFavoriteDto.productId);
    if (!fav) {
      try {
        return this.db.favorite.create({
          data: {
            productId: addFavoriteDto.productId,
            userId,
          },
        });
      } catch (e) {
        throw new ConflictException(e);
      }
    }
    if (fav.hidden === true) {
      this.db.favorite.update({
        where: { id: fav.id },
        data: { hidden: false },
      });
    }
    if (fav.hidden === false) {
      throw new BadRequestException("Товар уже добавлен в избранное!");
    }
  }

  async findAll(userId: number) {
    return this.db.favorite.findMany({ where: { userId } });
  }

  async remove(id: number, userId: number) {
    const fav = await this.getOwned(userId, id);
    return this.db.favorite.update({
      where: { id: fav.id },
      data: { hidden: false },
    });
  }

  private async findFav(userId: number, productId: number) {
    return this.db.favorite.findFirst({ where: { userId, productId } });
  }
  private async getOwned(userId: number, id: number) {
    const fav = await this.db.favorite.findFirst({
      where: { id, hidden: false },
    });
    if (!fav) throw new NotFoundException();
    if (fav.userId !== userId) throw new ForbiddenException();
    return fav;
  }
}
