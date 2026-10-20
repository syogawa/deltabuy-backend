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

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ---------------NEED TO DO---------------------------------
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

  @UseGuards(AccessTokenGuard)
  @Get("me")
  async getProfile(@Req() req: authRequestType.AuthRequest) {
    return this.usersService.getMe(req.user.id);
  }
  @UseGuards(AccessTokenGuard)
  @Patch("me")
  async updateProfile(
    @Req() req: authRequestType.AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete("me")
  remove(@Req() req: authRequestType.AuthRequest) {
    return this.usersService.remove(req.user.id);
  }
}
