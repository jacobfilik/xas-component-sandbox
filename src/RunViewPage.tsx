import { Stack, TextField } from "@mui/material";

import RunViewForVisit from "./RunViewForVisit";
import { useState } from "react";

export default function RunViewPage() {
  const [visit, setVisit] = useState("cm44254-1");

  return (
    <Stack height={"100%"} width={"100%"}>
      <TextField
        variant="outlined"
        label="Visit"
        value={visit}
        onChange={(e) => setVisit(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <RunViewForVisit visit={visit}></RunViewForVisit>
    </Stack>
  );
}
