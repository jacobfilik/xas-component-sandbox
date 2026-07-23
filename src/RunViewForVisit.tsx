import { Box, Card, CardContent, Pagination, Stack } from "@mui/material";
import type { TiledEntryInfo, TiledSearchResponse } from "./models";
import { useQuery } from "@tanstack/react-query";
import { getRunsInVisit } from "./queryfunctions";
import RunViewList from "./RunViewList";
import ListenTiledPanel from "./ListenTiled";
import { DataChart } from "./DataChart";
import { useState } from "react";
import DataChartWrapper from "./DataChartWrapper";

export default function RunViewForVisit(props: {
  visit: string;
  page: number;
  setPage: (page: number) => void;
}) {
  const query = useQuery<TiledSearchResponse, Error>({
    queryKey: ["search", props.visit, "-start.time", props.page],
    queryFn: () => getRunsInVisit(props.visit, props.page, 10, "-start.time"),
    refetchInterval: 5000,
  });

  const [id, setId] = useState<TiledEntryInfo | null>(null);
  const [dataName, setDataName] = useState<string | null>(null);

  console.log(id);

  if (!query.data) {
    return <Stack>No data</Stack>;
  }
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    props.setPage(value - 1);
  };

  return (
    <Stack direction={"row"} spacing="10px" overflow="hidden">
      <Stack spacing="10px">
        <RunViewList data={query.data.data} setId={setId}></RunViewList>
        <Pagination
          onChange={handleChange}
          page={props.page + 1}
          count={Math.ceil(query.data.meta.count / 10)}
          variant="outlined"
        />
      </Stack>

      <Stack flex={1} overflow="auto">
        {id ? (
          <ListenTiledPanel taskID={id.id} setDataName={setDataName} />
        ) : (
          <Box></Box>
        )}
      </Stack>
      <Stack height="100%" flex={2}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ height: "100%" }}>
            {dataName && id ? (
              <DataChartWrapper dataName={dataName} id={id} />
            ) : (
              <DataChart data={null} />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
