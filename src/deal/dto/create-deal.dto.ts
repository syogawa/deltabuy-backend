import { IsEnum, IsInt, IsJSON, IsNumber, IsString } from "class-validator";
import { Currency } from "../../../generated/prisma/enums";

export class CreateDealDto {
  @IsInt()
  quantity!: number;

  @IsJSON()
  productSnapshot!: JSON;

  @IsNumber()
  price!: number;

  @IsEnum(Currency)
  currency!: Currency;

  @IsInt()
  productId!: number;
}
