import type { UseMutationResult } from "@tanstack/react-query";
import type { Device } from "./models";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DeviceSelector } from "./CustomPlanPage";
import { useState } from "react";

interface StepScanPlan {
  detectors: string[];
  motor: string;
  scan_args: number[];
}

export default function StepScanPanel(props: {
  devices: Device[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [stepScanPlan, setStepScanPlan] = useState<StepScanPlan>({
    detectors: [],
    motor: "",
    scan_args: [0, 1, 1],
  });
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Step Scan</Typography>
        <DeviceSelector
          devices={props.devices}
          multiple={true}
          setDevice={(devs) => {
            let deviceNames: string[] = [];
            if (devs != null) {
              if (Array.isArray(devs)) {
                deviceNames = devs.map((d) => {
                  return d.name;
                });
              } else {
                deviceNames = [devs.name];
              }
            }

            const tmp = {
              ...stepScanPlan,
              detectors: deviceNames,
            };
            setStepScanPlan(tmp);
          }}
        />
        <DeviceSelector
          devices={props.devices}
          multiple={false}
          setDevice={(devs) => {
            let deviceNames: string[] = [];
            if (devs != null) {
              if (Array.isArray(devs)) {
                deviceNames = devs.map((d) => {
                  return d.name;
                });
              } else {
                deviceNames = [devs.name];
              }
            }

            const tmp = {
              ...stepScanPlan,
              motor: deviceNames[0],
            };
            setStepScanPlan(tmp);
          }}
        />
        <Stack direction="row" spacing={"10px"}>
          <TextField
            variant="outlined"
            label="Start"
            type="number"
            value={stepScanPlan.scan_args[0]}
            onChange={(e) => {
              const tmp = {
                ...stepScanPlan,
                scan_args: [...stepScanPlan.scan_args],
              };
              tmp.scan_args[0] = parseFloat(e.target.value);
              setStepScanPlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Stop"
            type="number"
            value={stepScanPlan.scan_args[1]}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => {
              const tmp = {
                ...stepScanPlan,
                scan_args: [...stepScanPlan.scan_args],
              };
              tmp.scan_args[1] = parseFloat(e.target.value);
              setStepScanPlan(tmp);
            }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Step"
            type="number"
            value={stepScanPlan.scan_args[2]}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => {
              const tmp = {
                ...stepScanPlan,
                scan_args: [...stepScanPlan.scan_args],
              };
              tmp.scan_args[2] = parseFloat(e.target.value);
              setStepScanPlan(tmp);
            }}
          ></TextField>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            const toPost = {
              name: "step_scan",
              params: stepScanPlan,
              instrument_session: props.session,
            };

            props.notifyOfPlan(toPost);
            props.mutation.mutate(toPost);
          }}
        >
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
