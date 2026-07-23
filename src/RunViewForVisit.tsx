import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import type { TiledSearchResponse } from "./models";
import { useQuery } from "@tanstack/react-query";
import { getRunsInVisit } from "./queryfunctions";
import RunViewList from "./RunViewList";
import ListenTiledPanel from "./ListenTiled";
import { DataChart } from "./DataChart";
import { useState } from "react";
import DataChartWrapper from "./DataChartWrapper";

export default function RunViewForVisit(props: { visit: string }) {
  const query = useQuery<TiledSearchResponse, Error>({
    queryKey: ["search", props.visit, "-start.time"],
    queryFn: () => getRunsInVisit(props.visit, 0, 20, "-start.time"),
  });

  const [id, setId] = useState<string | null>(null);
  const [dataName, setDataName] = useState<string | null>(null);

  console.log(id);

  return (
    <Stack>
      {query.data ? (
        <Stack direction={"row"}>
          <RunViewList data={query.data.data} setId={setId}></RunViewList>
          <Stack flex={1}>
            {id ? (
              <ListenTiledPanel taskID={id} setDataName={setDataName} />
            ) : (
              <Box></Box>
            )}
          </Stack>
          <Stack flex={2}>
            <Card>
              <CardContent>
                {dataName && id ? (
                  <DataChartWrapper dataName={dataName} id={id} />
                ) : (
                  <DataChart data={null} />
                )}
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      ) : (
        <Typography>Nothing to see here</Typography>
      )}
    </Stack>
  );
}
