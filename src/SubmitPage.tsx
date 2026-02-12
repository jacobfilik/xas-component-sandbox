import { Button, Stack, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postPlan, putTask } from "./queryfunctions";

export default function SubmitPage() {
  const [planString, setPlanString] = useState<string>("{}");
  const [planObject, setPlanObject] = useState<object | null>({});

  const putMutation = useMutation({
    mutationFn: putTask,
    onSuccess: () => {},
    onError: () => {},
  });

  const mutation = useMutation({
    mutationFn: postPlan,
    onSuccess: (data) => {
      putMutation.mutate(data);
    },
    onError: () => {},
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
