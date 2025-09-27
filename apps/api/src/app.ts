import { handle } from "hono/aws-lambda";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import configureOpenAPI from "./lib/configureOpenApi";
import createApp from "./lib/createApp";
import authRoutes from "./routes/auth";
import recipeRoutes from "./routes/recipe-routes";

const app = createApp();

app.use(secureHeaders());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

const routes = [recipeRoutes, authRoutes] as const;
type Routes = typeof routes;
export type AppType = Routes[number];

routes.forEach((route) => {
  app.route("/api", route);
});

configureOpenAPI(app);

export const handler = handle(app);

export default app;
