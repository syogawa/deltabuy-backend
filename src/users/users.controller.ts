import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SkipThrottle } from "@nestjs/throttler";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";

@SkipThrottle({ auth: true })
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(":id")
  findOneById(@Param("id") id: string) {
    return this.usersService.findOneById(+id);
  }

  /*
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  */

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
