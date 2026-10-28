import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import type {
  WorkflowErroredStatus,
  WorkflowFailedStatus,
  WorkflowPendingStatus,
  WorkflowRunningStatus,
  WorkflowSucceededStatus,
} from "../../__generated__/graphql";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { Progress } from "@diamondlightsource/sci-react-ui";
import { TaskStatusHandler } from "./WorkflowTaskComponent";

export function FailedNodeComponent(props: {
  title: string;
  data: WorkflowFailedStatus | WorkflowErroredStatus;
}) {
  return (
    <Stack key={`${props.title}-failed`}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.title}-tasks-content`}
          id={`${props.title}-tasks-header`}
        >
          {props.data.__typename == "WorkflowErroredStatus" && (
            <Typography
              align="center"
              variant="h6"
              sx={{ color: "text.secondary" }}
            >
              {props.title} (Errored)
            </Typography>
          )}
          {props.data.__typename == "WorkflowFailedStatus" && (
            <Typography
              align="center"
              variant="h6"
              sx={{ color: "error.main" }}
            >
              {props.title} (Failed)
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          {props.data.tasks.map((task) => (
            <TaskStatusHandler task={task} />
          ))}
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

export function SucceededNodeComponent(props: {
  title: string;
  data: WorkflowSucceededStatus;
}) {
  return (
    <Stack key={`${props.title}-success`}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.title}-tasks-content`}
          id={`${props.title}-tasks-header`}
        >
          <Typography
            align="center"
            variant="h6"
            sx={{ color: "success.main" }}
          >
            {props.title} (Succeeded)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {props.data.tasks.map((task) => (
            <TaskStatusHandler task={task} />
          ))}
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

export function PendingNodeComponent(props: {
  title: string;
  data: WorkflowPendingStatus;
}) {
  return (
    <Stack>
      <Typography align="center" variant="h6" sx={{ color: "warning.main" }}>
        {props.title} (Pending)
      </Typography>
      <Progress />
    </Stack>
  );
}

export function RunningNodeComponent(props: {
  title: string;
  data: WorkflowRunningStatus;
}) {
  return (
    <Stack>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.title}-tasks-content`}
          id={`${props.title}-tasks-header`}
        >
          <Typography
            align="center"
            variant="h6"
            sx={{ color: "secondary.main" }}
          >
            {props.title} (Running)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {props.data.tasks.map((task) => (
            <TaskStatusHandler task={task} />
          ))}
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
