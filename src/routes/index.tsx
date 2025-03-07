import { createFileRoute } from "@tanstack/react-router";
import { Stack, Code, Title, Anchor } from "@mantine/core";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context }) => {
    const { honoClient } = context;

    const [a, b, c] = await Promise.all([
      (await honoClient.api.hello.$get()).json(),
      (
        await honoClient.api.hello.$post({
          json: {
            id: "123",
          },
        })
      ).json(),
      (
        await honoClient.api.hello[":name"].$get({
          param: {
            name: "Brent Barbata",
          },
        })
      ).json(),
    ]);
    return { a, b, c };
  },
});

function Index() {
  const { a, b, c } = Route.useLoaderData();

  return (
    <Stack p="md">
      <Title order={5}>Hono RPC Results</Title>
      <Code block>{JSON.stringify({ a, b, c }, null, 2)}</Code>
      <Anchor href="/api/reference" target="_blank">
        API Reference
      </Anchor>
    </Stack>
  );
}
