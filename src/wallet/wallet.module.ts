import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { AuthModule } from "../auth/auth.module";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
