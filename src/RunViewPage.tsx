import { Stack, TextField } from "@mui/material";

import RunViewForVisit from "./RunViewForVisit";
import { useContext, useState } from "react";
import { WorkflowContext } from "./workflows/WorkflowProvider";
import { getVisitString } from "./queryfunctions";
import { VisitTextField } from "./workflows/components/ChangeVisitComponent";

export default function RunViewPage() {
  const { currentVisit } = useContext(WorkflowContext);
  const [visit] = useState(getVisitString(currentVisit));
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
        <VisitTextField />
      </Stack>

      {visit.length != 0 && beamline.length != 0 && (
        <RunViewForVisit
          beamline={beamline}
          offset={offset}
          setOffset={setOffset}
        ></RunViewForVisit>
      )}
    </Stack>
  );
}
