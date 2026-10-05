import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsInt()
  dealId!: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsInt()
  productId!: number;
}
