// fragment to get the status and messages for tasks in a workflow.

import type { TaskStatusFragment } from "./__generated__/TaskStatusFragment.generated"
import { gql, type TypedDocumentNode } from "@apollo/client";

export const TASK_STATUS_FRAGRMENT: TypedDocumentNode<TaskStatusFragment> = gql`
  fragment TaskStatusFragment on Workflow {
    status {
      __typename
      ... on WorkflowRunningStatus {
        __typename
        tasks {
          __typename
          name
          status
        }
      }
      ... on WorkflowSucceededStatus {
        __typename
        startTime
        endTime
        tasks {
          __typename
          name
          status
        }
      }
      ... on WorkflowPendingStatus {
        __typename
        message
      }

      ... on WorkflowFailedStatus {
        __typename
        tasks {
          __typename
          name
          status
        }
      }

      ... on WorkflowErroredStatus {
        __typename
        tasks {
          __typename
          name
          status
        }
      }
    }
  }
`;
