import type { WorkflowQuery, WorkflowQueryVariables } from "../WorkflowsData/__generated__/WorkflowQuery.generated";

export const defaultWorkflowConnection: WorkflowQueryVariables = {
  visit: { number: 5, proposalCode: "cm", proposalNumber: 44186 },
};

export const emptyWorkflowQuery: WorkflowQuery = {
  workflows: {
    __typename: "WorkflowConnection",
    nodes: [],
  },
};