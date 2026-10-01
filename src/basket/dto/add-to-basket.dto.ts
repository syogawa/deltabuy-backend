import { IsInt, IsOptional, Min, Max } from "class-validator";

export class AddToBasketDto {
  @IsInt()
  productId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  quantity?: number = 1;
}
