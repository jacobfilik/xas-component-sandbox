import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  TaskArtifactFragment,
  TaskTimeFragment,
  TaskStatusFragment,
  TaskFullFragment,
  WorkflowFragment,
  WorkflowQuery,
  WorkflowQueryVariables,
} from "./__generated__/TaskFragments.generated";

export const TASK_ARTIFACT_FRAGMENT: TypedDocumentNode<TaskArtifactFragment> = gql`
  fragment TaskArtifactFragment on Task {
    __typename
    artifacts {
      __typename
      name
      url
      mimeType
    }
  }
`;

export const TASK_TIME_FRAGMENT: TypedDocumentNode<TaskTimeFragment> = gql`
  fragment TaskTimeFragment on Task {
    __typename
    startTime
    endTime
    id
  }
`;

export const TASK_STATUS_FRAGRMENT: TypedDocumentNode<TaskStatusFragment> = gql`
  fragment TaskStatusFragment on Task {
    __typename
    name
    status
    id
  }
`;

export const TASK_FULL_FRAGMENT: TypedDocumentNode<TaskFullFragment> = gql`
  fragment TaskFullFragment on Task {
    __typename
    ...TaskTimeFragment
    ...TaskStatusFragment
    ...TaskArtifactFragment
  }
  ${TASK_TIME_FRAGMENT}
  ${TASK_STATUS_FRAGRMENT}
  ${TASK_ARTIFACT_FRAGMENT}
`;

export const WORKFLOW_FRAGMENT: TypedDocumentNode<WorkflowFragment> = gql`
  fragment WorkflowFragment on Workflow {
    name
    id
    __typename
    status {
      __typename
      ... on WorkflowRunningStatus {
        __typename
        tasks {
          __typename
          ...TaskFullFragment
        }
      }
      ... on WorkflowSucceededStatus {
        __typename
        tasks {
          __typename
          ...TaskFullFragment
        }
      }
      ... on WorkflowPendingStatus {
        __typename
        message
      }

      ... on WorkflowErroredStatus {
        __typename
        tasks {
          __typename
          ...TaskFullFragment
        }
      }

      ... on WorkflowFailedStatus {
        __typename
        tasks {
          __typename
          ...TaskFullFragment
        }
      }
    }
  }
  ${TASK_FULL_FRAGMENT}
`;

export const WORKFLOW_QUERY: TypedDocumentNode<
  WorkflowQuery,
  WorkflowQueryVariables
> = gql`
  query WorkflowQuery($visit: VisitInput!) {
    workflows(visit: $visit) {
      __typename
      nodes {
        __typename
        ...WorkflowFragment
      }
    }
  }
  ${WORKFLOW_FRAGMENT}
`;
