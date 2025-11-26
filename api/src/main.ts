import { NestFactory } from '@nestjs/core';
import * as process from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3000
  await app.listen(port)

  console.warn(`API rodando em http://0.0.0.0:${port}`)
}
bootstrap();
