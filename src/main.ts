import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('APP_PORT');
  const apiPrefix = configService.getOrThrow<string>('API_PREFIX');
  const apiVersion = configService.getOrThrow<string>('API_VERSION');
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');

  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(port);

  console.log(
    `HRIS API running on http://localhost:${port}/${apiPrefix}/${apiVersion}`,
  );
}

void bootstrap();