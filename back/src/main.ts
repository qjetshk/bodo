import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getPort from 'get-port';
import { ValidationPipe } from '@nestjs/common';
import { env } from 'process';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
      origin: config.getOrThrow<string>('FRONTEND_URL'),
      credentials: true,
    })

  await app.listen(env.PORT ?? 4200, "0.0.0.0");
  console.log(`app is running on ${env.PORT ?? 4200}`);
}

bootstrap();
