import { IsInt, Max, Min } from "class-validator";

// Цена, валюта и снимок товара берутся на сервере из БД — клиент их не присылает
export class CreateDealDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;
}
