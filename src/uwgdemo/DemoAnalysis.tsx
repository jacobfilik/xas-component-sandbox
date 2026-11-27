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
      const data_dir =
        visit.proposalCode + visit.proposalNumber + "-" + visit.number;
      setSubmittedWorkflowPlan(scanid);
      setWorkflowResults(null);
      submitMutation({
        variables: {
          visit: visit,
          templateName: templateName,
          parameters: {
            beamline: beamline,
            year: year,
            scan_no: scanid,
            data_dir: data_dir,
            tiled_id: "test",
          },
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
    setWorkflowResults,
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
            workflowResults={workflowResults}
            visitString={
              visit.proposalCode + visit.proposalNumber + "-" + visit.number
            }
          ></DemoAnalysisDetails>
        </Stack>
        <Stack flex={7}>
          <DemoAnalysisResults workflowResults={workflowResults} />
        </Stack>
      </Stack>
    </Stack>
  );
}
