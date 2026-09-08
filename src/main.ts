import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT!);
  app.enableCors({ origin: process.env.FRONTEND_URL!, credentials: true });
}
bootstrap();
