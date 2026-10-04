import { PartialType } from "@nestjs/mapped-types";
import { CreateDealDto } from "./create-deal.dto";
import {
  IsBoolean,
  IsEnum,
  IsJSON,
  IsNumber,
  IsOptional,
} from "class-validator";
import { DealStatus } from "../../../generated/prisma/enums";

export class UpdateDealDto extends PartialType(CreateDealDto) {
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @IsOptional()
  @IsJSON()
  productSnapshot?: JSON;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
