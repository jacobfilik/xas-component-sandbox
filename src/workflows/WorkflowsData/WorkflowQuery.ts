import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  WorkflowQuery,
  WorkflowQueryVariables,
} from "./__generated__/WorkflowQuery.generated";
import { WORKFLOW_NODE_FRAGMENT } from "./WorkflowNodeFragment";

export const WORKFLOW_QUERY: TypedDocumentNode<
  WorkflowQuery,
  WorkflowQueryVariables
> = gql`
  query WorkflowQuery(
    $visit: VisitInput!
  ) {
    workflows(visit: $visit) {
      __typename
      ...WorkflowNodeFragment
    }
  }
  ${WORKFLOW_NODE_FRAGMENT}
`;
