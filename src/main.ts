import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Rest API of the Ecommerce')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  await app.listen(port);
}
bootstrap()
