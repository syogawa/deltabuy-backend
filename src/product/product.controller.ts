import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SkipThrottle } from "@nestjs/throttler";
// import { AuthController } from "../auth/auth.controller";
// import * as express from "express";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import { ProductOwnershipGuard } from "./guards/ProductOwnershipGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@SkipThrottle({ auth: true })
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //=================================== ПУБЛИЧНЫЕ ЭНДПОИНТЫ ===================================

  @Get()
  findAll() {
    // return this.productService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(+id);
  }

  //==================================== ЗАЩИЩЁННЫЕ ЭНДПОИНТЫ ==================================

  @Post("create")
  @UseGuards(AccessTokenGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.productService.create(createProductDto, req.user.id);
  }

  @UseGuards(AccessTokenGuard, ProductOwnershipGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @UseGuards(AccessTokenGuard, ProductOwnershipGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
