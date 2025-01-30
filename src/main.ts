import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./transform.interceptor";
import { APP_PORT } from "./constants";

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? APP_PORT);
  logger.log(`Server running on http://localhost:${APP_PORT}`);
}
bootstrap();
