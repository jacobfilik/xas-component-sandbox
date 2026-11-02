import { useContext } from "react";
import { WorkflowContext } from "../WorkflowProvider";
import { Alert, Stack } from "@mui/material";
import type { WorkflowTemplateProps } from "../../models";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

import { useMutation, useQuery } from "@apollo/client/react";
import type { Visit } from "../../__generated__/graphql";
import { WORKFLOW_TEMPLATE_VIEW_QUERY } from "../WorkflowsData/TemplateFragment";
import { TEMPLATE_VIEW_MUTATION } from "../WorkflowsData/PostWorkflow";
import { FormComponent } from "./FormTemplate";

export function TemplatePopper(props: { name: string }) {
  const { currentVisit } = useContext(WorkflowContext);

  const { error, data } = useQuery(WORKFLOW_TEMPLATE_VIEW_QUERY, {
    variables: { templateName: props.name },
  });

  const [submitMutation] = useMutation(TEMPLATE_VIEW_MUTATION);

  const handleSubmit = (visit: Visit, parameters?: object) => {
    submitMutation({
      variables: {
        visit: visit,
        templateName: props.name,
        parameters: parameters,
      },
    }).then((data) => {
      console.log(data);
    });
  };

  if (error) {
    return (
      <Stack>
        <Alert severity="error">{error.message}</Alert>
      </Stack>
    );
  }

  if (data) {
    const wf = data.workflowTemplate;

    const formProps: WorkflowTemplateProps = {
      title: wf.title ? wf.title : wf.name,
      maintainer: wf.maintainer,
      description: wf.description ? wf.description : "None",
      repository: wf.repository ? wf.repository : "None",
      parametersSchema: wf.arguments as JsonSchema,
      parametersUISchema: wf.uiSchema
        ? (wf.uiSchema as UISchemaElement)
        : undefined,
      prepopulatedParameters: undefined,
      visit: currentVisit.visit,
      onSubmit: handleSubmit,
    };

    if (props.name == "None") {
      return <Stack>No Template Selected</Stack>;
    }

    return (
      <Stack>
        <FormComponent {...formProps} />
      </Stack>
    );
  }
}
