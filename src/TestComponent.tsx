import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { Box, Container, Paper, Stack, TextField } from "@mui/material";

import { CompactGroupFormRenderer, CompactGroupTester } from "./CompactGroup";
import { JsonForms } from "@jsonforms/react";
import { useState } from "react";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroupFormRenderer },
];

export default function TestComponent() {
  const [data, setData] = useState({
    scanName: "My Scan",
    scanNumber: 12345,
    sampleName: "My Sample",
  });
  const schema = {
    properties: {
      scanName: {
        type: "string",
      },
      scanNumber: {
        type: "integer",
      },
      sampleName: {
        type: "string",
      },
    },
  };

  const uischema = {
    type: "Group",
    label: "Some Important Values",

    elements: [
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/scanName",
          },
          {
            type: "Control",
            scope: "#/properties/scanNumber",
          },
          {
            type: "Control",
            scope: "#/properties/sampleName",
          },
        ],
      },
    ],
  };

  return (
    <Box flex={1}>
      <Container sx={{ padding: "10px" }}>
        <Stack>
          <Paper sx={{ padding: "20px", margin: "50px" }} elevation={20}>
            <JsonForms
              schema={schema}
              data={data}
              renderers={renderers}
              uischema={uischema}
              cells={materialCells}
              onChange={({ data }) => {
                setData({ ...data });
              }}
            />
          </Paper>
          <TextField
            rows={12}
            multiline
            value={JSON.stringify(data, null, 2)}
          ></TextField>
        </Stack>
      </Container>
    </Box>
  );
}
