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

  async login(
    dto: LoginAuthDto,
  ): Promise<{ user: User; refreshToken: string }> {
    const user = await this.userService.findOneByMail(dto.email);
    if (!user) {
      throw new ConflictException("Пользователь не найден!");
    }

    const isPassValid = await bcrypt.compare(dto.password, user.password);
    if (!isPassValid) {
      throw new BadRequestException("Неверный логин или пароль!");
    }

    const payload = { userId: user.id, email: user.email };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "30d",
    });

    return { user, refreshToken };
  }
}
