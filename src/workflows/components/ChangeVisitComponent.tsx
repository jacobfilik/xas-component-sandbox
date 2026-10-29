import { Grid, Stack, TextField } from "@mui/material";
import { useContext } from "react";
import { WorkflowContext } from "../WorkflowProvider";

export function ChangeVisitComponent() {
  const { currentVisit, setCurrentVisit } = useContext(WorkflowContext);

  return (
    <Stack
      alignItems={"center"}
      spacing={"10px"}
      justifyContent={"space-around"}
      maxHeight={"150px"}
      height={"150px"}
      width={"800px"}
      maxWidth={"1000px"}
    >
      Current Visit
      <Stack
        spacing={"10px"}
        direction={"row"}
        justifyContent={"space-around"}
        width={"100%"}
        height="100px"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, md: 4 }} key={"code-grid"}>
            <TextField
              id="propcodeinputbox"
              label="Proposal Code"
              title="Proposal Code"
              value={currentVisit.visit.proposalCode}
              onChange={(e) => {
                setCurrentVisit({
                  ...currentVisit,
                  visit: {
                    ...currentVisit.visit,
                    proposalCode: e.target.value,
                  },
                });
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }} key={"number-grid"}>
            <TextField
              id="propnumberinputbox"
              label="Proposal Number"
              title="Proposal Number"
              value={currentVisit.visit.proposalNumber}
              onChange={(e) => {
                setCurrentVisit({
                  ...currentVisit,
                  visit: {
                    ...currentVisit.visit,
                    proposalNumber: Number(e.target.value),
                  },
                });
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }} key={"visit-grid"}>
            <TextField
              id="numberinputbox"
              label="Visit Number"
              title="Visit Number"
              value={currentVisit.visit.number}
              onChange={(e) => {
                setCurrentVisit({
                  ...currentVisit,
                  visit: {
                    ...currentVisit.visit,
                    number: Number(e.target.value),
                  },
                });
              }}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
