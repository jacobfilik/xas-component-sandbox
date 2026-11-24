import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function DemoAnalysisResults(props: {
  workflowResults: string | null;
}) {
  // const [Workflow, { error, loading }] = useLazyQuery(
  //   WorkflowProgres,
  //   {
  //     // pollInterval: 1000,
  //   },
  // );
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack>
          <Typography>Results</Typography>
          {props.workflowResults && (
            <Typography>{props.workflowResults}</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
