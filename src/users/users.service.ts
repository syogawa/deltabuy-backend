import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findOneByMail(dto: CreateUserDto) {
    //поиск юзера по почте
    const user = await this.db.user.findFirst({
      where: { email: dto.email },
    });
    //возврат юзера
    if (user) {
      return "Пользователь с таким email уже существует";
    }
    //Если пользователь не найден
    throw new NotFoundException();
  }

  async create(dto: CreateUserDto) {
    return this.db.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
