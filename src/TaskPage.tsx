import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./queryfunctions";
import { Box, Stack, Typography } from "@mui/material";
import TaskComponent from "./TaskComponent";

export default function TaskPage() {
  const query = useQuery({
    queryKey: ["blueapi", "tasks"],
    queryFn: getTasks,
  });

  if (!query.data) {
    return (
      <Box height="100%" bgcolor="red">
        <Typography>No Plans</Typography>
      </Box>
    );
  } else {
    return (
      <Stack height="100%" padding={"50px"} spacing={"10px"} overflow={"auto"}>
        {query.data.tasks.map((t, i) => (
          <TaskComponent key={i} taskItem={t} />
        ))}
      </Stack>
    );
  }
}
