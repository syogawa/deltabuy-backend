import {
  Controller,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
  Res,
  Get,
  Req,
  UnauthorizedException,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/reg-auth";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { User } from "../../generated/prisma/client";
import express from "express";
// import { Throttle } from "@nestjs/throttler";

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
  ): Promise<{ user: User }> {
    const { user, refreshToken } = await this.authService.login(loginAuthDto);
    res.cookie("refresToken", refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { user };
  }
  @Get("check-auth")
  async getToken(@Req() req: express.Request) {
    const refreshToken = req.cookies.user;
    return this.authService.checkAuth(refreshToken);
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token отсутствует");
    }

    const payload = await this.authService.checkAuth(refreshToken);

    const tokens = await this.authService.generateTokens(
      payload.userId,
      refreshToken,
    );

    res.cookie("refreshToken", tokens.newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post("logout")
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token отсутствует");
    }

    await this.authService.checkAuth(refreshToken);
    await this.authService.logout(refreshToken);

    res.clearCookie("refreshToken");
  }
}
