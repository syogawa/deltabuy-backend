import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { DealService } from "./deal.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealStatusDto } from "./dto/update-deal-status.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@UseGuards(AccessTokenGuard)
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
  findOne(@Param("id") id: string) {
    return this.dealService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDealDto: UpdateDealStatusDto) {
    return this.dealService.updateStatus(+id, updateDealDto);
  }
}
