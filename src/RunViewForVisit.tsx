import { Box, Card, CardContent, Pagination, Stack } from "@mui/material";
import type {
  DataInfo,
  Metadata,
  TiledEntryInfo,
  TiledSearchResponse,
} from "./models";
import { useQuery } from "@tanstack/react-query";
import { getRunsInVisit, getVisitString } from "./queryfunctions";
import RunViewList from "./RunViewList";
import { DataChart } from "./DataChart";
import { useContext, useState } from "react";
import DataChartWrapper from "./DataChartWrapper";
import TiledContainerPanel from "./ListenTiled";
import { WorkflowContext } from "./workflows/WorkflowProvider";

export default function RunViewForVisit(props: {
  beamline: string;
  offset: number;
  setOffset: (ofset: number) => void;
}) {
  const {
    tiledEntry,
    setTiledEntry,
    currentVisit,
    setWorkflowParams,
    workflowParams,
  } = useContext(WorkflowContext);

  const query = useQuery<TiledSearchResponse, Error>({
    queryKey: [
      "search",
      getVisitString(currentVisit),
      "-start.time",
      props.offset,
      props.beamline,
    ],
    queryFn: () =>
      getRunsInVisit(
        props.beamline,
        getVisitString(currentVisit),
        props.offset,
        10,
        "-start.time",
      ),
    refetchInterval: 5000,
  });

  const onIdChange = (data: TiledEntryInfo | null) => {
    if (data) {
      setTiledEntry(data);
    }
  };
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);

  const handleSetDataInfo = (dataInfo: DataInfo, meta: Metadata) => {
    setDataInfo(dataInfo);


    const source = meta.data_keys[dataInfo.datasetName].source;
    setWorkflowParams({ ...workflowParams, fpath: source });
  };
  if (!query.data || !query.data.meta) {
    return <Stack>No data</Stack>;
  }
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    props.setOffset((value - 1) * 10);
  };

  return (
    <Stack direction={"row"} spacing="10px" overflow="hidden" flex={1}>
      <Stack spacing="10px">
        <RunViewList data={query.data.data} setId={onIdChange}></RunViewList>
        <Pagination
          onChange={handleChange}
          page={props.offset / 10 + 1}
          count={Math.ceil(query.data.meta.count / 10)}
          variant="outlined"
        />
      </Stack>

      <Stack flex={1} overflow="auto">
        {tiledEntry ? (
          <TiledContainerPanel
            beamline={props.beamline}
            visit={getVisitString(currentVisit)}
            taskID={tiledEntry.id}
            setDataInfo={handleSetDataInfo}
          />
        ) : (
          <Box></Box>
        )}
      </Stack>
      <Stack height="100%" flex={2}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ height: "100%" }}>
            {dataInfo && tiledEntry ? (
              <DataChartWrapper
                beamline={props.beamline}
                visit={getVisitString(currentVisit)}
                dataInfo={dataInfo}
                id={tiledEntry}
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
