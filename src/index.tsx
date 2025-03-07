import { serve } from "bun";
import index from "./index.html";
import hono from "@/hono-routes";

const server = serve({
  routes: {
    "/*": index,
    // This is an OPEN issue in Bun: https://github.com/oven-sh/bun/issues/17597
    // When resolved, we should be able to use the following: "api*"
    // "/api/*": hono.fetch,
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
