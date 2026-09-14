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
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { AuthController } from "../auth/auth.controller";
import * as express from "express";

@SkipThrottle({ auth: true })
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("create")
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: express.Request,
  ) {
    if (req.cookies?.user) {
      return this.productService.create(createProductDto);
      // return req.cookies?.user;
    } else {
      throw new BadRequestException("You should login first!");
    }
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
