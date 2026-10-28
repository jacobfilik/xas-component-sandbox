import { gql, type TypedDocumentNode } from "@apollo/client";
import type { TaskTimeFragment } from "./__generated__/TaskTimeFragment.generated";

export const TASK_TIME_FRAGMENT: TypedDocumentNode<TaskTimeFragment> = gql`
  fragment TaskTimeFragment on Workflow {
    status {
      __typename
      ... on WorkflowRunningStatus {
        startTime
        tasks {
          __typename
          name
          startTime
          endTime
        }
      }
      ... on WorkflowSucceededStatus {
        __typename
        startTime
        endTime
        tasks {
          __typename
          name
          startTime
          endTime
        }
      }
      ... on WorkflowPendingStatus {
        __typename
        message
      }

      ... on WorkflowFailedStatus {
        __typename
        startTime
        endTime
        tasks {
          __typename
          name
          startTime
          endTime
        }
      }

      ... on WorkflowErroredStatus {
        __typename
        startTime
        endTime
        tasks {
          __typename
          name
          startTime
          endTime
        }
      }
    }
  }
`;
