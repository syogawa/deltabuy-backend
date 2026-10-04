import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  BadRequestException,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
