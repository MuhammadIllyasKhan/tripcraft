import * as dotenv from 'dotenv';
dotenv.config();

import * as Sentry from '@sentry/nestjs';
import { nestIntegration } from '@sentry/nestjs';

// Ensure to call this before importing any other modules!
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 1.0,
    integrations: [nestIntegration()],
  });
  console.log('Sentry initialized with DSN:', process.env.SENTRY_DSN);
} else {
  console.warn('SENTRY_DSN is not set in the environment');
}
