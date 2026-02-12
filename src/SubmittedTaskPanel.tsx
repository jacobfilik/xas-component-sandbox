import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "./queryfunctions";
import TaskComponent from "./TaskComponent";

export default function SubmittedTaskPanel(props: { taskID: string }) {
  const query = useQuery({
    queryKey: ["blueapi", "tasks", props.taskID],
    queryFn: () => getTask(props.taskID),
  });

  if (query.data == null) {
    return <Box>Test</Box>;
  } else {
    return <TaskComponent taskItem={query.data}></TaskComponent>;
  }
}
