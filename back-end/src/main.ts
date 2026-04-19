// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS pour le frontend Expo
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // ✅ DÉSACTIVER COMPLÈTEMENT LA VALIDATION GLOBALE
  // Ne pas utiliser de ValidationPipe globalement
  // Ou commenter cette section complètement
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SportTracker API')
    .setDescription('API pour l\'application SportTracker')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application démarrée sur http://localhost:${port}`);
  console.log(`📚 Documentation Swagger: http://localhost:${port}/api`);
}
bootstrap();