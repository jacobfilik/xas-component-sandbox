import { Card, CardContent, Typography } from "@mui/material";
import type { TaskListItem } from "./models";

function getStatus(item: TaskListItem) {
  if (item.is_complete) {
    return "Task Complete";
  }

  if (item.is_pending) {
    return "Task Pending";
  }
}

export default function TaskComponent(props: { taskItem: TaskListItem }) {
  return (
    <Card sx={{ overflow: "visible" }}>
      <CardContent>
        <Typography>{props.taskItem.task_id}</Typography>
        <Typography>{props.taskItem.task.name}</Typography>
        <Typography>{getStatus(props.taskItem)}</Typography>
      </CardContent>
    </Card>
  );
}
