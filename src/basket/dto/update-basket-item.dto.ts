import { IsInt, Max, Min } from "class-validator";

export class UpdateBasketItemDto {
  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;
}
