import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface SeqTablePlan {
  start: number;
  stop: number;
  num_readouts: number;
  duration: number;
}

export default function TurboSlitPlanPanel(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [seqTablePlan, setSeqTablePlan] = useState<SeqTablePlan>({
    start: 0,
    stop: 10,
    num_readouts: 100,
    duration: 0.1,
  });
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Turbo Slit Flyscan</Typography>
        <Stack direction="row" spacing={"10px"}>
          <TextField
            variant="outlined"
            label="Start"
            type="number"
            value={seqTablePlan.start}
            onChange={(e) => {
              const tmp = {
                ...seqTablePlan,
                start: parseFloat(e.target.value),
              };
              setSeqTablePlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Stop"
            type="number"
            value={seqTablePlan.stop}
            onChange={(e) => {
              const tmp = {
                ...seqTablePlan,
                stop: parseFloat(e.target.value),
              };
              setSeqTablePlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Number"
            type="number"
            value={seqTablePlan.num_readouts}
            onChange={(e) => {
              const tmp = {
                ...seqTablePlan,
                num_readouts: parseFloat(e.target.value),
              };
              setSeqTablePlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Duration"
            type="number"
            value={seqTablePlan.duration}
            onChange={(e) => {
              const tmp = {
                ...seqTablePlan,
                duration: parseFloat(e.target.value),
              };
              setSeqTablePlan(tmp);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          ></TextField>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            const toPost = {
              name: "trajectory_fly_scan",
              params: seqTablePlan,
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
