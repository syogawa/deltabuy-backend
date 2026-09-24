import { Injectable } from "@nestjs/common";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../database/database.service";
import { User } from "../../generated/prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

type UserRegisterData = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  //Поиск юзера по почте
  async findOneByMail(email: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  //Регистрация пользователя / Создание
  async create(userData: UserRegisterData): Promise<User> {
    return this.db.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneById(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    return this.db.user.updateMany({
      where: { id: id },
      data: {
        name: updateUserDto.name,
        avatar: updateUserDto.avatar,
        description: updateUserDto.description,
      },
    });
  }

  async getMe(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
