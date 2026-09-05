import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
export class RegisterAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
