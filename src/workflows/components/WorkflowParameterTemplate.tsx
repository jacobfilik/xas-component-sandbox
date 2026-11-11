// since this UI is only running one workflow template, make a page
// just for it:

import { useContext, useState } from "react";
import { WorkflowContext } from "../WorkflowProvider";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { Metadata } from "../../models";

export function WorkflowParameterComponent(props: {
  workflowMeta: Metadata | null;
}) {
  const { workflowParams, tiledEntry } = useContext(WorkflowContext);

  const getPaths = () => {
    let pathmap = [""];

    if (props.workflowMeta) {
      const meta = props.workflowMeta;

      pathmap = Object.keys(meta.data_keys).map(
        (key) => meta.data_keys[key].source,
      );

      pathmap = [...new Set(pathmap)];
    }
    return pathmap;
  };

  const getKeys = () => {
    if (props.workflowMeta) {
      return Object.keys(props.workflowMeta.data_keys);
    } else {
      return [""];
    }
  };

  return (
    <Stack spacing={2}>
      <Typography align="center" variant="h6">
        Workflow Parameters
      </Typography>

      <Stack spacing={2}>
        <Typography>Tiled ID: {tiledEntry?.id}</Typography>

        {/* add fpath! */}
      </Stack>
      <Stack spacing={2}>
        <ParameterMenu
          key="fpath-menu"
          options={getPaths()}
          label="fpath"
          init={getPaths()[0]}
        />

        <ParameterMenu
          key="xname-menu"
          options={getKeys()}
          label="xname"
          init={workflowParams.xname as string}
        />
        <ParameterMenu
          options={getKeys()}
          key="yname-menu"
          label="yname"
          init={workflowParams.yname as string}
        />
      </Stack>
    </Stack>
  );
}

function ParameterMenu(props: {
  options: string[];
  label: string;
  init: string;
}) {
  const [value, setValue] = useState<string>(props.init);

  return (
    <>
      <FormControl>
        <InputLabel id={`${props.label}-select-label`}>
          {props.label}
        </InputLabel>
        <Select
          labelId={`${props.label}-select-label`}
          id={`${props.label}-select`}
          value={value}
          label={props.label}
          onChange={(event: SelectChangeEvent) => {
            setValue(event.target.value);
          }}
        >
          <MenuItem value=""></MenuItem>
          {props.options.map((option) => (
            <MenuItem value={option} key={`${option}-item`}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
