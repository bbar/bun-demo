import { OpenAPIHono as Hono, z, createRoute } from "@hono/zod-openapi";
import { ResponseSchema } from "@/types";
import hello from "@/hono-routes/api/hello";

const api = new Hono();

api.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Some description",
      },
    },
  }),
  (c) => {
    return c.json({
      message: "Welcome from Hono!",
      method: c.req.method,
    });
  }
);

api.route("/hello", hello);

export default api;
