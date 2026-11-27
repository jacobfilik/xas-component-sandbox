import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postPlan, putTask } from "../queryfunctions";
import ElementSelector from "./ElementSelector";

export default function DemoScanComponent(props: {
  setBlueApiTaskId: (id: string) => void;
  session: string;
}) {
  const availableElements = new Set(["Fe", "Zn", "Co", "Ni", "Cu", "Mn"]);
  const [selectedElement, setSelectedElement] = useState<string>("Fe");
  const [time, setTime] = useState<number>(5);
  const [sweeps, setSweeps] = useState<number>(10);

  const plan = {
    name: "seq_table_uniform_scan",
    params: {
      start: 0,
      stop: 10,
      stepsize: 0.005,
      number_of_sweeps: 4,
      time_per_sweep: 5,
      num_trajectory_points: 10,
      add_sweep_triggers: false,
      ramp_time: 0.001,
      turnaround_time: 0.0001,
      is_adaptive_scan: false,
      metadata: { user_comments: "" },
    },
    instrument_session: props.session,
  };

  // const plan: PandaUniformScanPlan = {
  //   start: 0,
  //   stop: 10,
  //   stepsize: 0.005,
  //   number_of_sweeps: 4,
  //   time_per_sweep: 5,
  //   num_trajectory_points: 10,
  //   add_sweep_triggers: false,
  //   ramp_time: 0.001,
  //   turnaround_time: 0.0001,
  //   metadata: "",
  //   enable_triggers: false,
  //   trigger_output_ports: [1, 2],
  //   trigger_pulse_width: 0.0001,
  //   trigger_output_delay: 0,
  //   trigger_output_num_repeats: 1,
  //   trigger_type: 0,
  //   trigger_repeat: 1,
  //   enable_pvs: false,
  //   pv_name: "BL20J-PV-MOCK-02",
  //   pv_datatype: "int",
  //   pv_id: "mock_pv",
  //   pv_min_threshold: 0,
  //   pv_max_threshold: 20,
  //   pv_ensure_in_range: false,
  //   pv_compute_snr: false,
  //   pv_snr_min_threshold: 30,
  //   is_adaptive_scan: false, // Default value for adaptive scans
  // };

  const putMutation = useMutation({
    mutationFn: putTask,
    onSuccess: (data) => {
      props.setBlueApiTaskId(data.task_id);
    },
    onError: () => {},
  });

  const mutation = useMutation({
    mutationFn: postPlan,
    onSuccess: (data) => {
      putMutation.mutate(data);
    },
    onError: () => {},
  });

  return (
    <Stack height="100%" spacing="10px">
      <Typography variant="h6">Configure Measurement</Typography>
      <ElementSelector
        availableElements={availableElements}
        setSelectedElement={setSelectedElement}
        selectedElement={selectedElement}
      ></ElementSelector>
      <TextField
        value={time}
        label="Time"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value;

          if (value.length == 0) {
            value = "1.0";
          } else if (value.endsWith(".")) {
            value = value + "0";
          }

          const f = parseFloat(value);

          if (isNaN(f)) {
            setTime(1);
          } else {
            setTime(f);
          }
        }}
      ></TextField>
      <TextField
        value={sweeps}
        label="Num. Sweeps"
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSweeps(parseInt(e.target.value));
        }}
      ></TextField>
      <Button
        variant="contained"
        onClick={() => {
          plan.params.time_per_sweep = time;
          plan.params.number_of_sweeps = sweeps;
          mutation.mutate(plan);
        }}
      >
        Submit Scan
      </Button>
    </Stack>
  );
}
