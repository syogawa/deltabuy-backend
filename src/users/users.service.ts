import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  Injectable,
  ConfigurableModuleBuilder,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../database/database.service";
import { User } from "../../generated/prisma/client";
import * as bcrypto from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  //Поиск юзера по почте
  async findOneByMail(email: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findOneByMail(dto.email);
    if (existing) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    //settings
    const saltRounds = 10;

    //getting hashed password
    const hashedPassword = bcrypto.hash(dto.password, saltRounds);

    this.db.user.create({
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
