import { Stack, useColorScheme } from "@mui/material";
import { GraphiQL } from "graphiql";
import "graphiql/style.css";

const graph_url = "/graph/graphql";

//@ts-ignore
async function fetcher(graphQLParams) {
  const response = await fetch(graph_url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphQLParams),
  });
  return response.json();
}
export default function GraphiqlComponent() {
  const { mode, systemMode } = useColorScheme();

  let resolvedMode = mode === "system" ? systemMode : mode;
  if (resolvedMode !== "light" && resolvedMode !== "dark") {
  }
  return (
    <Stack sx={{ height: "100%", width: "100%" }}>
      <GraphiQL fetcher={fetcher} forcedTheme={resolvedMode} />
    </Stack>
  );
}
