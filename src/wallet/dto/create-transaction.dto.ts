import { IsEnum, IsInt } from "class-validator";
import { TransactionType } from "../../../generated/prisma/enums";
import { ApiProperty } from "@nestjs/swagger";

export class walletTransactionDto {
  @IsInt()
  dealId!: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  transactionType!: TransactionType;
}
