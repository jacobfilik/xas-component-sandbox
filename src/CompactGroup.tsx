import {
  MaterialLayoutRenderer,
  type MaterialLayoutRendererProps,
} from "@jsonforms/material-renderers";
import { Stack, Typography } from "@mui/material";

import { withJsonFormsLayoutProps } from "@jsonforms/react";

import { rankWith, uiTypeIs } from "@jsonforms/core";

export const CompactGroupTester = rankWith(1000, uiTypeIs("Group"));

const CompactGroupRenderer = (props: MaterialLayoutRendererProps) => {
  const { uischema, schema, path, visible, renderers } = props;

  const layoutProps: MaterialLayoutRendererProps = {
    // @ts-expect-error for demo
    elements: uischema.elements,
    schema: schema,
    path: path,
    direction: "column",
    visible: visible,
    uischema: uischema,
    renderers: renderers,
  };
  return (
    <Stack spacing="10px">
      <Typography>
        {
          // @ts-expect-error for demo
          uischema.label
        }
      </Typography>

      <MaterialLayoutRenderer {...layoutProps} />
    </Stack>
  );
};

export const CompactGroupFormRenderer =
  // @ts-expect-error for demo
  withJsonFormsLayoutProps(CompactGroupRenderer);
