import { useContext, useState } from "react";
import { WorkflowContext } from "../WorkflowProvider";
import { useLazyQuery } from "@apollo/client/react";
import { WORKFLOW_QUERY } from "../WorkflowsData/WorkflowQuery";
import { emptyWorkflowQuery } from "../defaults";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
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
  WorkflowPendingStatus,
  WorkflowRunningStatus,
  WorkflowSucceededStatus,
} from "../../__generated__/graphql";
import { ChangeVisitComponent } from "./ChangeVisitComponent";

export function WorkflowSearchComponent() {
  const { currentVisit, getVisitString, workflowData, setWorkflowData } =
    useContext(WorkflowContext);

  const [currentVal, setCurrentVal] = useState<string>(getVisitString());

  const [WorkflowQueryFn, { error, loading }] = useLazyQuery(WORKFLOW_QUERY, {
    // pollInterval: 1000,
  });

  const handleWorkflowQuery = async () => {
    const { error, data } = await WorkflowQueryFn({
      variables: { ...currentVisit },
    });
    if (data && data != workflowData && !loading) {
      setWorkflowData(data);
    }
    if (error) {
      console.log(error.message);
      setWorkflowData(emptyWorkflowQuery);
    }
  };

  return (
    <Stack
      alignContent={"center"}
      spacing={2}
      width="100vw"
      padding="50px"
      overflow="auto"
      flex={1}
    >
      <Stack direction={"row"} justifyContent={"space-around"}>
        <ChangeVisitComponent />
        <Button
          variant="contained"
          sx={{ width: "120px", height: "80px" }}
          onClick={() => {
            setCurrentVal(getVisitString());
            handleWorkflowQuery();
          }}
        >
          Search in visit {getVisitString()}
        </Button>
      </Stack>
      {currentVal == getVisitString() && (
        <Stack>
          <Typography align="center" variant="h6">
            Data for visit {currentVal}
          </Typography>
        </Stack>
      )}
      {currentVal != getVisitString() && (
        <Stack>
          <Typography align="center" variant="h6" color="text.muted">
            Data for visit {currentVal}
          </Typography>
        </Stack>
      )}
      <WorkflowDataHandler
        key={"workflow-data-handler"}
        error={error}
        loading={loading}
        currentVal={currentVal}
      />
    </Stack>
  );
}

function WorkflowDataHandler(props: {
  error: ErrorLike | undefined;
  loading: boolean;
  currentVal: string;
}) {
  const { workflowData } = useContext(WorkflowContext);

  if (props.error) {
    return (
      <Box height={"100%"} width={"100%"} sx={{}} key={"no-node"}>
        <Alert severity="error">{props.error.message}</Alert>
      </Box>
    );
  }

  if (workflowData.workflows.nodes[0].name == "initial") {
    return (
      <Stack key="initial-node">
        <PendingNodeComponent
          key={"pending-node"}
          title={""}
          data={workflowData.workflows.nodes[0].status as WorkflowPendingStatus}
        />
      </Stack>
    );
  }

  return (
    <Box height={"100%"} width={"100%"} key="workflow-handler">
      {workflowData.workflows.nodes.length <= 0 && (
        <Typography align="center" key={"empty-type"}>
          No workflows found for visit {props.currentVal}
        </Typography>
      )}

      {workflowData.workflows.nodes.length > 0 &&
        workflowData.workflows.nodes.map((val, idx) => {
          if (val.status?.__typename == "WorkflowPendingStatus") {
            return (
              <Stack key={`${idx}-${val.name}`}>
                <PendingNodeComponent
                  title={val.name}
                  data={val.status}
                  key={`${idx}=${val.name}`}
                />
              </Stack>
            );
          }

          if (val.status?.__typename == "WorkflowRunningStatus") {
            return (
              <Stack key={`${idx}=running-${val.name}`}>
                <RunningNodeComponent
                  title={val.name}
                  data={val.status as WorkflowRunningStatus}
                />
              </Stack>
            );
          }
          if (val.status?.__typename == "WorkflowSucceededStatus") {
            return (
              <Stack key={`${idx}${val.name}`}>
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
                data={
                  val.status as WorkflowErroredStatus | WorkflowFailedStatus
                }
              />
            );
          }
        })}
    </Box>
  );
}
