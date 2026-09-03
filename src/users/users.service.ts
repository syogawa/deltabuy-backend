import {
  BadRequestException,
  Injectable,
  Res,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../database/database.service";
import { User } from "../../generated/prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "@nestjs/passport";

//settings
const saltRounds = 10;

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
  async create(dto: CreateUserDto): Promise<any> {
    const existing = await this.findOneByMail(dto.email);
    if (existing) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    //getting hashed password
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    return this.db.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
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
