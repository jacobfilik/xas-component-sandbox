import { useState } from "react";
import {
  type WorkflowQuery,
  type WorkflowQueryVariables,
} from "../WorkflowsData/__generated__/WorkflowQuery.generated";
import { defaultWorkflowConnection } from "../defaults";
import { useLazyQuery } from "@apollo/client/react";
import { WORKFLOW_QUERY } from "../WorkflowsData/WorkflowQuery";
import {
  Alert,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { ErrorLike } from "@apollo/client";
import {
  FailedNodeComponent,
  PendingNodeComponent,
  RunningNodeComponent,
  SucceededNodeComponent,
} from "./WorkflowNodeComponent";
import type {
  WorkflowErroredStatus,
  WorkflowFailedStatus,
  WorkflowRunningStatus,
  WorkflowSucceededStatus,
} from "../../__generated__/graphql";

export function WorkflowsSearchComponent() {
  const [inputValues, setInputValues] = useState<WorkflowQueryVariables>(
    defaultWorkflowConnection,
  );

  const [WorkflowQueryFn, { loading, error, data }] =
    useLazyQuery(WORKFLOW_QUERY);

  return (
    <Stack alignContent={"center"}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            sx={{ width: "30%" }}
            id="propcodeinputbox"
            label="Proposal Code"
            title="Proposal Code"
            value={inputValues.visit.proposalCode}
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                visit: { ...inputValues.visit, proposalCode: e.target.value },
              });
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            sx={{ width: "30%" }}
            id="propnumberinputbox"
            label="Proposal Number"
            title="Proposal Number"
            value={inputValues.visit.proposalNumber}
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                visit: {
                  ...inputValues.visit,
                  proposalNumber: Number(e.target.value),
                },
              });
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            sx={{ width: "30%" }}
            id="numberinputbox"
            label="Change Number"
            title="Visit Number"
            value={inputValues.visit.number}
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                visit: { ...inputValues.visit, number: Number(e.target.value) },
              });
            }}
          />
        </Grid>
            <Grid size={6}>
      <Button
        variant="contained"
        sx={{ bgcolor: "blue", color: "white" }}
        onClick={() => {
          WorkflowQueryFn({ variables: { visit: inputValues.visit } });
        }}
      >
        Search for workflows
      </Button>
      </Grid>
       </Grid>
      <WorkflowHandler data={data} error={error} loading={loading} />
    </Stack>
  );
}

function WorkflowHandler(props: {
  data: undefined | WorkflowQuery;
  error: ErrorLike | undefined;
  loading: undefined | boolean;
}) {
  if (props.loading || !props.data) {
    return <Stack></Stack>;
  }
  if (props.error) {
    return <Alert severity="error">{props.error.message}</Alert>;
  }
  if (props.data.workflows.nodes.length == 0) {
    return <Stack>No workflows found for visit.</Stack>;
  }
  return (
    <Stack key={"test-component"}>
      <Typography variant="body1" align="center">
        Found {props.data.workflows.nodes.length} workflows in visit
      </Typography>

      {props.data.workflows.nodes.map((val, idx) => {
        if (val.status?.__typename == "WorkflowPendingStatus") {
          return (
            <Stack key={`${idx}=pending`}>
              <PendingNodeComponent title={val.name} data={val.status} />
            </Stack>
          );
        }
        if (val.status?.__typename == "WorkflowRunningStatus") {
          return (
            <Stack key={`${idx}=running`}>
              <RunningNodeComponent
                title={val.name}
                data={val.status as WorkflowRunningStatus}
              />
            </Stack>
          );
        }
        if (val.status?.__typename == "WorkflowSucceededStatus") {
          return (
            <Stack key={`${idx}=success`}>
              <SucceededNodeComponent
                title={val.name}
                data={val.status as WorkflowSucceededStatus}
              />
            </Stack>
          );
        }
        if (
          val.status?.__typename == "WorkflowFailedStatus" ||
          val.status?.__typename == "WorkflowErroredStatus"
        ) {
          return (
            <FailedNodeComponent
              title={val.name}
              data={val.status as WorkflowErroredStatus | WorkflowFailedStatus}
            />
          );
        }
      })}
    </Stack>
  );
}
