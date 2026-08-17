import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint', description: 'Returns simple status message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug-sentry')
  @ApiOperation({ summary: 'Debug Sentry', description: 'Throws an error to test Sentry' })
  getDebugSentry(): string {
    throw new Error('My first Sentry error!');
  }
}
