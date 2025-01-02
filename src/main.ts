import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  ACCOUNT_PACKAGE_NAME,
  ACCOUNT_SERVICE_NAME,
} from './presentation/grpc/specifications/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    name: ACCOUNT_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      package: ACCOUNT_PACKAGE_NAME,
      url: 'localhost:6000',
      protoPath: join(process.cwd(), 'recipe/schema.proto'),
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(8000);
}

bootstrap();
