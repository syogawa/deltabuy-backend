import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ProductService } from "../product.service";
import { Request } from "express";

@Injectable()
export class ProductOwnershipGuard implements CanActivate {
  constructor(private readonly ProductService: ProductService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request["user"];

    const productId = Number(request.params.id);

    if (!user) {
      throw new ForbiddenException("Пользователь не авторизован");
    }

    const product = await this.ProductService.findOne(productId);

    if (!product) {
      throw new NotFoundException("Продукт не найден");
    }

    if (product.sellerId !== user.userId) {
      throw new ForbiddenException(`Вы не являетесь владельцем этого продукта`);
    }

    return true;
  }
}
