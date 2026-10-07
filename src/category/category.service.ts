import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Role } from "../../generated/prisma/enums";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class CategoryService {
  constructor(private readonly db: DatabaseService) {}

  async create(createCategoryDto: CreateCategoryDto, userRole: Role) {
    if (userRole === "ADMIN") {
      return this.db.category.create({
        data: {
          parentId: createCategoryDto.parentId,
          name: createCategoryDto.name,
        },
      });
    } else {
      throw new ForbiddenException("В доступе отказано!");
    }
  }

  async findAll() {
    return this.db.category.findMany({
      where: { parentId: null, hidden: false },
    });
  }

  async findOne(id: number) {
    const category = await this.db.category.findFirst({
      where: { id, hidden: false },
    });
    if (!category) {
      throw new NotFoundException("Категория не найдена!");
    }
    return category;
  }

  async findChildrenCategories(parentId: number) {
    const category = await this.db.category.findFirst({
      where: { id: parentId, hidden: false },
    });
    if (!category) {
      throw new NotFoundException("Корневая категория не найдена!");
    }
    return this.db.category.findMany({ where: { parentId, hidden: false } });
  }

  async findCategoryTree(parentId: number) {
    const category = await this.db.category.findFirst({
      where: { id: parentId },
    });
    if (!category) {
      throw new NotFoundException("Корневая категория не найдена!");
    }
    const children = await this.db.category.findMany({
      where: { parentId, hidden: false },
    });
    return {
      ...category,
      children,
    };
  }

  async update(
    updateCategoryDto: UpdateCategoryDto,
    userRole: Role,
    id: number,
  ) {
    const category = await this.db.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException("Категория для обновления не найдена!");
    }
    if (userRole === "ADMIN" && updateCategoryDto.parentId !== id) {
      return this.db.category.update({
        where: { id },
        data: {
          parentId: updateCategoryDto.parentId,
          name: updateCategoryDto.name,
        },
      });
    } else {
      throw new ForbiddenException("В доступе отказано!");
    }
  }

  async remove(id: number, userRole: Role) {
    if (userRole === "ADMIN") {
      const category = await this.db.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException("Категория для удаления не найдена!");
      }
      return this.db.category.update({
        where: { id },
        data: { hidden: true, deletedAt: new Date() },
      });
    } else {
      throw new ForbiddenException("В доступе отказано!");
    }
  }
}
