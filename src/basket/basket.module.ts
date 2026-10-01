import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
