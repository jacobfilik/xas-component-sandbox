import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TEMPLATE_VIEW_MUTATION } from "../workflows/WorkflowsData/PostWorkflow";
import { useMutation } from "@apollo/client/react";
import type { VisitInput } from "../__generated__/graphql";
import DemoAnalysisDetails from "./DemoAnalysisDetails";
import DemoAnalysisResults from "./DemoAnalysisResults";

const templateName = "panda-repetitions";

export default function DemoAnalysis(props: {
  submittedWorkflowPlan: string | null;
  setSubmittedWorkflowPlan: (id: string) => void;
  beamline: string;
  year: string;
  visit: VisitInput;
  scanid: string | null;
}) {
  const [workflowID, setWorkflowID] = useState<string | null>(null);
  const [submitMutation] = useMutation(TEMPLATE_VIEW_MUTATION);
  const [workflowResults, setWorkflowResults] = useState<string | null>(null);

  const {
    beamline,
    scanid,
    submittedWorkflowPlan,
    year,
    visit,
    setSubmittedWorkflowPlan,
  } = {
    ...props,
  };

  useEffect(() => {
    if (scanid != submittedWorkflowPlan && scanid != null) {
      setSubmittedWorkflowPlan(scanid);
      submitMutation({
        variables: {
          visit: visit,
          templateName: templateName,
          parameters: { beamline: beamline, year: year, scanid: scanid },
        },
      }).then((data) => {
        if (data.data) {
          setWorkflowID(data.data.submitWorkflowTemplate.id);
        }
      });
    }
  }, [
    beamline,
    scanid,
    submittedWorkflowPlan,
    year,
    visit,
    submitMutation,
    setSubmittedWorkflowPlan,
    setWorkflowID,
  ]);

  return (
    <Stack height="100%">
      <Typography variant="h6">Analysis</Typography>
      <Stack spacing="10px" flex={1}>
        <Stack flex={1}>
          <DemoAnalysisDetails
            scanid={props.submittedWorkflowPlan}
            workflowID={workflowID}
            setWorkflowResults={setWorkflowResults}
          ></DemoAnalysisDetails>
        </Stack>
        <Stack flex={8}>
          <DemoAnalysisResults workflowResults={workflowResults} />
        </Stack>
      </Stack>
    </Stack>
  );
}
