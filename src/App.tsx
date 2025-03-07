import "./global.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";

import type { AppType } from "@/hono-routes/index";
import { hc } from "hono/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
// import {
//   SupabaseContext,
//   AuthProvider,
//   OrganizationsProvider,
// } from "src/contexts";
// import { SupabaseContext } from "@/contexts/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider, Stack, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// import { createClient, type Session } from "@supabase/supabase-js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

// const supabase = createClient(
//   process.env.BUN_PUBLIC_SUPABASE_URL!,
//   process.env.BUN_PUBLIC_SUPABASE_ANON_KEY!
// );

const queryClient = new QueryClient();

const honoClient = hc<AppType>("/");

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0, // React Query manages data loading and caching
  defaultNotFoundComponent: () => {
    return (
      <Stack justify="center" align="center">
        <Title order={4}>four zero four</Title>
      </Stack>
    );
  },
  context: {
    queryClient,
    // supabaseClient: undefined!,
    honoClient,
    // session: null,
    // setSession: () => {},
  },
});

// Register things for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  //   const [session, setSession] = React.useState<Session | null>(null);

  //   React.useEffect(() => {
  //     supabase.auth.getSession().then(({ data: { session } }) => {
  //       setSession(session);
  //     });

  //     const {
  //       data: { subscription },
  //     } = supabase.auth.onAuthStateChange((_event, session) => {
  //       setSession(session);
  //     });

  //     return () => subscription.unsubscribe();
  //   }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <SupabaseContext.Provider value={{ supabase, session, setSession }}> */}
      {/* <AuthProvider>
          <OrganizationsProvider> */}
      <MantineProvider
        defaultColorScheme="dark"
        theme={{
          components: {
            Modal: {
              styles: {
                title: {
                  fontSize: 18,
                  fontWeight: 700,
                },
              },
            },
          },
        }}
      >
        <Notifications />
        <RouterProvider
          router={router}
          // context={{ supabaseClient: supabase, session, setSession }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
      {/* </OrganizationsProvider>
        </AuthProvider> */}
      {/* </SupabaseContext.Provider> */}
    </QueryClientProvider>
  );
}
