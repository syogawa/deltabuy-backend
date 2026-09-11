import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @MinLength(3)
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsString()
  description?: string;
}
