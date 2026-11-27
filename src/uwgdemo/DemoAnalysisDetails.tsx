import { Card, CardContent, Stack, Typography } from "@mui/material";
import { WORKFLOW_TEMPLATE_QUERY } from "../workflows/WorkflowsData/GetWorkflow";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const url = "https://workflows.diamond.ac.uk/workflows/";

function DemoAnalysisInnerResults(props: {
  id: string;
  setWorkflowResults: (result: string) => void;
  workflowResults: string | null;
  visitString: string;
}) {
  const { data } = useQuery(WORKFLOW_TEMPLATE_QUERY, {
    variables: { id: props.id },
    pollInterval: props.workflowResults ? 0 : 2000,
  });

  const setWorkflowResults = props.setWorkflowResults;

  useEffect(() => {
    if (data && data.workflowById && data.workflowById.status) {
      if ("WorkflowSucceededStatus" == data.workflowById.status.__typename) {
        if (data.workflowById.status.tasks.length == 2) {
          for (const t of data.workflowById.status.tasks) {
            for (const a of t.artifacts) {
              if (a.name == "report.json" && typeof a.url === "string") {
                setWorkflowResults(a.url);
              }
            }
          }
        }
      }
    }
  }, [setWorkflowResults, data]);

  return (
    <Stack>
      {data && data.workflowById && (
        <Stack>
          <Typography>{data.workflowById.status?.__typename}</Typography>
          <Link
            to={url + props.visitString + "/" + data.workflowById.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.workflowById.id}
          </Link>
        </Stack>
      )}
    </Stack>
  );
}

export default function DemoAnalysisDetails(props: {
  scanid: string | null;
  workflowID: string | null;
  setWorkflowResults: (result: string) => void;
  workflowResults: string | null;
  visitString: string;
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
            workflowResults={props.workflowResults}
            id={props.workflowID}
            setWorkflowResults={props.setWorkflowResults}
            visitString={props.visitString}
          />
        )}
      </CardContent>
    </Card>
  );
}
