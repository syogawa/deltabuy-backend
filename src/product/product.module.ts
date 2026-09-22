import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { AuthController } from "../auth/auth.controller";
import { DatabaseService } from "../database/database.service";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    DatabaseService,
    JwtService,
    AuthService,
    AccessTokenGuard,
  ],
})
export class ProductModule {}
