import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME } from './interface/grpc/specifications/schema';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ORDER_PACKAGE_NAME,
      protoPath: './recipe/schema.proto',
      url: 'localhost:5000', // Adjust port as needed
    },
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(8000);
}
bootstrap();
