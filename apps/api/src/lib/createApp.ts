import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon("🌿"));
  app.use(logger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}
