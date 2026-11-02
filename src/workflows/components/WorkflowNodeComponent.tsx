import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { TaskStatusHandler } from "./WorkflowTaskComponent";
import { useId } from "react";
import type {
  WorkflowErroredStatus,
  WorkflowFailedStatus,
  WorkflowPendingStatus,
  WorkflowRunningStatus,
  WorkflowSucceededStatus,
} from "../../__generated__/graphql";

export function FailedNodeComponent(props: {
  title: string;
  data: WorkflowFailedStatus | WorkflowErroredStatus;
}) {
  const id = useId();
  return (
    <Stack key={`${props.title}-failed-${id}`}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.title}-tasks-content`}
          id={`${props.title}-tasks-header-${id}`}
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
              key={`running-${id}-fail`}
              align="center"
              variant="h6"
              sx={{ color: "error.main" }}
            >
              {props.title} (Failed)
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails key={`${id}-deets-fail`}>
          {props.data.tasks.map((task) => (
            <TaskStatusHandler
              task={task}
              key={`${props.title}-task-status-fail-${task.name}`}
            />
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
  const id = useId();
  return (
    <Stack key={`${props.title}-success-${id}`}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.title}-tasks-content-${id}`}
          id={`${props.title}-tasks-header-${id}`}
        >
          <Typography
            align="center"
            key={`running-${id}-success`}
            variant="h6"
            sx={{ color: "success.main" }}
          >
            {props.title} (Succeeded)
          </Typography>
        </AccordionSummary>
        <AccordionDetails key={`${id}-deets-ok`}>
          {props.data.tasks.map((task) => (
            <TaskStatusHandler
              task={task}
              key={`${props.title}-task-status-success-${task.name}`}
            />
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
  const id = useId();
  return (
    <Stack key={`pending-${id}`}>
      <Typography
        align="center"
        variant="h6"
        sx={{ color: "warning.main" }}
        key={`pending-${props.title}-typ`}
      >
        {props.title} (Pending)
      </Typography>
    </Stack>
  );
}

export function RunningNodeComponent(props: {
  title: string;
  data: WorkflowRunningStatus;
}) {
  const id = useId();
  return (
    <Stack key={`running=-${id}`}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.title}-tasks-content-${id}`}
          id={`${props.title}-tasks-header-${id}`}
        >
          <Typography
            key={`running-${id}-typ`}
            align="center"
            variant="h6"
            sx={{ color: "secondary.main" }}
          >
            {props.title} (Running)
          </Typography>
        </AccordionSummary>
        <AccordionDetails key={`${id}-deets-running`}>
          {props.data.tasks.map((task) => (
            <TaskStatusHandler
              task={task}
              key={`${props.title}-task-status-running-${task.name}`}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
