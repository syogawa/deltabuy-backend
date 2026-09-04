import { ConflictException, Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "@nestjs/passport";
import { UsersService } from "../users/users.service";

//settings
const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(dto: CreateAuthDto): Promise<any> {
    const existing = await this.userService.findOneByMail(dto.email);
    if (existing) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    //getting hashed password
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    const userData = {
      email: dto.email,
      name: dto.name,
      hashedPassword: hashedPassword,
    };
    await this.userService.create(userData);
  }
}
