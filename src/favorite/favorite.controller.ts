import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { AddFavoriteDto } from "./dto/add-favorite.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@UseGuards(AccessTokenGuard)
@Controller("favorite")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(
    @Body() createFavoriteDto: AddFavoriteDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.favoriteService.addFavorite(createFavoriteDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: authRequestType.AuthRequest) {
    return this.favoriteService.findAll(req.user.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: authRequestType.AuthRequest) {
    return this.favoriteService.remove(+id, req.user.id);
  }
}
