import { Paper, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { findByBlueapiTaskId } from "../queryfunctions";
import { useEffect } from "react";
import type { TiledScanInfo } from "./DemoPage";

interface RequiredPlanArgs {
  start: string;
  stop: string;
  stepsize: string;
}

function isRequiredPlanArgs(value: unknown): RequiredPlanArgs | null {
  if (
    !!value &&
    typeof value === "object" &&
    "start" in value &&
    typeof (value as RequiredPlanArgs).start === "string" &&
    "stop" in value &&
    typeof (value as RequiredPlanArgs).stop === "string" &&
    "stepsize" in value &&
    typeof (value as RequiredPlanArgs).stepsize === "string"
  ) {
    return value as RequiredPlanArgs;
  }

  return null;
}

function InnerScanComponent(props: {
  blueApiTaskID: string;
  setTiledScanInfo: (info: TiledScanInfo) => void;
  beamline: string;
  session: string;
}) {
  const query = useQuery({
    queryKey: [
      "tiled",
      "search",
      props.beamline,
      props.blueApiTaskID,
      props.session,
    ],
    queryFn: () =>
      findByBlueapiTaskId(props.beamline, props.blueApiTaskID, props.session),
    enabled: props.blueApiTaskID != null,
    refetchInterval: (query) => {
      if (query.state.data && query.state.data.data.length == 1) return false;
      return 2 * 1000;
    },
  });

  const setTiledScanInfo = props.setTiledScanInfo;
  const data = query.data?.data;

  useEffect(() => {
    if (data != undefined && data.length != 0) {
      const rawPlanArgs = data[0].attributes.metadata.start.plan_args;

      const planArgs = isRequiredPlanArgs(rawPlanArgs);

      if (planArgs) {
        const start = parseFloat(planArgs.start);
        const stop = parseFloat(planArgs.stop);
        const step = parseFloat(planArgs.stepsize);

        if (!isNaN(start) && !isNaN(stop) && !isNaN(step)) {
          setTiledScanInfo({
            start: start,
            stop: stop,
            step: step,
            tiledID: data[0].id,
          });
        }
      }
    }
  }, [data, setTiledScanInfo]);

  if (!data || data.length == 0) {
    return <Stack></Stack>;
  }

  return (
    <Stack>
      <Typography fontStyle="italic">Running</Typography>
      <Typography>
        Scan ID: {data[0].attributes.metadata.start.scan_id}
      </Typography>
    </Stack>
  );
}

export default function RunningScanComponent(props: {
  blueApiTaskID: string | null;
  setTiledScanInfo: (info: TiledScanInfo) => void;
  beamline: string;
  session: string;
}) {
  return (
    <Paper sx={{ height: "100%" }}>
      <Stack>
        <Typography variant="h6">Scan Information</Typography>
        {props.blueApiTaskID && (
          <InnerScanComponent
            beamline={props.beamline}
            session={props.session}
            blueApiTaskID={props.blueApiTaskID}
            setTiledScanInfo={props.setTiledScanInfo}
          />
        )}
      </Stack>
    </Paper>
  );
}
