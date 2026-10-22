import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DealStatus } from "../../../generated/prisma/enums";

export class UpdateDealStatusDto {
  @ApiProperty({ enum: DealStatus })
  @IsEnum(DealStatus)
  status!: DealStatus;
}
