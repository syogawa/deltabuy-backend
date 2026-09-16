import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterAuthDto } from "./dto/reg-auth";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../../generated/prisma/client";
import { LoginAuthDto } from "./dto/login-auth.dto";
import "dotenv/config";
import { DatabaseService } from "../database/database.service";
import { createHash } from "crypto";

//settings
const saltRounds = 10;
const secretKey = process.env.JWT_SECRET!;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly db: DatabaseService,
  ) {}
  // support function

  //                      REGISTRATION
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

  //                       LOGIN
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

    //Создание ячейки сессия в таблица sessions
    await this.db.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 1000 * 60 * 60 * 24), //+30 days
      },
    });

    return { user, refreshToken };
  }

  //                       CHECK AUTH
  async checkAuth(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken);

    const session = await this.db.session.findFirst({
      where: {
        refreshTokenHash: hashToken(refreshToken),
      },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Сессия недействительна");
    }

    return decoded;
  }

  //                       CREATING NEW TOKENS
  async generateTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "30d",
    });

    await this.db.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await this.db.session.updateMany({
      where: {
        refreshTokenHash: hashToken(refreshToken),
      },
      data: {
        isActive: false,
      },
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }

  // LOGGING OUT
  async logout(refreshToken: string) {
    await this.db.session.updateMany({
      where: {
        refreshTokenHash: hashToken(refreshToken),
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }
}
