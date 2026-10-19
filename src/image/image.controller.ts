import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import { ProductImageService } from "./image.service";
import * as authRequestType from "../auth/types/auth-request.type";

const MAX_FILES = 10;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

@Controller("images")
export class ProductImageController {
  constructor(private readonly service: ProductImageService) {}

  @UseGuards(AccessTokenGuard)
  @Post("products/:productId")
  @UseInterceptors(
    FilesInterceptor("files", MAX_FILES, {
      storage: memoryStorage(),
      limits: { fileSize: 12 * 1024 * 1024 },
    }),
  )
  async upload(
    @Param("productId", ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body("positions") positionsRaw: string | undefined,
    @Req() req: authRequestType.AuthRequest,
  ) {
    if (!files?.length) throw new BadRequestException("Файлы не переданы");

    for (const f of files) {
      if (!ALLOWED.includes(f.mimetype)) {
        throw new BadRequestException(`Недопустимый тип: ${f.originalname}`);
      }
    }

    let positions: number[] | undefined;
    if (positionsRaw) {
      try {
        positions = JSON.parse(positionsRaw);
      } catch {
        throw new BadRequestException("positions должен быть JSON-массивом");
      }
      const valid =
        Array.isArray(positions) &&
        positions.length === files.length &&
        positions.every((p) => Number.isInteger(p) && p >= 0) &&
        new Set(positions).size === positions.length;
      if (!valid) {
        throw new BadRequestException(
          "positions: массив уникальных целых >= 0, по одному на файл",
        );
      }
    }

    return this.service.addImages(req.user.id, productId, files, positions);
  }
}
