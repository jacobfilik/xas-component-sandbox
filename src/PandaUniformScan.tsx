import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";


type TriggerTuple = [
  number[], // trigger_output_ports
  number,   // trigger_pulse_width
  number,   // trigger_output_delay
  number,   // trigger_output_num_repeats
  number,   // trigger_type
  number    // trigger_repeat
];

interface PandaUniformScanPlan {
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
  trigger_repeat: number,
  enable_triggers:boolean,
  metadata: string,
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
    num_trajectory_points: 10,
    add_sweep_triggers: false,
    ramp_time: 1,
    turnaround_time: 1,
    trigger_output_ports:[1], 
    trigger_pulse_width: 0.0001,
    trigger_output_delay: 0,
    trigger_output_num_repeats: 1,
    trigger_type: 0,
    trigger_repeat: 1,
    enable_triggers: false,
    metadata:"",
  });
  const [triggers, setTriggers] = useState<TriggerTuple[]>([]);
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
          <Button
            variant="outlined"
            onClick={() => {
              const {
                trigger_output_ports,
                trigger_pulse_width,
                trigger_output_delay,
                trigger_output_num_repeats,
                trigger_type,
                trigger_repeat,
              } = PandaUniformScanPlan;

              setTriggers(prev => [
                ...prev,
                [
                  trigger_output_ports,
                  trigger_pulse_width,
                  trigger_output_delay,
                  trigger_output_num_repeats,
                  trigger_type,
                  trigger_repeat,
                ],
              ]);
            }}
          >
            Add Trigger
          </Button>

          {triggers.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1">Triggers</Typography>

              <Stack spacing={1}>
                {triggers.map((trigger, index) => (
                  <Typography key={index} variant="body2">
                    Trigger {index + 1}:{" "}
                    {JSON.stringify(trigger)}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          )}
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
              trigger_repeat,
              enable_triggers,
              metadata,
              ...rest
            } = PandaUniformScanPlan;

            const params: any = {
                ...rest,
                metadata: {
                  user_comments: metadata,
                },
              };

              if (enable_triggers) {
                params.triggers = triggers;
              }

            const toPost = {
                name: "seq_table_uniform_scan",
                params,
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
