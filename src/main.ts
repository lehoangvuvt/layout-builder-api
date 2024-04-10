import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
  app.use(express.json({ limit: ' ' }))
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3001
  await app.listen(port);
}
bootstrap();
