import { z } from "@hono/zod-openapi";

export const ResponseSchema = z.object({
  message: z.string().openapi({ example: "Hello, world!" }),
  method: z.string().openapi({ example: "GET" }),
});
