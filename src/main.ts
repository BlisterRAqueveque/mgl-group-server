import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configurations/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  await app.listen(envs.PORT);
}
bootstrap();
