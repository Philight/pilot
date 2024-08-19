import * as Sentry from "@sentry/remix";
import { RemixServer } from "@remix-run/react";
import { createContentSecurityPolicy } from "@shopify/hydrogen";
import type { AppLoadContext, EntryContext } from "@shopify/remix-oxygen";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

import { getWeaverseCsp } from "~/weaverse/csp";


export const handleError = Sentry.sentryHandleError;

// --------------------------------------------------------------------
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
  // integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
});

// --------------------------------------------------------------------

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    ...getWeaverseCsp(request, context),
    shop: {
      checkoutDomain:
        context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
  });
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Content-Security-Policy", header);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
