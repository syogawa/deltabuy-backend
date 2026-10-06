import { Module } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
