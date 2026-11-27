import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAnalysisWorkflowResult } from "../queryfunctions";
import { DataChartResult } from "./DataChartResult";
import { DataChartSNR } from "./DataChartSNR";

function DemoAnalysisResultInner(props: { workflowResult: string }) {
  const query = useQuery({
    queryKey: [props.workflowResult],
    queryFn: () => getAnalysisWorkflowResult(props.workflowResult),
  });

  if (!query.data) {
    return <Stack></Stack>;
  }

  return (
    <Stack spacing="10px">
      <DataChartResult
        xdata={query.data.x}
        ydata={query.data.avg}
        std={query.data.std}
      />
      <Typography>SNR</Typography>
      <DataChartSNR ydata={query.data.snr} />
    </Stack>
  );
}

export default function DemoAnalysisResults(props: {
  workflowResults: string | null;
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack>
          <Typography>Results</Typography>
          <Typography>Mean +/- Std</Typography>
          {props.workflowResults && (
            <DemoAnalysisResultInner workflowResult={props.workflowResults} />
          )}
          {!props.workflowResults && (
            <Stack spacing="10px">
              <DataChartResult xdata={null} ydata={null} std={null} />
              <Typography>SNR</Typography>
              <DataChartSNR ydata={null} />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
