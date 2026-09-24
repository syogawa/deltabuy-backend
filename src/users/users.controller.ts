import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SkipThrottle } from "@nestjs/throttler";
// import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessTokenGuard } from "../auth/guards/AccessTokenGuard";

@SkipThrottle({ auth: true })
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly,
  ) {}

  @Get("mail/:mail")
  async findUser(@Param("mail") mail: string) {
    const res = await this.usersService.findOneByMail(mail);
    if (!res) {
      throw new ConflictException("User not found!");
    }
    return res;
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
  async getProfile(@Req() req) {
    return this.usersService.getMe(req.user["userId"]);
  }
  @UseGuards(AccessTokenGuard)
  @Patch("me")
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user["userId"], updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
