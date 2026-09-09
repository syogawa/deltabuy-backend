import {
  Controller,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
  Res,
  Get,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/reg-auth";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { User } from "../../generated/prisma/client";
import express from "express";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post("reg")
  async register(@Body() RegisterAuthDto: RegisterAuthDto) {
    return this.authService.register(RegisterAuthDto);
  }

  @UsePipes(new ValidationPipe())
  @Post("login")
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ user: User; refreshToken: string }> {
    const { user, refreshToken } = await this.authService.login(loginAuthDto);
    res.cookie("user", refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // лучше добавить
    });
    return { user, refreshToken };
  }

  @Get("my-token")
  async getToken(@Req() req: express.Request) {
    const user = req.cookies.user;
    return user;
  }
}
