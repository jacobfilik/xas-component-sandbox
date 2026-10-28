import { Stack } from "@mui/material";
import { WorkflowsSearchComponent } from "./workflows/components/WorkflowSearchComponent";

export default function WorkflowsPage() {
    return (
        <Stack height="100%" padding="50px" spacing="10px">
            <WorkflowsSearchComponent/>
        </Stack>
    )
}