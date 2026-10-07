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
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //  ПУБЛИЧНЫЕ ЭНД ПОИНТЫ

  @Get()
  getCategories() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  getCategory(@Param("id") id: string) {
    return this.categoryService.findOne(+id);
  }

  @Get(":id/children")
  findChildren(@Param("id") id: number) {
    return this.categoryService.findChildrenCategories(+id);
  }

  @Get(":id/tree")
  findTree(@Param("id") id: number) {
    return this.categoryService.findCategoryTree(+id);
  }

  //  ТОЛЬКО АДМИН
  @UseGuards(AccessTokenGuard)
  @Post("create")
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.categoryService.create(createCategoryDto, req.user.role);
  }
  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.categoryService.update(updateCategoryDto, req.user.role, +id);
  }
}
