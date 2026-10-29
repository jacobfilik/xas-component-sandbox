import { Divider, Snackbar, Stack, Typography, useTheme } from "@mui/material";

import { createAjv } from "@jsonforms/core";
import { useState } from "react";
import { type ErrorObject } from "ajv";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { VisitInput, type Visit } from "@diamondlightsource/sci-react-ui";
import type { JSONObject, WorkflowTemplateProps } from "../../models";

export const FormComponent: React.FC<WorkflowTemplateProps> = ({
  title,
  maintainer,
  repository,
  description,
  parametersSchema,
  parametersUISchema,
  prepopulatedParameters,
  visit,
  onSubmit,
  parameterMessage,
}) => {
  const theme = useTheme();
  const validator = createAjv({ useDefaults: true, coerceTypes: true });

  const [params, setParams] = useState<JSONObject>(
    prepopulatedParameters ?? {},
  );
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);

  const onClick = (visit:Visit, parameters?:object) => {
    if (errors.length === 0){
        onSubmit(visit, parameters??{})
        setSubmit(true)
    }
  }

  const theWidth =
    ((parametersUISchema?.options?.formWidth as string) || undefined) ?? "100%";

  return (
    <Stack spacing={theme.spacing(2)} width={theWidth}>
      <Typography variant="h6" align="center">
        {title}
      </Typography>
      <Typography variant="body1" align="center">
        {description}
      </Typography>
      <Typography variant="body1" align="center">
        Maintainer: {maintainer}
      </Typography>
      <Typography variant="body2">{repository}</Typography>
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
          setErrors(errors ? errors : []);
        }}
      />
      <Divider/>
      <VisitInput
      visit = {visit}
      onSubmit={onClick}
    parameters={params}
    submitOnReturn={false}
      />
      <Snackbar open={submit} autoHideDuration={6000}
      message="submitted" onClose={() => setSubmit(false)}/>
    </Stack>
  );
};
