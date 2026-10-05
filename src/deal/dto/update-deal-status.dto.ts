import { PartialType } from "@nestjs/mapped-types";
import { CreateDealDto } from "./create-deal.dto";
import { IsEnum, IsOptional } from "class-validator";
import { DealStatus } from "../../../generated/prisma/enums";

export class UpdateDealStatusDto extends PartialType(CreateDealDto) {
  @IsEnum(DealStatus)
  status!: DealStatus;
}
