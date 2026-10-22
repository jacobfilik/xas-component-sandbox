import { Box, Card, CardContent, Pagination, Stack } from "@mui/material";
import type { DataInfo, TiledEntryInfo, TiledSearchResponse } from "./models";
import { useQuery } from "@tanstack/react-query";
import { getRunsInVisit } from "./queryfunctions";
import RunViewList from "./RunViewList";
import { DataChart } from "./DataChart";
import { useState } from "react";
import DataChartWrapper from "./DataChartWrapper";
import TiledContainerPanel from "./ListenTiled";

export default function RunViewForVisit(props: {
  beamline: string;
  visit: string;
  offset: number;
  setOffset: (ofset: number) => void;
}) {
  const query = useQuery<TiledSearchResponse, Error>({
    queryKey: [
      "search",
      props.visit,
      "-start.time",
      props.offset,
      props.beamline,
    ],
    queryFn: () =>
      getRunsInVisit(
        props.beamline,
        props.visit,
        props.offset,
        10,
        "-start.time",
      ),
    refetchInterval: 5000,
  });

  const [id, setId] = useState<TiledEntryInfo | null>(null);
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);

  console.log(id);

  if (!query.data) {
    return <Stack>No data</Stack>;
  }
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    props.setOffset((value - 1) * 10);
  };

  return (
    <Stack direction={"row"} spacing="10px" overflow="hidden" flex={1}>
      <Stack spacing="10px">
        <RunViewList data={query.data.data} setId={setId}></RunViewList>
        <Pagination
          onChange={handleChange}
          page={props.offset / 10 + 1}
          count={Math.ceil(query.data.meta.count / 10)}
          variant="outlined"
        />
      </Stack>

      <Stack flex={1} overflow="auto">
        {id ? (
          <TiledContainerPanel
            beamline={props.beamline}
            visit={props.visit}
            taskID={id.id}
            setDataInfo={setDataInfo}
          />
        ) : (
          <Box></Box>
        )}
      </Stack>
      <Stack height="100%" flex={2}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ height: "100%" }}>
            {dataInfo && id ? (
              <DataChartWrapper
                beamline={props.beamline}
                visit={props.visit}
                dataInfo={dataInfo}
                id={id}
              />
            ) : (
              <DataChart data={null} />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
