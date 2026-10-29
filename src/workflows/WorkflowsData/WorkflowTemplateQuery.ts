import type {
  TemplateCardFragment,
  WorkflowTemplateQuery,
  WorkflowTemplateQueryVariables,
} from "./__generated__/WorkflowTemplateQuery.generated";

import { gql, type TypedDocumentNode } from "@apollo/client";

const TEMPLATE_CARD_FRAGMENT: TypedDocumentNode<TemplateCardFragment> = gql`
  fragment TemplateCardFragment on WorkflowTemplate {
    __typename
    name
    title
    description
    maintainer
    repository
    templateSource {
      __typename
      repositoryUrl
      path
      targetRevision
    }
  }
`;

export const WORKFLOW_TEMPLATE_QUERY: TypedDocumentNode<
  WorkflowTemplateQuery,
  WorkflowTemplateQueryVariables
> = gql`
  query WorkflowTemplateQuery($filter: WorkflowTemplatesFilter) {
    workflowTemplates(filter: $filter) {
      __typename
      nodes {
        name
        title
        description
        ...TemplateCardFragment
      }
    }
  }
  ${TEMPLATE_CARD_FRAGMENT}
`;
