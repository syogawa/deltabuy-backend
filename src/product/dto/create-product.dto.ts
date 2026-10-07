import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
export class CreateProductDto {
  @MinLength(3)
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsString()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  categoryIds!: number[];
}
