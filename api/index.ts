import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new SentryGlobalFilter(httpAdapter));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('TripCraft AI')
      .setDescription('AI Travel Itinerary Planner API.')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    await app.init();
  }
  
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
}
