import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: process.env.FRONTEND_URL!, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // раздача загруженных картинок: url в БД "images/<name>" -> GET /files/images/<name>
  app.useStaticAssets(join(process.cwd(), "data"), { prefix: "/files" });

  // Swagger UI: http://localhost:<PORT>/docs  (в продакшене отключён)
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Deltabuy API")
      .setDescription("Бэкенд маркетплейса Deltabuy")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(process.env.PORT!);
}
bootstrap();
