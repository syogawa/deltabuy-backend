import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import { ProductImageService } from "./image.service";
import * as authRequestType from "../auth/types/auth-request.type";

const MAX_FILES = 10;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

@ApiTags("images")
@Controller("images")
export class ProductImageController {
  constructor(private readonly service: ProductImageService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post("products/:productId")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: { type: "array", items: { type: "string", format: "binary" } },
        positions: {
          type: "string",
          example: "[0,1]",
          description: "необязательно: JSON-массив позиций, по одной на файл",
        },
      },
      required: ["files"],
    },
  })
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

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch("products/:productId/order")
  @ApiBody({
    schema: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "integer" } } },
      required: ["ids"],
    },
  })
  reorder(
    @Param("productId", ParseIntPipe) productId: number,
    @Body("ids") ids: number[],
    @Req() req: authRequestType.AuthRequest,
  ) {
    if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) {
      throw new BadRequestException("ids должен быть массивом целых чисел");
    }
    return this.service.reorder(req.user.id, productId, ids);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put("products/:productId/:imageId")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
      required: ["file"],
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 12 * 1024 * 1024 },
    }),
  )
  replace(
    @Param("productId", ParseIntPipe) productId: number,
    @Param("imageId", ParseIntPipe) imageId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: authRequestType.AuthRequest,
  ) {
    if (!file) throw new BadRequestException("Файл не передан");
    if (!ALLOWED.includes(file.mimetype)) {
      throw new BadRequestException("Недопустимый тип файла");
    }
    return this.service.replace(req.user.id, productId, imageId, file);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete("products/:productId/:imageId")
  remove(
    @Param("productId", ParseIntPipe) productId: number,
    @Param("imageId", ParseIntPipe) imageId: number,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.service.remove(req.user.id, productId, imageId);
  }
}
