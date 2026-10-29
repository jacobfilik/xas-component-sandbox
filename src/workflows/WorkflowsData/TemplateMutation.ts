
import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  TemplateViewMutation,
  TemplateViewMutationVariables,
} from "./__generated__/TemplateMutation.generated";

export const TEMPLATE_VIEW_MUTATION: TypedDocumentNode<
  TemplateViewMutation,
  TemplateViewMutationVariables
> = gql`
mutation TemplateViewMutation($templateName: String!, $visit: VisitInput!, $parameters: JSON!){
    submitWorkflowTemplate(name: $templateName, visit:$visit, parameters: $parameters){
    __typename
    name
    id
}
}`;
