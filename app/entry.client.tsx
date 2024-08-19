import * as Sentry from "@sentry/remix";
import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { StrictMode, startTransition, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

// --------------------------------------------------------------------

Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  dsn: "https://033bf20c3c27c0d77c9344f6c4a6b28d@o4507801240010753.ingest.de.sentry.io/4507801244794960",
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,

  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    Sentry.replayIntegration(),
    Sentry.captureConsoleIntegration({
      levels: ["log", "info", "warn", "error", "debug", "assert"],
    }),
  ],
});

// --------------------------------------------------------------------

if (!window.location.origin.includes("webcache.googleusercontent.com")) {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}
