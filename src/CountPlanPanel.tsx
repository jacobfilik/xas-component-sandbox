import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import type { Device } from "./models";
import { DeviceSelector } from "./CustomPlanPage";
import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

interface CountPlan {
  detectors: string[];
  num: number;
  delay: number;
}

export default function CountPlanPanel(props: {
  devices: Device[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [countPlan, setCountPlan] = useState<CountPlan>({
    detectors: [],
    num: 1,
    delay: 0,
  });
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Count</Typography>
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
              ...countPlan,
              detectors: deviceNames,
            };
            setCountPlan(tmp);
          }}
        />
        <Stack direction="row" spacing={"10px"}>
          <TextField
            variant="outlined"
            label="Number of Readings"
            type="number"
            value={countPlan.num}
            onChange={(e) => {
              const tmp = { ...countPlan, num: parseFloat(e.target.value) };
              setCountPlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Delay between points"
            type="number"
            value={countPlan.delay}
            onChange={(e) => {
              const tmp = {
                ...countPlan,
                delay: parseFloat(e.target.value),
              };
              setCountPlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            const toPost = {
              name: "count",
              params: countPlan,
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
