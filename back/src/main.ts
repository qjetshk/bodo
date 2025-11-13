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
    origin: config.getOrThrow<string>('FRONTEND_URL')
  })

  /*   // Задаём диапазон портов как массив
  const port = await getPort({ port: Array.from({ length: 101 }, (_, i) => 4200 + i) });
  
  // Для облачной IDE слушаем на всех интерфейсах
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on port ${port}`); */

  await app.listen(env.PORT ?? 4200);
  console.log(`app is running on ${env.PORT ?? 4200}`);
}

bootstrap();
