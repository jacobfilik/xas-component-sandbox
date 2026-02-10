import { useMutation, useQuery } from "@tanstack/react-query";
import { getDevices, postPlan, putTask } from "./queryfunctions";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import type { Device } from "./models";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";

function DeviceSelector(props: {
  devices: Device[];
  multiple: boolean;
  setDevice: (d: Device | Device[] | null) => void;
}) {
  return (
    <Stack spacing={3}>
      <Autocomplete
        multiple={props.multiple}
        id="tags-outlined"
        options={props.devices}
        getOptionLabel={(d) => d.name}
        // defaultValue={props.multiple ? [props.devices[0]] : props.devices[0]}
        filterSelectedOptions
        onChange={(e, v) => props.setDevice(v)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Devices"
            placeholder="Readable Devices"
          />
        )}
      />
    </Stack>
  );
}

interface CountPlan {
  detectors: string[];
  num: number;
  delay: number;
}

export default function CustomPlanPage() {
  const query = useQuery({
    queryKey: ["blueapi", "devices"],
    queryFn: getDevices,
  });

  const putMutation = useMutation({
    mutationFn: putTask,
    onSuccess: () => {},
    onError: () => {},
  });

  const mutation = useMutation({
    mutationFn: postPlan,
    onSuccess: (data) => {
      putMutation.mutate(data);
    },
    onError: () => {},
  });

  const [countPlan, setCountPlan] = useState<CountPlan>({
    detectors: [],
    num: 1,
    delay: 0,
  });

  const [session, setSession] = useState<string>("");

  if (!query.data) {
    return (
      <Box height="100%" bgcolor="red">
        <Typography>No Devices</Typography>
      </Box>
    );
  } else {
    return (
      <Stack
        height="100%"
        padding={"50px"}
        spacing={"10px"}
        overflow={"auto"}
        width={"40%"}
      >
        <TextField
          variant="outlined"
          label="Visit"
          value={session}
          onChange={(e) => {
            setSession(e.target.value);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        ></TextField>
        <Paper elevation={5}>
          <Stack
            height="100%"
            padding={"10px"}
            spacing={"20px"}
            overflow={"auto"}
          >
            <Typography>Count</Typography>
            <DeviceSelector
              devices={query.data.devices}
              multiple={true}
              setDevice={(devs) => {
                console.log(devs);
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

                console.log(deviceNames);

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
                  instrument_session: session,
                };

                mutation.mutate(toPost);
              }}
            >
              Submit
            </Button>
          </Stack>
        </Paper>
        <Paper elevation={5}>
          <Stack
            height="100%"
            padding={"10px"}
            spacing={"20px"}
            overflow={"auto"}
          >
            <Typography>Step Scan</Typography>
            <DeviceSelector
              devices={query.data.devices}
              multiple={true}
              setDevice={() => {}}
            />
            <DeviceSelector
              devices={query.data.devices}
              multiple={false}
              setDevice={() => {}}
            />
            <Stack direction="row" spacing={"10px"}>
              <TextField
                variant="outlined"
                label="Start"
                type="number"
                defaultValue={1}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Stop"
                type="number"
                defaultValue={0}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Step"
                type="number"
                defaultValue={0}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
            </Stack>
            <Button disabled variant="contained">
              Submit
            </Button>
          </Stack>
        </Paper>
        <Paper elevation={5}>
          <Stack
            height="100%"
            padding={"10px"}
            spacing={"20px"}
            overflow={"auto"}
          >
            <Typography>Turbo Slit Flyscan</Typography>
            <Stack direction="row" spacing={"10px"}>
              <TextField
                variant="outlined"
                label="Start"
                type="number"
                defaultValue={0}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Stop"
                type="number"
                defaultValue={1}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Number"
                type="number"
                defaultValue={1}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Duration"
                type="number"
                defaultValue={1}
                slotProps={{ inputLabel: { shrink: true } }}
              ></TextField>
            </Stack>
            <Button disabled variant="contained">
              Submit
            </Button>
          </Stack>
        </Paper>
      </Stack>
    );
  }
}
