import { IsNotEmpty, IsString } from "class-validator";
export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;
}
