import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: "https://033bf20c3c27c0d77c9344f6c4a6b28d@o4507801240010753.ingest.de.sentry.io/4507801244794960",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // To use Sentry OpenTelemetry auto-instrumentation
  // default: false
  autoInstrumentRemix: true,

  // Optionally capture action formData attributes with errors.
  // This requires `sendDefaultPii` set to true as well.
  captureActionFormDataKeys: {
    key_x: true,
    key_y: true,
  },
  // To capture action formData attributes.
  sendDefaultPii: true,

  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ["log", "info", "warn", "error", "debug", "assert"],
    }),
  ],
});
