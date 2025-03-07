import { OpenAPIHono, z, createRoute } from "@hono/zod-openapi";
import { ResponseSchema } from "@/types";

const hello = new OpenAPIHono()
  .openapi(
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
        message: "Hello from Hono!",
        method: c.req.method,
      });
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      request: {
        body: {
          content: {
            "application/json": {
              schema: z.object({
                id: z.string().openapi({ example: "123" }),
              }),
            },
          },
        },
      },
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
        message: "Hello from Hono!",
        method: c.req.method,
      });
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{name}",
      request: {
        params: z.object({
          name: z.string(),
        }),
      },
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
      const { name } = c.req.valid("param");

      return c.json({
        message: `Hello, ${name}!`,
        method: c.req.method,
      });
    }
  );

export default hello;
