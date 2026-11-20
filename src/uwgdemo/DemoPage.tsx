import { Paper, Stack } from "@mui/material";
import DemoScanComponent from "./DemoScanComponent";
import RunningScanComponent from "./RunningScanComponent";
import DemoAnalysis from "./DemoAnalysis";
import { useContext, useState } from "react";
import type { DataInfo } from "../models";
import DemoDataViewer from "./DemoDataViewer";
import { WorkflowContext } from "../workflows/WorkflowProvider";
import { VisitTextField } from "../workflows/components/ChangeVisitComponent";

const dataInfo: DataInfo = {
  datasetContainerName: "primary",
  datasetName: "fmc_in-val1_dataset",
  internal: false,
};

export interface TiledScanInfo {
  tiledID: string;
  start: number;
  stop: number;
  step: number;
}

export default function DemoPage() {
  const { currentVisit } = useContext(WorkflowContext);
  const [blueApiTaskId, setBlueApiTaskId] = useState<string | null>(null);
  const [tiledScanInfo, setTiledScanInfo] = useState<TiledScanInfo | null>(
    null,
  );

  const beamline = "p51";

  return (
    <Stack height="100%" flex alignItems="stretch">
      <Stack
        height="100%"
        direction="row"
        alignItems="stretch"
        margin="20px"
        spacing="10px"
        maxHeight="100%"
        minHeight="10px"
      >
        <Stack height="100%" flex={1} spacing="10px">
          <VisitTextField />
          <DemoScanComponent setBlueApiTaskId={setBlueApiTaskId} />
          <RunningScanComponent
            blueApiTaskID={blueApiTaskId}
            setTiledScanInfo={setTiledScanInfo}
          />
        </Stack>
        <Stack margin="10px" flex={2}>
          <Paper sx={{ height: "100%" }}>
            <DemoDataViewer
              beamline={beamline}
              dataInfo={dataInfo}
              tiledScanInfo={tiledScanInfo}
              visit={
                currentVisit.visit.proposalCode +
                currentVisit.visit.proposalNumber +
                "-" +
                currentVisit.visit.number
              }
            />
          </Paper>
        </Stack>
        <Stack flex={1}>
          <DemoAnalysis />
        </Stack>
      </Stack>
    </Stack>
  );
}
