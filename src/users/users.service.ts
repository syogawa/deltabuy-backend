import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.db.user.findFirst({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        "Пользователь с таким email уже существует",
      );
    }

    return this.db.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
