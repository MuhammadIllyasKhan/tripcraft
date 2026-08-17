// Import this first to initialize Sentry
import './instrument';

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for external API clients / frontend / Postman
  app.enableCors();

  // Register Sentry global exception filter before other global handlers so
  // unexpected exceptions are reported to Sentry without blocking the normal
  // backend HTTP response flow.
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryGlobalFilter(httpAdapter));

  // Enable global validation pipe with auto-transform enabled
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Setup Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TripCraft AI')
    .setDescription('AI Travel Itinerary Planner API. Submit a destination, duration, budget, and email to get a personalized travel plan.')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();

