import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  TemplateFragment,
  WorkflowTemplateQuery,
  WorkflowTemplateQueryVariables,
  WorkflowTemplateViewQuery,
  WorkflowTemplateViewQueryVariables,
} from "./__generated__/TemplateFragments.generated";

export const TEMPLATE_FRAGMENT: TypedDocumentNode<TemplateFragment> = gql`
  fragment TemplateFragment on WorkflowTemplate {
    __typename
    name
    title
    description
    maintainer
    arguments
    uiSchema
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
        ...TemplateFragment
      }
    }
  }
  ${TEMPLATE_FRAGMENT}
`;
export const WORKFLOW_TEMPLATE_VIEW_QUERY: TypedDocumentNode<
  WorkflowTemplateViewQuery,
  WorkflowTemplateViewQueryVariables
> = gql`
  query WorkflowTemplateViewQuery($templateName: String!) {
    workflowTemplate(name: $templateName) {
      __typename
      ...TemplateFragment
    }
  }

  ${TEMPLATE_FRAGMENT}
`;
