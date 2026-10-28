// get info on timings + status for each task in a WorkflowConnection node.

import { gql, type TypedDocumentNode } from "@apollo/client";
import { TASK_TIME_FRAGMENT } from "./TaskTimeFragment";
import { TASK_STATUS_FRAGRMENT } from "./TaskStatusFragment"
import type { WorkflowNodeFragment } from "./__generated__/WorkflowNodeFragment.generated";

export const WORKFLOW_NODE_FRAGMENT: TypedDocumentNode<WorkflowNodeFragment> = gql`
  fragment WorkflowNodeFragment on WorkflowConnection {
    __typename
    nodes {
      __typename
      name
      ...TaskTimeFragment
      ...TaskStatusFragment
    }
  }
  ${TASK_TIME_FRAGMENT}
  ${TASK_STATUS_FRAGRMENT}
`;
