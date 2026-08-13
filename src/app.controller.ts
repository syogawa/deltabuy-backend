import { Controller, Get, ParseIntPipe, Param, BadRequestException, Post,UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/:id")
  getId(@Param('id', ParseIntPipe) id: number) {
    if (id < 1){
      throw new BadRequestException('Error! Number cant be less than one');
    }
    return id;
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  create(@Body() dto: CreateDto) {
    console.log('post');
    return dto;
  }
  
}
