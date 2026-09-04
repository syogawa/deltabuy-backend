import { Controller, Get, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("mail/:mail")
  async findUser(@Param("mail") mail: string) {
    const re = await this.usersService.findOneByMail(mail);
    if (!re) {
      return "nothing";
    }
    return `success!, ${re.name}`;
  }

  @Get()
  findAll() {
    // return this.usersService.findAll();
    return "something good";
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
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
