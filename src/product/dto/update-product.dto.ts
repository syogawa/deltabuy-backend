import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import {
  IsBoolean,
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
  ArrayNotEmpty,
  IsArray,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @MinLength(3)
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  categoryIds?: number[];
}
