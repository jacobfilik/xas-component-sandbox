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
  setCompletedPlanInfo: (completed: string | null) => void;
  planRunning: boolean;
  setPlanRunning: (running: boolean) => void;
  blueApiTaskID: string;
  setTiledScanInfo: (info: TiledScanInfo) => void;
  beamline: string;
  session: string;
}) {
  const planRunning = props.planRunning;
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
      if (
        query.state.data &&
        query.state.data.data &&
        query.state.data.data.length == 1 &&
        !planRunning
      )
        return false;
      return 2 * 1000;
    },
  });

  const setTiledScanInfo = props.setTiledScanInfo;
  const setPlanRunning = props.setPlanRunning;
  const setCompletedPlanInfo = props.setCompletedPlanInfo;

  const data = query.data?.data;
  let stopdoc = undefined;

  console.log(data);

  if (query.data && query.data.data && query.data.data.length == 1) {
    stopdoc = query.data.data[0].attributes.metadata.stop;
    // console.log(`WE HAVE STOP ${query.data.data[0].attributes.metadata.stop}`);
  }

  // console.log(`Stop doc ${stopdoc}`);

  useEffect(() => {
    console.log("IN USE EFFECT");
    console.log(data);
    if (data != undefined && data.length != 0) {
      const rawPlanArgs = data[0].attributes.metadata.start.plan_args;

      const planArgs = isRequiredPlanArgs(rawPlanArgs);

      if (stopdoc && planRunning) {
        console.log("STOP!");
        setPlanRunning(false);
        setCompletedPlanInfo(
          data[0].attributes.metadata.start.scan_id.toString(),
        );
      } else if (stopdoc == undefined && !planRunning) {
        console.log("Set Running");
        setPlanRunning(true);
      }
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
  }, [
    data,
    setTiledScanInfo,
    setPlanRunning,
    planRunning,
    stopdoc,
    setCompletedPlanInfo,
  ]);

  if (!data || data.length == 0) {
    return (
      <Stack>
        <Typography fontStyle="italic">
          Bluesky Task Id {props.blueApiTaskID} submitted
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack>
      <Typography fontStyle="italic">
        Bluesky Task Id {props.blueApiTaskID}{" "}
        {props.planRunning ? "running" : "completed"}
      </Typography>
      <Typography>
        Scan ID: {data[0].attributes.metadata.start.scan_id}
      </Typography>
    </Stack>
  );
}

export default function RunningScanComponent(props: {
  setCompletedPlanInfo: (completed: string | null) => void;
  planRunning: boolean;
  setPlanRunning: (running: boolean) => void;
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
            setCompletedPlanInfo={props.setCompletedPlanInfo}
            planRunning={props.planRunning}
            setPlanRunning={props.setPlanRunning}
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
