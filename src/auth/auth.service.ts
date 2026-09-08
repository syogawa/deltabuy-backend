import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterAuthDto } from "./dto/reg-auth";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../../generated/prisma/client";
import { LoginAuthDto } from "./dto/login-auth.dto";
import "dotenv/config";
import express from "express";
//settings
const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async login(@Body() dto: LoginAuthDto, res: express.Response): Promise<User> {
    const user = await this.userService.findOneByMail(dto.email);
    if (!user) {
      throw new ConflictException("Пользователь не найден!");
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

    const payload = { userId: user.id, email: user.email };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: "15m",
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "30d",
    });

    res.cookie("user", refreshToken, {
      secure: true,
      httpOnly: true,
    });

    return user; //temporary
  }

  async getAccessToken(@Req() req: Request): Promise<any> {
    const user = req.cookies.user;
  }
}
