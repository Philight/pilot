import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { StrictMode, startTransition, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import * as Sentry from "@sentry/remix";

// --------------------------------------------------------------------

Sentry.init({
  dsn: "__DSN__",
  tracesSampleRate: 1,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
  ],
  // ...
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
