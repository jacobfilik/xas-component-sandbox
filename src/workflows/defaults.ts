import type { WorkflowTemplate } from "../__generated__/graphql";
import type { JSONObject, TiledEntryInfo } from "../models";
import type { WorkflowProgress } from "./WorkflowsData/__generated__/GetWorkflow.generated";
import type {
  WorkflowQuery,
  WorkflowQueryVariables,
} from "./WorkflowsData/__generated__/TaskFragments.generated";

export const defaultWorkflowConnection: WorkflowQueryVariables = {
  visit: { number: 1, proposalCode: "cm", proposalNumber: 44254 },
};

export const defaultTiledEntry: TiledEntryInfo = {
  id: "",
  running: false,
};

export const defaultWorkflowParams: JSONObject = {
  fpath: "",
  tiled_id: "",
  xname: "",
  yname: "",
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
        id: "0000",
        status: {
          __typename: "WorkflowPendingStatus",
          message: "initial seatch",
        },
      },
    ],
  },
};

export const emptyWorkflowTemplate: WorkflowTemplate = {
  __typename: "WorkflowTemplate",
  name: "empty",
  title: null,
  description: null,
  arguments: {},
  uiSchema: {},
  repository: null,
  maintainer: "",
  templateSource: {
    __typename: "TemplateSource",
    path: "",
    repositoryUrl: "",
    targetRevision: "HEAD",
  },
};

export const TemplateFilters: string[] = ["EXAMPLES", "SPECTROSCOPY"];

export const TemplateName: string = "panda-repetitions";

export const emptyWorkflowProgress: WorkflowProgress = {
  workflowById: {
    id: "342523",
    __typename: "Workflow",
    name: "test",
    status: { __typename: "WorkflowPendingStatus" },
  },
};

export const completedWorkflowProgress: WorkflowProgress = {
  workflowById: {
    id: "342523",
    __typename: "Workflow",
    name: "test",
    status: {
      __typename: "WorkflowSucceededStatus",
      message: "completed!",
      startTime: "0",
      tasks: [{ __typename: "Task", artifacts: [], name: "Super TASK" }],
    },
  },
};
