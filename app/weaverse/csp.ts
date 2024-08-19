import type { AppLoadContext } from "@shopify/remix-oxygen";

export function getWeaverseCsp(request: Request, context: AppLoadContext) {
  let url = new URL(request.url);
  // Get weaverse host from query params
  let weaverseHost =
    url.searchParams.get("weaverseHost") || context.env.WEAVERSE_HOST;
  let isDesignMode = url.searchParams.get("weaverseHost");
  let weaverseHosts = ["*.weaverse.io", "*.shopify.com", "*.myshopify.com"];
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }
  let updatedCsp: {
    [x: string]: string[] | string | boolean;
  } = {
    defaultSrc: [
      "data:",
      "*.youtube.com",
      "*.youtube.com/clip",
      "*.youtu.be",
      "*.vimeo.com",
      "*.google.com",
      "*.google-analytics.com",
      "*.googletagmanager.com",
      "cdn.alireviews.io",
      "cdn.jsdelivr.net",
      "*.alicdn.com",
      "*.ingest.de.sentry.io",
      "*.sentry.io",
      ...weaverseHosts,
    ],
    connectSrc: [
      "vimeo.com",
      "*.google-analytics.com",
      ...weaverseHosts,
      "*.ingest.de.sentry.io",
      "*.sentry.io",
    ],
    styleSrc: weaverseHosts,
    imgSrc: [
      "*",
      "https://ecdn.speedsize.com/96646a73-11d1-4ec5-a14d-66bc51e8738d/https://www.stellarequipment.com/wp-content/uploads/2022/10/INTERSTELLAR_MEGA_IMAGE_00200_KORUA_Japan-2019_HighRes_DESKTOP_2000x1190.jpg",
      "https://www.switchbacktravel.com/sites/default/files/images/articles/Burton%20ak%20Embark%20Gore-Tex%20women%27s%20snowboard%20jacket%20%28carving%29.jpg",
      "https://pacificboarder.com/cdn/shop/files/210000076376-Ride-Men_s-Peace-Seeker-Snowboard-2024_2048x.png?v=1695849568",
      "https:",
      "data:",
    ],
  };
  if (isDesignMode) {
    updatedCsp.frameAncestors = ["*"];
  }
  return updatedCsp;
}
