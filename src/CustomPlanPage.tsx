import { useMutation, useQuery } from "@tanstack/react-query";
import { getDevices, postPlan, putTask } from "./queryfunctions";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import type { Device } from "./models";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CountPlanPanel from "./CountPlanPanel";
import StepScanPanel from "./StepScanPanel";
import PandaUniformScanPanel from "./PandaUniformScan"
import EnergyScanPlanPanel from "./EnergyScan"
import InterPandaTriggerPlanPanel from "./InterPandaTriggerScan"
import TurboSlitPlanPanel from "./TurboSlitPlanPanel";
import RefreshPandaPanel from "./RefreshPanda"
import SubmittedTaskPanel from "./SubmittedTaskPanel";
import SubmittedJson from "./SubmittedJson";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function DeviceSelector(props: {
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
        onChange={(_e, v) => props.setDevice(v)}
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

export default function CustomPlanPage() {
  const query = useQuery({
    queryKey: ["blueapi", "devices"],
    queryFn: getDevices,
  });

  const putMutation = useMutation({
    mutationFn: putTask,
    onSuccess: (data) => {
      setSubmittedTaskId(data.task_id);
    },
    onError: () => {},
  });

  const mutation = useMutation({
    mutationFn: postPlan,
    onSuccess: (data) => {
      putMutation.mutate(data);
    },
    onError: () => {},
  });

  const [session, setSession] = useState<string>("cm44254-1");
  const [submittedTaskId, setSubmittedTaskId] = useState<string | null>(null);
  const [submittedJson, setSubmittedJson] = useState<string>("{}");

  const notifyOfPlan = (plan: object) => {
    setSubmittedJson(JSON.stringify(plan, null, 2));
  };

  if (!query.data) {
    return (
      <Box height="100%" bgcolor="red">
        <Typography>No Devices</Typography>
      </Box>
    );
  } else {
    return (
      <Stack direction="row" spacing="20px" height="100%" width="100%">
      <Stack
        height="100%"
        padding="50px"
        spacing="10px"
        overflow="auto"
        flex={1}
      >
        <TextField
          variant="outlined"
          label="Visit"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Refresh Panda</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RefreshPandaPanel
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Count Plan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CountPlanPanel
              devices={query.data.devices}
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Step Scan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StepScanPanel
              devices={query.data.devices}
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Uniform Position Scan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PandaUniformScanPanel
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Energy Grid Scan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <EnergyScanPlanPanel
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Inter Panda Triggering Scan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InterPandaTriggerPlanPanel
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Trajectory Fly Scan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TurboSlitPlanPanel
              session={session}
              mutation={mutation}
              notifyOfPlan={notifyOfPlan}
            />
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Right-hand stack unchanged */}
      <Stack
        height="100%"
        padding="50px"
        spacing="20px"
        overflow="auto"
        flex={1}
      >
        {submittedTaskId ? (
          <SubmittedTaskPanel taskID={submittedTaskId} />
        ) : (
          <Box>No Submitted Task</Box>
        )}

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Submitted Plan JSON</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SubmittedJson planJson={submittedJson} />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
        );
      }
    }
