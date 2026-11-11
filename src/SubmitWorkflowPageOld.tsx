import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { WorkflowTemplateSearch } from "./workflows/components/WorkflowTemplateSearch";
import { TemplatePopper } from "./workflows/components/WorkflowTemplatePopper";
import { VisitTextField } from "./workflows/components/ChangeVisitComponent";

export function SubmitWorkflowPageOld() {
  const [templateName, setTemplateName] = useState<string>("None");

  return (
    <Stack height="100%" width="100%" sx={{ alignItems: "center" }} spacing={2}>
      <Typography variant="h5" align="center">
        Post from template
      </Typography>
      <Stack
        alignContent={"center"}
        spacing={2}
        width="100%"
        padding="50px"
        overflow="auto"
        flex={1}
        direction={"row"}
      >
        <Stack>
          <VisitTextField />
          <TemplatePopper name={templateName} />
        </Stack>
        <Stack width="80%">
          <WorkflowTemplateSearch changeName={setTemplateName} />
        </Stack>
      </Stack>
    </Stack>
  );
}
