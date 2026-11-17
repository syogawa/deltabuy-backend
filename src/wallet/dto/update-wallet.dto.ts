import { PartialType } from "@nestjs/swagger";
import { CreateWalletDto } from "./create-transaction.dto";

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}
