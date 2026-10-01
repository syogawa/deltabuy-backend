import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { Request } from "express";
import { BasketService } from "./basket.service";
import { AddToBasketDto } from "./dto/add-to-basket.dto";
import { UpdateBasketItemDto } from "./dto/update-basket-item.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@Controller("basket")
@UseGuards(AccessTokenGuard)
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  getCart(@Req() req: authRequestType.AuthRequest) {
    return this.basketService.getCart(req.user.id);
  }

  @Post("add")
  add(@Body() dto: AddToBasketDto, @Req() req: authRequestType.AuthRequest) {
    return this.basketService.add(req.user.id, dto.productId, dto.quantity);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.basketService.findOne(req.user.id, id);
  }

  @Patch(":id")
  updateQuantity(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateBasketItemDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.basketService.updateQuantity(req.user.id, id, dto.quantity);
  }

  @Delete()
  clear(@Req() req: authRequestType.AuthRequest) {
    return this.basketService.clear(req.user.id);
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.basketService.remove(req.user.id, id);
  }
}
