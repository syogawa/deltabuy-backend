import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { DealService } from "./deal.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealStatusDto } from "./dto/update-deal-status.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@ApiTags("deal")
@Controller("deal")
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post("create")
  create(
    @Body() createDealDto: CreateDealDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.dealService.create(createDealDto, req.user.id);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.dealService.findOne(id, req.user);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDealDto: UpdateDealStatusDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.dealService.updateStatus(id, updateDealDto, req.user);
  }
}
