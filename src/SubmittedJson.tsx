import { TextField } from "@mui/material";

export default function SubmittedJson(props: { planJson: string }) {
  return (
    <TextField
      sx={{ width: "100%" }}
      label="Plan JSON"
      rows={12}
      value={props.planJson}
      multiline
    />
  );
}
