import React from "react";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { hc } from "hono/client";
import type { AppType } from "@/hono-routes/index";
import type { QueryClient } from "@tanstack/react-query";
// import type { Session, SupabaseClient } from "@supabase/supabase-js";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

const honoClient = hc<AppType>("/api");

export interface WfRouterContext {
  queryClient: QueryClient;
  // supabaseClient: SupabaseClient;
  honoClient: typeof honoClient;
  // session: Session | null;
  // setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

export const Route = createRootRouteWithContext<WfRouterContext>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <React.Suspense>
        <TanStackRouterDevtools />
      </React.Suspense>
    </>
  ),
});
