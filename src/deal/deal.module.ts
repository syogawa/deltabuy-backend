import { Module } from "@nestjs/common";
import { DealService } from "./deal.service";
import { DealController } from "./deal.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [DealController],
  providers: [DealService],
})
export class DealModule {}
