import { Button, Stack, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postPlan } from "./queryfunctions";

export default function SubmitPage() {
  const [planString, setPlanString] = useState<string>("{}");
  const [planObject, setPlanObject] = useState<object | null>({});

  const mutation = useMutation({
    mutationFn: postPlan,
    onSuccess: () => {
      // Invalidate and refetch
      //   callback();
    },
    onError: () => {
      //   setState("error");
      //   setDisabled(false);
    },
  });

  const onChange = (input: string) => {
    setPlanString(input);

    try {
      const inputObject = JSON.parse(input);
      setPlanObject(inputObject);
    } catch {
      setPlanObject(null);
    }
  };

  return (
    <Stack height="100%" padding="50px" spacing="10px">
      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Plan JSON"
        rows={12}
        value={planString}
        multiline
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <Button
        disabled={planObject == null || mutation.isPending}
        variant="contained"
        onClick={() => {
          if (planObject != null) {
            mutation.mutate(planObject);
          }
        }}
      >
        Submit
      </Button>
    </Stack>
  );
}
