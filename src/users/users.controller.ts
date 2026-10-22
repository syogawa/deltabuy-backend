import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
// import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";
import * as authRequestType from "../auth/types/auth-request.type";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly,
  ) {}

  // ---------------NEED TO DO---------------------------------
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch("me/avatar")
  async setAvatar(@Req() req: authRequestType.AuthRequest) {
    return "SOON...";
  }

  @Get()
  findAll() {
    // return this.usersService.findAll();
    return "something good";
  }

  // @Get(":id")
  // findOneById(@Param("id") id: string) {
  //   return this.usersService.findOneById(+id);
  // }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get("me")
  async getProfile(@Req() req: authRequestType.AuthRequest) {
    return this.usersService.getMe(req.user.id);
  }
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch("me")
  async updateProfile(
    @Req() req: authRequestType.AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete("me")
  remove(@Req() req: authRequestType.AuthRequest) {
    return this.usersService.remove(req.user.id);
  }
}
