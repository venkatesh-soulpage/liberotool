import * as Sentry from "@sentry/node";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: process.env.SENTRY_DSN,
});
