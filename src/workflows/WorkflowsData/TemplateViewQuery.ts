import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  SubmissionFormFragment,
  TemplateViewQuery,
  TemplateViewQueryVariables,
} from "./__generated__/TemplateViewQuery.generated";

const SUBMISSION_FORM_FRAGEMENT: TypedDocumentNode<SubmissionFormFragment> = gql`
  fragment SubmissionFormFragment on WorkflowTemplate {
    __typename
    name
    title
    maintainer
    description
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

export const TEMPLATE_VIEW_QUERY: TypedDocumentNode<
  TemplateViewQuery,
  TemplateViewQueryVariables
> = gql`
  query TemplateViewQuery($templateName: String!) {
    workflowTemplate(name: $templateName) {
      __typename
      ...SubmissionFormFragment
    }
  } ${SUBMISSION_FORM_FRAGEMENT}
`;
