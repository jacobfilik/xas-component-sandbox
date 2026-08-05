import { Stack, TextField } from "@mui/material";

import RunViewForVisit from "./RunViewForVisit";
import { useState } from "react";

export default function RunViewPage() {
  const [visit, setVisit] = useState("cm44254-1");
  const [offset, setOffset] = useState(0);

  return (
    <Stack height={"100%"} width={"100%"} spacing="10px" overflow="hidden">
      <TextField
        variant="outlined"
        label="Visit"
        value={visit}
        onChange={(e) => {
          setOffset(0);
          setVisit(e.target.value);
        }}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <RunViewForVisit
        visit={visit}
        offset={offset}
        setOffset={setOffset}
      ></RunViewForVisit>
    </Stack>
  );
}
