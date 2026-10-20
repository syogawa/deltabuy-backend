import { Module } from "@nestjs/common";
import { ProductImageService } from "./image.service";
import { ProductImageController } from "./image.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ImageModule {}
