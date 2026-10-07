import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCategoryDto {
  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  @MaxLength(40)
  @MinLength(3)
  name!: string;
}
