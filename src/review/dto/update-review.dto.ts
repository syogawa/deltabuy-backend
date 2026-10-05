import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewDto } from "./create-review.dto";
import { IsInt, IsOptional, IsString, Max } from "class-validator";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsString()
  @IsOptional()
  @Max(1500)
  text?: string;

  @IsInt()
  @IsOptional()
  rating?: number;
}
