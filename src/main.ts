import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configura la documentación y el esquema de autenticación JWT.
  const config = new DocumentBuilder()
    .setTitle('Mi WapChat API en NestJS')
    .setDescription('Documentación oficial del backend')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Interfaz disponible en /api-docs.
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Swagger disponible en http://localhost:${process.env.PORT ?? 4000}/api-docs`);
}
bootstrap();
