import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { walletTransactionDto } from "./dto/create-transaction.dto";
import * as authRequestType from "../auth/types/auth-request.type";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ProductService } from "../product/product.service";

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@ApiTags("wallet")
@Controller("wallet")
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly productService: ProductService,
  ) {}

  //Создание сделки
  @Post("transaction")
  async create(
    @Body() walletTransactionDto: walletTransactionDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    const userId = req.user.id;
    const product = await this.productService.findOne(
      walletTransactionDto.productId,
    );
    

    return this.walletService.createTransaction(walletTransactionDto);
  }
}
