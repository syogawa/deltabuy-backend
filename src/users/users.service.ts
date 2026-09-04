import { Injectable } from "@nestjs/common";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../database/database.service";
import { User } from "../../generated/prisma/client";

type UserRegisterData = {
  name: string;
  email: string;
  hashedPassword: string;
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
        password: userData.hashedPassword,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  /*
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
*/
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
