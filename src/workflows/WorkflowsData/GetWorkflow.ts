import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  WorkflowProgress,
  WorkflowProgressVariables,
} from "./__generated__/GetWorkflow.generated";

export const WORKFLOW_TEMPLATE_QUERY: TypedDocumentNode<
  WorkflowProgress,
  WorkflowProgressVariables
> = gql`
  query WorkflowProgress($id: ID!) {
    workflowById(id: $id) {
      id
      name
      status {
        __typename
        ... on WorkflowSucceededStatus {
          message
          startTime
          __typename
          tasks {
            name
            artifacts {
              name
            }
          }
        }
        ... on WorkflowErroredStatus {
          message
          startTime
        }
      }
    }
  }
`;
