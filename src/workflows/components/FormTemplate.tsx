// this can be ignored

import {
  Button,
  Divider,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { createAjv } from "@jsonforms/core";
import { useContext, useState } from "react";
import { type ErrorObject } from "ajv";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import type { JSONObject, WorkflowTemplateProps } from "../../models";
import { WorkflowContext } from "../WorkflowProvider";

export const FormComponent: React.FC<WorkflowTemplateProps> = ({
  title,
  maintainer,
  repository,
  description,
  parametersSchema,
  parametersUISchema,
  onSubmit,
  parameterMessage,
}) => {
  const theme = useTheme();
  const validator = createAjv({ useDefaults: true, coerceTypes: true });

  const { workflowParams, setWorkflowParams } =
    useContext(WorkflowContext);

  const [params, setParams] = useState<JSONObject>(workflowParams);

  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);

  const onClick = (parameters?: object) => {
    if (errors.length === 0) {
      onSubmit(parameters ?? {});
      setSubmit(true);
    }
  };

  const theWidth =
    ((parametersUISchema?.options?.formWidth as string) || undefined) ?? "100%";

  return (
    <Stack
      spacing={theme.spacing(3)}
      direction={"column"}
      overflow="hidden"
      flex={4}
      width={theWidth}
    >
      <Typography variant="h6" align="center">
        {title}
      </Typography>
      <Typography variant="body1" align="center">
        {description}
      </Typography>
      <Typography variant="body1" align="center">
        Maintainer: {maintainer}
      </Typography>
      <Typography variant="body2" align="center">
        {repository}
      </Typography>
      <Divider />
      {parameterMessage}
      <JsonForms
        schema={parametersSchema}
        uischema={parametersUISchema ?? undefined}
        data={params}
        cells={materialCells}
        renderers={materialRenderers}
        ajv={validator}
        onChange={({ data, errors }) => {
          setParams(data as JSONObject);
          setWorkflowParams(data)
          setErrors(errors ? errors : []);
        }}
      />
      <Divider />

      <Stack height="100%" flex={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClick(params);
          }}
          data-testid="submit-button"
        >
          Submit Workflow
        </Button>

        <Snackbar
          open={submit}
          autoHideDuration={6000}
          message="submitted"
          onClose={() => setSubmit(false)}
        />
      </Stack>
    </Stack>
  );
};
