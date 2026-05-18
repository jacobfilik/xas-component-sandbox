import type { UseMutationResult } from "@tanstack/react-query";
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";

interface RefreshPandaPlan {
  panda: string;
  restore_settings: boolean;
  restore_dataset_settings: boolean;
  store_settings: boolean;
}

const parameterInfo: Record<string, string> = {
  detectors: "Panda to Refresh",
  restore_settings: "Restore all settings related to Panda",
  restore_dataset_settings: "Refresh only the dataset names",
  store_settings: "Store settings for later use",
};

export default function RefreshPandaPanel(props: {
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [refreshPandaPlan, setRefreshPandaPlan] =
    useState<RefreshPandaPlan>({
      panda: "panda1",
      restore_settings: false,
      restore_dataset_settings: true,
      store_settings: false,
    });

  return (
    <Paper elevation={5}>
      <Stack height="100%" padding="10px" spacing="20px" overflow="auto">
        <Typography>Refresh Panda</Typography>

        <Stack direction="column" spacing="10px">
          {Object.entries(refreshPandaPlan).map(([key, value]) => {
            const label = parameterInfo[key] ?? "No description available";

            if (typeof value === "boolean") {
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) =>
                        setRefreshPandaPlan((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={label}
                />
              );
            }

            return (
              <Stack key={key} spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>

                <TextField
                  variant="outlined"
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setRefreshPandaPlan((prev) => ({
                      ...prev,
                      panda: newValue,
                    }));
                  }}
                />
              </Stack>
            );
          })}
        </Stack>

        <Button
          variant="contained"
          onClick={() => {
            const {
              panda,
              ...rest
            } = refreshPandaPlan;
            
            let planName;
            if (panda==="panda1"){
              planName = "restore_panda_settings"
            }
            else if (panda==="panda2"){
              planName = "restore_panda2_settings"
            }
            else{
              throw new Error("Invalid panda value");
            }

            const toPost = {
              name: planName,
              params:rest,
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
