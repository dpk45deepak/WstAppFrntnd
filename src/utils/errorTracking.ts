// src/utils/errorTracking.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_NODE_ENV,
  tracesSampleRate: 1.0,
});

export const captureError = (error: any, context?: any) => {
  Sentry.captureException(error, { extra: context });
};