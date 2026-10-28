import { Badge, Stack } from "@mui/material";
import type { Task } from "../../__generated__/graphql";
import DoneIcon from "@mui/icons-material/Done";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ReportIcon from "@mui/icons-material/Report";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";

export function TaskStatusHandler(props: { task: Task }) {
  const name = props.task.name;
  if (props.task.status == "SUCCEEDED") {
    return (
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          alignItems: "center",
          color: "success.main",
        }}
      >
        <Stack>{name}</Stack>
        <Badge>
          <DoneIcon />
        </Badge>
      </Stack>
    );
  }
  if (props.task.status == "SKIPPED") {
    return (
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          alignItems: "center",
          color: "text.secondary",
        }}
      >
        <Stack>{name}</Stack>
        <Badge>
          <SkipNextIcon />
        </Badge>
      </Stack>
    );
  }
  if (props.task.status == "FAILED") {
    return (
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          alignItems: "center",
          color: "error.main",
        }}
      >
        <Stack>{name}</Stack>
        <Badge>
          <ReportIcon />
        </Badge>
      </Stack>
    );
  }

  if (props.task.status == "OMITTED") {
    return (
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          alignItems: "center",
          color: "text.muted",
        }}
      >
        <Stack>{name}</Stack>
        <Badge>
          <NotificationsPausedIcon />
        </Badge>
      </Stack>
    );
  }
}
