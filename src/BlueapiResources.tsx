import { Divider, Stack } from "@mui/material";
import PlanPage from "./PlanPage";
import DevicePage from "./DevicePage";
import TaskPage from "./TaskPage";

export default function BlueapiResources() {
  return (
    <Stack direction={"row"} height={"100%"} width={"100%"}>
      <PlanPage />
      <Divider orientation="vertical" />
      <DevicePage />
      <Divider orientation="vertical" />
      <TaskPage />
    </Stack>
  );
}
