import { auth } from "@/auth";
import { createRouter } from "@/lib/createApp";

const router = createRouter();

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default router;
