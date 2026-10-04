import { IsEnum, IsJSON, IsNumber, IsString } from "class-validator";
import { Currency } from "../../../generated/prisma/enums";

export class CreateDealDto {
  @IsNumber()
  quantity!: number;

  @IsJSON()
  productSnapshot!: JSON;

  @IsNumber()
  price!: number;

  @IsEnum(Currency)
  currency!: Currency;
}
