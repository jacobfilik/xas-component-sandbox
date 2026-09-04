import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

type ReadablePV = [string, string, string, number, number, boolean, boolean, number];

type TriggerTuple = [
  number[], // trigger_output_ports
  number,   // trigger_pulse_width
  number,   // trigger_output_delay
  number,   // trigger_output_num_repeats
  number,   // trigger_type
  number    // trigger_repeat
];

interface InterPandaTriggerPlan {
  start:number,
  stop: number,
  stepsize: number,
  number_of_sweeps:number,
  time_per_sweep: number,
  num_trajectory_points: number,
  add_sweep_triggers: boolean,
  ramp_time: number,
  turnaround_time: number,
  metadata: string,
  trigger_output_ports: number[], 
  trigger_pulse_width: number,
  trigger_output_delay: number,
  trigger_output_num_repeats: number,
  trigger_type: number,
  trigger_repeat:number,
  configure_sampleEnv_triggers: boolean, 
  enable_pvs: boolean;
  pv_name: string;
  pv_datatype: string;
  pv_id: string;
  pv_min_threshold : number,
  pv_max_threshold: number,
  pv_ensure_in_range: boolean,
  pv_compute_snr: boolean,
  pv_snr_min_threshold: number,
}

const parameterInfo: Record<string, string> = {
  start: "Start position of the scan",
  stop: "End position of the scan",
  stepsize: "Scan step size",
  number_of_sweeps: "Number of sweeps",
  time_per_sweep: "Total duration of one sweep (seconds)",
  num_trajectory_points: "Number of points in the trajectory",
  add_sweep_triggers: " Add triggers at the end of the sweep (boolean)",
  ramp_time: "Ramp up time (seconds)",
  turnaround_time: "Turnaround time (seconds)",
  metadata: "Optional metadata",
  trigger_output_ports: "Output ports used for triggers (comma-separated eg - 1,2,3)",
  trigger_pulse_width: "Width of the trigger pulse (seconds)",
  trigger_output_delay: "Delay before trigger fires (seconds)",
  trigger_output_num_repeats: "How many times the trigger repeats",
  trigger_type: "Trigger mode (0 -> START, 1-> END)",
  trigger_repeat: "Repeat the trigger sequence",
  configure_sampleEnv_triggers: "Configure Sample Environment Triggers",
  enable_pvs:"Enable PVs",
  pv_name:"Scannable PV",
  pv_datatype:"Datatype of PV",
  pv_id:"PV identifier",
  pv_min_threshold : "Minimum Threshold",
  pv_max_threshold: "Maximum Threshold",
  pv_ensure_in_range: "Ensure this PV in range before running a scan",
  pv_compute_snr: "Use SNR of this PV (True/False)",
  pv_snr_min_threshold: "Minimum Required Threshold for SNR",
};


