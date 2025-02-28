import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { serve } from "bun";
import index from "./index.html";
import hono from "@/hono-routes";

const elysia = new Elysia()
  .use(swagger({ path: "/e/reference" }))
  .get("/e", () => {
    return {
      message: "Welcome from Elysia!",
      method: "GET",
    };
  })
  .get("/e/hello", () => {
    return {
      message: "Hello from Elysia!",
      method: "GET",
    };
  })
  .post("/e/hello", () => {
    return {
      message: "Hello from Elysia!",
      method: "POST",
    };
  });

const server = serve({
  routes: {
    "/*": index,
    // This is an OPEN issue in Bun: https://github.com/oven-sh/bun/issues/17597
    // When resolved, we should be able to use the following: "api*"
    // "/api/*": hono.fetch,
    // "/e/*": elysia.fetch,
    "/api": hono.fetch,
    "/api/*": {
      GET: hono.fetch,
      PUT: hono.fetch,
      POST: hono.fetch,
      PATCH: hono.fetch,
      DELETE: hono.fetch,
      OPTIONS: hono.fetch,
      HEAD: hono.fetch,
    },
    "/e": elysia.fetch,
    "/e/*": {
      GET: elysia.fetch,
      PUT: elysia.fetch,
      POST: elysia.fetch,
      PATCH: elysia.fetch,
      DELETE: elysia.fetch,
      OPTIONS: elysia.fetch,
      HEAD: elysia.fetch,
    },
  },
  error(error) {
    console.error(error);
    return new Response(`Internal Error: ${error.message}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
