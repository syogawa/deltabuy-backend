import { IsEnum } from "class-validator";
import { DealStatus } from "../../../generated/prisma/enums";

export class UpdateDealStatusDto {
  @IsEnum(DealStatus)
  status!: DealStatus;
}
