import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { Test2Middleware } from './middlewares/test2.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
  app.use(express.json({ limit: '50mb' }))
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor())
  const port = process.env.PORT ?? 3001
  await app.listen(port);
}
bootstrap();
