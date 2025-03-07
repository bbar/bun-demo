import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { apiReference } from "@scalar/hono-api-reference";
import api from "@/hono-routes/api";
import { ResponseSchema } from "@/types";

const app = new OpenAPIHono();

app.openAPIRegistry.register(`Response`, ResponseSchema);
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

const routes = app.route("/api", api);

app.doc("/api/reference/json", {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "Test API",
  },
});

app.get(
  "/api/reference",
  apiReference({
    theme: "elysiajs",
    spec: {
      url: "/api/reference/json",
    },
  })
);

app.onError((err, c) => {
  console.error("Error:", err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json(
    {
      message: "Internal Server Error",
      error: err.message,
    },
    500
  );
});

export default app;
export type AppType = typeof routes;
