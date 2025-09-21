import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/api/reference", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Chive API",
    },
  });

  app.get(
    "/docs",
    Scalar({
      pageTitle: "API Documentation",
      sources: [
        { url: "/api/reference", title: "API" },
        // Better Auth schema generation endpoint
        { url: "/api/auth/reference", title: "Auth" },
      ],
    })
  );
}
