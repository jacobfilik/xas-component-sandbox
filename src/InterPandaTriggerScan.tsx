import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

type TriggerTuple = [
  number[],              // trigger_output_ports
  number,                // trigger_pulse_width
  number,                // trigger_output_delay
  number,                // trigger_output_num_repeats
  number,                 // trigger_type
];

interface InterPandaTriggerPlan {
  start:number,
  stop: number,
  stepsize: number,
  number_of_sweeps:number,
  time_per_sweep: number,
  num_trajectory_points: number,
  add_sweep_triggers: boolean,
  ramp_time: number,
  turnaround_time: number,
  trigger_output_ports: number[], 
  trigger_pulse_width: number,
  trigger_output_delay: number,
  trigger_output_num_repeats: number,
  trigger_type: number,
  metadata: string,
}

export default function InterPandaTriggerPlanPanel(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [InterPandaTriggerPlan, setInterPandaTriggerPlan] = useState<InterPandaTriggerPlan>({
    start:0,
    stop: 10,
    stepsize: 1,
    number_of_sweeps: 4,
    time_per_sweep: 5,
    num_trajectory_points: 10,
    add_sweep_triggers: false,
    ramp_time: 1,
    turnaround_time: 1,
    trigger_output_ports:[1], 
    trigger_pulse_width: 0.0001,
    trigger_output_delay: 0,
    trigger_output_num_repeats: 1,
    trigger_type: 0,
    metadata:"",
  });
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Inter Panda Triggering Scan</Typography>
        <Stack direction="column" spacing={"10px"}>
          {Object.entries(InterPandaTriggerPlan).map(([key, value]) => (
            <TextField
              key={key}
              variant="outlined"
              label={key}
              type={typeof value === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => {
                setInterPandaTriggerPlan({
                  ...InterPandaTriggerPlan,
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
            const {
              trigger_output_ports,
              trigger_pulse_width,
              trigger_output_delay,
              trigger_output_num_repeats,
              trigger_type,
              metadata,
              ...rest
            } = InterPandaTriggerPlan;

            const triggers: TriggerTuple[] = [
              [
                trigger_output_ports,
                trigger_pulse_width,
                trigger_output_delay,
                trigger_output_num_repeats,
                trigger_type,
              ],
            ];

            const toPost = {
              name: "seq_table_uniform_scan",
              params: {
                ...rest,
                triggers,
                metadata: {
                  user_comments: metadata,
                },
              },
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
