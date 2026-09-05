import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { RegisterAuthDto } from "./dto/reg-auth";
import * as bcrypt from "bcrypt";
import * as jwt from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { User } from "../../generated/prisma/client";
import { LoginAuthDto } from "./dto/login-auth.dto";

//settings
const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(dto: RegisterAuthDto): Promise<void> {
    const existing = await this.userService.findOneByMail(dto.email);
    if (existing) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    const userData: RegisterAuthDto = {
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    };
    await this.userService.create(userData);
  }

  async login(dto: LoginAuthDto): Promise<User> {
    const user = await this.userService.findOneByMail(dto.email);
    if (!user) {
      throw new ConflictException("Пользователь не найден");
    }

    const userLoginData: LoginAuthDto = {
      email: dto.email,
      password: dto.password,
    };

    const isPassValid = await bcrypt.compare(
      userLoginData.password,
      user.password,
    );

    if (!isPassValid) {
      throw new BadRequestException("Неверный логин или пароль!");
    }

    /*
    Логика токена и сохранения его в куки тд тп -_-

    return {'jwt': jwtToken};
    */

    return user; //temporary
  }
}
