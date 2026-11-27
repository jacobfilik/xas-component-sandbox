import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import { WorkflowContext } from "../WorkflowProvider";
import { getVisitString } from "../../queryfunctions";

export function VisitTextField() {
  const { currentVisit, setCurrentVisit } = useContext(WorkflowContext);

  const [visitString, setVisitString] = useState(getVisitString(currentVisit));

  const [isError, setIsError] = useState(false);

  const onVisitChange = (value: string) => {
    setVisitString(value);

    const visitNumber = Number(value.split("-")[1]);
    const propCode = String(value.split("-")[0].match(/[^0-9]+/));
    const propNumber = Number(value.split("-")[0].match(/[0-9]+/));

    if (
      Number.isNaN(visitNumber) ||
      Number.isNaN(propNumber) ||
      propCode.length != 2 ||
      Number(visitNumber) == 0 ||
      String(propNumber).length !== 5
    ) {
      setIsError(true);
    } else {
      setIsError(false);

      setCurrentVisit({
        visit: {
          proposalCode: propCode,
          proposalNumber: propNumber,
          number: visitNumber,
        },
      });
    }
  };

  return (
    <>
      {!isError && (
        <TextField
          variant="outlined"
          label="Visit"
          value={visitString}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(val) => onVisitChange(val.target.value)}
        ></TextField>
      )}
      {isError && (
        <TextField
          error
          variant="outlined"
          label="Invalid Visit Code"
          value={visitString}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(val) => onVisitChange(val.target.value)}
        ></TextField>
      )}
    </>
  );
}
