import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@Controller("review")
@UseGuards(AccessTokenGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.reviewService.create(createReviewDto, req.user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: authRequestType.AuthRequest,
  ) {
    return this.reviewService.update(
      +id,
      updateReviewDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: authRequestType.AuthRequest) {
    return this.reviewService.remove(req.user.id, +id, req.user.role);
  }
}
