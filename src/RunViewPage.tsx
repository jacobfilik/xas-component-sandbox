import { Stack, TextField } from "@mui/material";

import RunViewForVisit from "./RunViewForVisit";
import { useState } from "react";

export default function RunViewPage() {
  const [visit, setVisit] = useState("cm44254-1");
  const [beamline, setBeamline] = useState("p51");
  const [offset, setOffset] = useState(0);

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      spacing="10px"
      overflow="hidden"
      padding="10px"
    >
      <Stack direction="row" spacing={"10px"}>
        <TextField
          variant="outlined"
          label="Visit"
          value={beamline}
          onChange={(e) => {
            setOffset(0);
            setBeamline(e.target.value);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
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
      </Stack>

      {visit.length != 0 && beamline.length != 0 && (
        <RunViewForVisit
          beamline={beamline}
          visit={visit}
          offset={offset}
          setOffset={setOffset}
        ></RunViewForVisit>
      )}
    </Stack>
  );
}
