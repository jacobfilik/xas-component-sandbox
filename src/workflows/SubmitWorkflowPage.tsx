// use the components from RunViewsForVisit:

import { useContext, useState } from "react";
import { WorkflowContext } from "./WorkflowProvider";
import { getRunsInVisit, getVisitString } from "../queryfunctions";
import { Box, Pagination, Stack, TextField } from "@mui/material";
import { VisitTextField } from "./components/ChangeVisitComponent";
import { useQuery } from "@tanstack/react-query";
import type { DataInfo, TiledEntryInfo, TiledSearchResponse } from "../models";
import RunViewList from "../RunViewList";
import TiledContainerPanel from "../ListenTiled";

function PlotlessRunViewVisit(props: {
  beamline: string;
  offset: number;
  setOffset: (ofset: number) => void;
}) {
  const { tiledEntry, setTiledEntry, currentVisit } =
    useContext(WorkflowContext);

  const [, setDataInfo] = useState<DataInfo | null>(null);

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
            setDataInfo={setDataInfo}
          />
        ) : (
          <Box></Box>
        )}
      </Stack>
    </Stack>
  );
}

export default function SubmitWorkflowPage() {
  const { currentVisit } = useContext(WorkflowContext);
  const [visit] = useState(getVisitString(currentVisit));

  // move to a provider?
  const [beamline, setBeamline] = useState("p51");
  const [offset, setOffset] = useState(0);

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      spacing="10px"
      overflow="hidden"
      padding="10px"
    >
      <Stack direction="row" spacing={"10px"}>
        <TextField
          variant="outlined"
          label="Visit"
          value={beamline}
          onChange={(e) => {
            setOffset(0);
            setBeamline(e.target.value);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <VisitTextField />
      </Stack>
      {visit.length != 0 && beamline.length != 0 && (
        <PlotlessRunViewVisit
          beamline={beamline}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </Stack>
  );
}
