import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  // CORS обязан быть включён ДО listen
  app.enableCors({ origin: process.env.FRONTEND_URL!, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // раздача загруженных картинок: url в БД "images/<name>" -> GET /files/images/<name>
  app.useStaticAssets(join(process.cwd(), "data"), { prefix: "/files" });
  await app.listen(process.env.PORT!);
}
bootstrap();
