import { Card, CardContent, Stack, Typography } from "@mui/material";
import { WORKFLOW_TEMPLATE_QUERY } from "../workflows/WorkflowsData/GetWorkflow";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

function DemoAnalysisInnerResults(props: {
  id: string;
  setWorkflowResults: (result: string) => void;
}) {
  const { data } = useQuery(WORKFLOW_TEMPLATE_QUERY, {
    variables: { id: props.id },
    pollInterval: 2000,
  });

  const setWorkflowResults = props.setWorkflowResults;

  useEffect(() => {
    if (data && data.workflowById && data.workflowById.status) {
      if ("WorkflowSucceededStatus" == data.workflowById.status.__typename) {
        if (data.workflowById.status.tasks.length == 1) {
          setWorkflowResults(data.workflowById.status.tasks[0].name);
        }
      }
    }
  }, [setWorkflowResults, data]);

  return (
    <Stack>
      {data && (
        <Typography>
          {data.workflowById?.name} {data.workflowById?.status?.__typename}
        </Typography>
      )}
    </Stack>
  );
}

export default function DemoAnalysisDetails(props: {
  scanid: string | null;
  workflowID: string | null;
  setWorkflowResults: (result: string) => void;
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography>Status</Typography>
        {props.scanid && (
          <Typography> Running processing for Scan: {props.scanid}</Typography>
        )}
        {props.workflowID && (
          <DemoAnalysisInnerResults
            id={props.workflowID}
            setWorkflowResults={props.setWorkflowResults}
          />
        )}
      </CardContent>
    </Card>
  );
}