export default function InterPandaTriggerPlanPanel(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [InterPandaTriggerPlan, setInterPandaTriggerPlan] = useState<InterPandaTriggerPlan>({
    start:0,
    stop: 10,
    stepsize: 1,
    number_of_sweeps: 4,
    time_per_sweep: 5,
    num_trajectory_points: 10,
    add_sweep_triggers: false,
    ramp_time: 0.001,
    turnaround_time: 0.0001,
    metadata:"",
    trigger_output_ports:[1,2], 
    trigger_pulse_width: 0.0001,
    trigger_output_delay: 0,
    trigger_output_num_repeats: 1,
    trigger_type: 0,
    trigger_repeat:1,
    configure_sampleEnv_triggers: false,
    enable_pvs:false,
    pv_name:"BL51P-OP-PCHRO-01:TS:XFINE.RBV",
    pv_datatype:"float",
    pv_id: "motor_readback",
    pv_min_threshold: -10,
    pv_max_threshold: 20,
    pv_ensure_in_range: false,
    pv_compute_snr: false,
    pv_snr_min_threshold: 30,
  });
  const [readable_pvs, setPvs] = useState<ReadablePV[]>([]);
  const handleChange = (key: keyof InterPandaTriggerPlan, value: any) => {
    setInterPandaTriggerPlan(prev => ({ ...prev, [key]: value }));
  };

  const [triggers, setTriggers] = useState<TriggerTuple[]>([]);
  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Inter Panda Triggering Scan</Typography>
        {[
        "start",
        "stop",
        "stepsize",
        "number_of_sweeps",
        "time_per_sweep",
        "num_trajectory_points",
        "ramp_time",
        "turnaround_time",
        "metadata",
        ].map((key) => {
            const value = (InterPandaTriggerPlan as any)[key]; // ✅ get value from plan
            return (
                <Stack direction="column" spacing={"10px"}>
                  <Typography variant="body2" color="text.secondary">
                    {parameterInfo[key] ?? "No description available"}
                  </Typography>
                  <TextField
                    key={key}
                    type={
                      Array.isArray(value)
                        ? "text"
                        : typeof value === "number"
                        ? "number"
                        : "text"
                    }
                    value={Array.isArray(value) ? value.join(",") : value}
                    onChange={(e) =>
                      handleChange(
                        key as any,
                        Array.isArray(value)
                          ? e.target.value
                              .split(",")
                              .map((v) => Number(v.trim()))
                              .filter((v) => !Number.isNaN(v))
                          : typeof value === "number"
                          ? parseFloat(e.target.value)
                          : e.target.value
                      )
                    }
                  />
                </Stack>
              );
            })}

        <FormControlLabel
          control={
            <Checkbox
              checked={InterPandaTriggerPlan.add_sweep_triggers}
              onChange={(e) => handleChange("add_sweep_triggers", e.target.checked)}
            />
          }
          label="Enable Sweep Triggers"
        />

        {/* Trigger Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Configure Sample Environment Triggers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={InterPandaTriggerPlan.configure_sampleEnv_triggers}
                    onChange={(e) => handleChange("configure_sampleEnv_triggers", e.target.checked)}
                  />
                }
                label="Enable Triggers"
              />

              {InterPandaTriggerPlan.configure_sampleEnv_triggers && (
                <>
                  {[
                    "trigger_output_ports",
                    "trigger_pulse_width",
                    "trigger_output_delay",
                    "trigger_output_num_repeats",
                    "trigger_type",
                    "trigger_repeat"
                  ].map((key) => {
                    const value = (InterPandaTriggerPlan as any)[key]; // ✅ get value from plan

                     return (
                      <Stack direction="column" spacing={"10px"}>
                        <Typography variant="body2" color="text.secondary">
                          {parameterInfo[key] ?? "No description available"}
                        </Typography>
                        <TextField
                          key={key}
                          type={
                            Array.isArray(value)
                              ? "text"
                              : typeof value === "number"
                              ? "number"
                              : "text"
                          }
                          value={Array.isArray(value) ? value.join(",") : value}
                          onChange={(e) =>
                            handleChange(
                              key as any,
                              Array.isArray(value)
                                ? e.target.value
                                    .split(",")
                                    .map((v) => Number(v.trim()))
                                    .filter((v) => !Number.isNaN(v))
                                : typeof value === "number"
                                ? parseFloat(e.target.value)
                                : e.target.value
                            )
                          }
                        />
                      </Stack>
                    );
                  })}

                  <Button
                    onClick={() => {
                      setTriggers(prev => [
                        ...prev,
                        [
                          InterPandaTriggerPlan.trigger_output_ports,
                          InterPandaTriggerPlan.trigger_pulse_width,
                          InterPandaTriggerPlan.trigger_output_delay,
                          InterPandaTriggerPlan.trigger_output_num_repeats,
                          InterPandaTriggerPlan.trigger_type,
                          InterPandaTriggerPlan.trigger_repeat,
                        ],
                      ]);
                    }}
                  >
                    Add Trigger
                  </Button>
                </>
              )}
            </Stack>
            {/* Preview */}
            {triggers.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography>Triggers</Typography>
                {triggers.map((t, i) => (
                  <Typography key={i}>{JSON.stringify(t)}</Typography>
                ))}
              </Paper>
            )}            
          </AccordionDetails>
        </Accordion>

        {/* PV Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>PV Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={InterPandaTriggerPlan.enable_pvs}
                    onChange={(e) => handleChange("enable_pvs", e.target.checked)}
                  />
                }
                label="Enable PVs"
              />

              {InterPandaTriggerPlan.enable_pvs && (
                <>
                  {[
                    "pv_name",
                    "pv_datatype",
                    "pv_id",
                    "pv_min_threshold",
                    "pv_max_threshold",
                    "pv_ensure_in_range",
                    "pv_compute_snr",
                    "pv_snr_min_threshold",
                  ].map((key) => {
                    const value = (InterPandaTriggerPlan as any)[key]; // ✅ get value from plan
                    return (
                      <Stack direction="column" spacing={"10px"}>
                        <Typography variant="body2" color="text.secondary">
                          {parameterInfo[key] ?? "No description available"}
                        </Typography>
                        <TextField
                          key={key}
                          type={
                            Array.isArray(value)
                              ? "text"
                              : typeof value === "number"
                              ? "number"
                              : "text"
                          }
                          value={Array.isArray(value) ? value.join(",") : value}
                          onChange={(e) =>
                            handleChange(
                              key as any,
                              Array.isArray(value)
                                ? e.target.value
                                    .split(",")
                                    .map((v) => Number(v.trim()))
                                    .filter((v) => !Number.isNaN(v))
                                : typeof value === "number"
                                ? parseFloat(e.target.value)
                                : e.target.value
                            )
                          }
                        />
                      </Stack>
                    );
                  })}

                  <Button
                    onClick={() => {
                      setPvs(prev => [
                        ...prev,
                        [InterPandaTriggerPlan.pv_id, InterPandaTriggerPlan.pv_name, InterPandaTriggerPlan.pv_datatype, InterPandaTriggerPlan.pv_min_threshold, InterPandaTriggerPlan.pv_max_threshold, InterPandaTriggerPlan.pv_ensure_in_range, InterPandaTriggerPlan.pv_compute_snr, InterPandaTriggerPlan.pv_snr_min_threshold],
                      ]);
                    }}
                  >
                    Add PV
                  </Button>
                </>
              )}
            </Stack>
          </AccordionDetails>
          {readable_pvs.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography>Readable PVs</Typography>
              {readable_pvs.map((pv, i) => (
                <Typography key={i}>{JSON.stringify(pv)}</Typography>
              ))}
            </Paper>
          )}
        </Accordion>

        <Button
          variant="contained"
          onClick={() => {
            const {
              metadata,
              trigger_output_ports,
              trigger_pulse_width,
              trigger_output_delay,
              trigger_output_num_repeats,
              trigger_type,
              trigger_repeat,
              configure_sampleEnv_triggers,
              pv_id,
              pv_name,
              pv_datatype,
              enable_pvs,
              pv_min_threshold,
              pv_max_threshold,
              pv_ensure_in_range,
              pv_compute_snr,
              pv_snr_min_threshold,
              ...rest
            } = InterPandaTriggerPlan;

            const params: any = {
                ...rest,
                metadata: {
                  user_comments: metadata,
                },
              };

            params.triggers = triggers;
             if (enable_pvs) {
              params.readable_pvs = Object.fromEntries(
                readable_pvs.map(pv => [
                  pv[0],
                  {
                    pv_name: pv[1],
                    pv_datatype: pv[2],
                    pv_min_threshold : pv[3],
                    pv_max_threshold: pv[4],
                    pv_ensure_in_range: pv[5],
                    pv_compute_snr: pv[6],
                    pv_snr_min_threshold: pv[7],

                  },
                ])
              );
            }

            const toPost = {
              name: "seq_table_two_panda_scan",
              params,
              instrument_session: props.session,
            };

            props.notifyOfPlan(toPost);
            props.mutation.mutate(toPost);
          }}
        >
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
