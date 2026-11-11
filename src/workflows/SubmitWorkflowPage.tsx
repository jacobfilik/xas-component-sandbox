// use the components from RunViewsForVisit:

import { useContext, useState } from "react";
import { WorkflowContext } from "./WorkflowProvider";
import { getRunsInVisit, getVisitString } from "../queryfunctions";
import {
  Box,
  Button,
  Card,
  CardContent,
  Pagination,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { VisitTextField } from "./components/ChangeVisitComponent";
import { useQuery } from "@tanstack/react-query";
import type {
  DataInfo,
  Metadata,
  TiledEntryInfo,
  TiledSearchResponse,
} from "../models";
import RunViewList from "../RunViewList";
import TiledContainerPanel from "../ListenTiled";
import { TemplateName } from "./defaults";
import { WorkflowParameterComponent } from "./components/WorkflowParameterTemplate";
import { useMutation } from "@apollo/client/react";
import { TEMPLATE_VIEW_MUTATION } from "./WorkflowsData/PostWorkflow";
import { WorkflowSearchComponent } from "./components/WorkflowSearchComponent";

function ListRunsComponent(props: {
  beamline: string;
  offset: number;
  setOffset: (ofset: number) => void;
  onIdChange: (data: TiledEntryInfo | null) => void;
  setDataInfo: (dataInfo: DataInfo, meta: Metadata) => void;
}) {
  const { tiledEntry, currentVisit } = useContext(WorkflowContext);

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

  if (!query.data || !query.data.meta) {
    return (
      <Stack padding="10px">
        <Typography align="center" variant="h4">
          No data
        </Typography>
      </Stack>
    );
  }

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    props.setOffset((value - 1) * 10);
  };
  return (
    <Stack direction={"row"} spacing="10px" overflow="hidden" flex={1}>
      <Stack spacing="10px">
        <RunViewList data={query.data.data} setId={props.onIdChange} />
        <Pagination
          onChange={handleChange}
          page={props.offset / 10 + 1}
          count={Math.ceil(query.data.meta.count / 10)}
          variant="outlined"
        />
      </Stack>
      <Stack flex={2} overflow="auto">
        {tiledEntry ? (
          <TiledContainerPanel
            beamline={props.beamline}
            visit={getVisitString(currentVisit)}
            taskID={tiledEntry.id}
            setDataInfo={props.setDataInfo}
          />
        ) : (
          <Box width="50%"></Box>
        )}
      </Stack>
    </Stack>
  );
}

function WorkflowSubmitComponent(props: { currentMeta: Metadata | null }) {
  return (
    <Stack flex={2} spacing={2}>
      <Card>
        <CardContent sx={{ height: "100%" }}>
          <Stack spacing={2}>
            <WorkflowParameterComponent workflowMeta={props.currentMeta} />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <Stack flex={2} spacing={2}>
          <CardContent>
            <WorkflowSearchComponent />
          </CardContent>
        </Stack>
      </Card>
    </Stack>
  );
}

export default function SubmitWorkflowPage() {
  const { currentVisit, workflowParams, setWorkflowParams, setTiledEntry } =
    useContext(WorkflowContext);

  // move to a provider?
  const [beamline, setBeamline] = useState("p51");
  const [offset, setOffset] = useState(0);
  const templateName = TemplateName;

  const [submit, setSubmit] = useState<boolean>(false);

  const [submitMutation] = useMutation(TEMPLATE_VIEW_MUTATION);

  const onSubmit = () => {
    setSubmit(true);
    submitMutation({
      variables: {
        visit: currentVisit.visit,
        templateName: templateName,
        parameters: workflowParams,
      },
    }).then((data) => {
      console.log("submitted workflow ", data);
    });
  };

  const [, _setDataInfo] = useState<DataInfo | null>(null);
  const [currentMeta, setCurrentMeta] = useState<Metadata | null>(null);

  const onIdChange = (data: TiledEntryInfo | null) => {
    if (data) {
      setTiledEntry(data);
    }
  };

  const setDataInfo = (val: DataInfo, meta: Metadata) => {
    _setDataInfo(val);
    const source = meta.data_keys[val.datasetName].source;
    // get meta: data_keys for workflow parameter x, y dropdown.
    setWorkflowParams({ ...workflowParams, fpath: source });
    setCurrentMeta(meta);
  };

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
      <Stack direction="row" spacing={"10px"}>
        <Stack width="50%">
          <ListRunsComponent
            beamline={beamline}
            offset={offset}
            setOffset={setOffset}
            onIdChange={onIdChange}
            setDataInfo={setDataInfo}
          />
        </Stack>
        <Stack width="80%">
          <WorkflowSubmitComponent currentMeta={currentMeta} />
        </Stack>
      </Stack>
      <Stack alignItems="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit();
          }}
          data-testid="submit-button"
        >
          Submit Workflow
        </Button>
      </Stack>

      <Snackbar
        open={submit}
        autoHideDuration={6000}
        message="submitted"
        onClose={() => setSubmit(false)}
      />
    </Stack>
  );
}
