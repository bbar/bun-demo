import { OpenAPIHono as Hono, z, createRoute } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";

import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { serve } from "bun";
import index from "./index.html";

// For routing with Hono, and composing routes, check here: https://hono.dev/docs/guides/rpc#using-rpc-with-larger-applications

const ResponseSchema = z.object({
  message: z.string().openapi({ example: "Hello, world!" }),
  method: z.string().openapi({ example: "GET" }),
});

const elysia = new Elysia()
  .use(swagger({ path: "/e/reference" }))
  .get("/e/hello", () => {
    return {
      message: "Hello from Elysia!",
      method: "GET",
    };
  });

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
      message: "Hello from Hono!",
      method: c.req.method,
    });
  }
);

const hello = new Hono();

hello
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

const hono = new Hono();

// Itr over all namespaces like this:
// for (const [namespace, value] of Object.entries(WfTsZ)) {
//   const { Zod = {} } = value;
//   for (const [type, schema] of Object.entries(Zod)) {
//     // console.log(`${namespace}.${type}`);
//     // app.openAPIRegistry.register(`${namespace}.${type}`, schema);
//     if (!["Responses"].includes(namespace)) {
//       app.openAPIRegistry.register(
//         `${namespace}.${type}`,
//         schema as z.ZodSchema,
//       );
//     }
//   }
// }

hono.openAPIRegistry.register(`Response`, ResponseSchema);

const honoRoutes = hono.route("/api/hello", hello);
// .route("/api/other", other);

export type AppType = typeof honoRoutes;

hono.doc("/api/reference/json", {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "Test API",
  },
});

hono.get(
  "/api/reference",
  apiReference({
    theme: "elysiajs",
    spec: {
      url: "/api/reference/json",
    },
  })
);

const server = serve({
  routes: {
    "/*": index,
    "/api/*": hono.fetch,
    "/e/*": elysia.fetch,
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
