import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface EnergyScanPlan {
  element: string,
  edge: string,
  time_per_sweep:number,
  variable_exafs_time:boolean,
  metadata: string,
}

export default function EnergyScanPlanPanel(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [EnergyScanPlan, setEnergyScanPlan] = useState<EnergyScanPlan>({
    element:"Ar",
    edge:"K",
    time_per_sweep:8,
    variable_exafs_time:false,
    metadata:"",
  });
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Energy Grid Scan</Typography>
        <Stack direction="column" spacing={"10px"}>
          {Object.entries(EnergyScanPlan).map(([key, value]) => (
            <TextField
              key={key}
              variant="outlined"
              label={key}
              type={typeof value === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => {
                setEnergyScanPlan({
                  ...EnergyScanPlan,
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
              name: "seq_table_energy_scan",
              params: {
                    ...EnergyScanPlan,
                    metadata: {
                      user_comments: EnergyScanPlan.metadata
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
