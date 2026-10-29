import { Stack, Typography } from "@mui/material";
import { WorkflowSearchComponent } from "./workflows/components/WorkflowSearchComponent";

export default function TrackWorkflowsPage() {
  return (
    <Stack height="100%" width="100%" sx={{ alignItems: "center" }} spacing={2}>
      <Stack>
        <Typography variant="body1">Search a visit</Typography>
      </Stack>
      <WorkflowSearchComponent />
    </Stack>
  );
}
