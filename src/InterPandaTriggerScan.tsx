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
  metadata: string,
  trigger_output_ports: number[], 
  trigger_pulse_width: number,
  trigger_output_delay: number,
  trigger_output_num_repeats: number,
  trigger_type: number,
  trigger_repeat:number,
}

const parameterInfo: Record<string, string> = {
  start: "Start position of the scan",
  stop: "End position of the scan",
  stepsize: "Scan step size",
  number_of_sweeps: "Number of sweeps",
  time_per_sweep: "Total duration of one sweep (seconds)",
  num_trajectory_points: "Number of points in the trajectory",
  add_sweep_triggers: " Add triggers at the end of the sweep (boolean)",
  ramp_time: "Ramp up time (seconds)",
  turnaround_time: "Turnaround time (seconds)",
  metadata: "Optional metadata",
  trigger_output_ports: "Output ports used for triggers in second Panda (comma-separated eg - 1,2,3)",
  trigger_pulse_width: "Width of the trigger pulse in second Panda (seconds)",
  trigger_output_delay: "Delay before trigger fires in second Panda (seconds)",
  trigger_output_num_repeats: "How many times the trigger repeats in second Panda",
  trigger_type: "Trigger mode identifier in second Panda (0 -> START, 1-> END)",
  trigger_repeat: "Repeat the trigger sequence configured above in second Panda",
};


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
    metadata:"",
    trigger_output_ports:[1,2], 
    trigger_pulse_width: 0.0001,
    trigger_output_delay: 0,
    trigger_output_num_repeats: 1,
    trigger_type: 0,
    trigger_repeat:1,
  });
  const [triggers, setTriggers] = useState<TriggerTuple[]>([]);
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Inter Panda Triggering Scan</Typography>
        <Stack direction="column" spacing={"10px"}>
          {Object.entries(InterPandaTriggerPlan).map(([key, value]) => (
            <Stack key={key} spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {parameterInfo[key] ?? "No description available"}
              </Typography>
              <TextField
                key={key}
                variant="outlined"
                type={typeof value === "number" ? "number" : "text"}
                value={value}
                onChange={(e) => {
                  setInterPandaTriggerPlan({
                    ...InterPandaTriggerPlan,
                    [key]:Array.isArray(value)
                    ? e.target.value
                        .split(",")
                        .map(v => Number(v.trim()))
                        .filter(v => !Number.isNaN(v))
                    : typeof value === "number"
                        ? parseFloat(e.target.value)
                        : e.target.value,
                  });
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
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
              } = InterPandaTriggerPlan;

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
              metadata,
              trigger_output_ports,
              trigger_pulse_width,
              trigger_output_delay,
              trigger_output_num_repeats,
              trigger_type,
              trigger_repeat,
              ...rest
            } = InterPandaTriggerPlan;

            const params: any = {
                ...rest,
                metadata: {
                  user_comments: metadata,
                },
              };

            params.triggers = triggers;

            const toPost = {
              name: "seq_table_two_panda_scan",
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
