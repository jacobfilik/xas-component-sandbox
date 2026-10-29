import type { WorkflowQuery, WorkflowQueryVariables } from "./WorkflowsData/__generated__/WorkflowQuery.generated";

export const defaultWorkflowConnection: WorkflowQueryVariables = {
  visit: { number: 5, proposalCode: "cm", proposalNumber: 44186 },
};

export const emptyWorkflowQuery: WorkflowQuery = {
  workflows: {
    __typename: "WorkflowConnection",
    nodes: [],
  },
};


export const initialWorkflowQuery: WorkflowQuery = {
  workflows: {
    __typename: "WorkflowConnection",
    nodes: [
      {
        __typename: "Workflow",
        name: "initial",
        status: {
          __typename: "WorkflowPendingStatus",
          message: "initial search",
        },
      },
    ],
  },
};

export const TemplateFilters: string[] = ["EXAMPLES", "SPECTROSCOPY"];