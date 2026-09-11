import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { AuthController } from "../auth/auth.controller";
import { DatabaseService } from "../database/database.service";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [ProductController],
  providers: [ProductService, DatabaseService, JwtService],
})
export class ProductModule {}
