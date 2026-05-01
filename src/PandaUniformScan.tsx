import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface PandaUniformScanPlan {
  start:number,
  stop: number,
  stepsize: number,
  number_of_sweeps:number,
  time_per_sweep: number,
  motor: string,
  panda: string,
  num_trajectory_points: number,
  add_sweep_triggers: boolean,
  ramp_time: number,
  turnaround_time: number,
  metadata:string,
}

export default function PandaUniformScanPanel(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [PandaUniformScanPlan, setUniformScanPlan] = useState<PandaUniformScanPlan>({
    start:0,
    stop: 10,
    stepsize: 1,
    number_of_sweeps: 4,
    time_per_sweep: 5,
    motor: "",
    panda: "",
    num_trajectory_points: 10,
    add_sweep_triggers: false,
    ramp_time: 1,
    turnaround_time: 1,
    metadata:"",
  });
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Panda Uniform Postion Scan</Typography>
        <Stack direction="column" spacing={"10px"}>
          {Object.entries(PandaUniformScanPlan).map(([key, value]) => (
            <TextField
              key={key}
              variant="outlined"
              label={key}
              type={typeof value === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => {
                setUniformScanPlan({
                  ...PandaUniformScanPlan,
                  [key]:
                    typeof value === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value,
                });
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          ))}
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            const toPost = {
              name: "seq_table_uniform_scan",
              params: PandaUniformScanPlan,
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
