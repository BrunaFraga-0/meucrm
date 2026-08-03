import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const porta = process.env.PORT || 3000;

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });
}

bootstrap();
