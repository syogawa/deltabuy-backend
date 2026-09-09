import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabaseService } from "../database/database.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, DatabaseService],
  imports: [
    ConfigModule,
    ThrottlerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: "30d",
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
