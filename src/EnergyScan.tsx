import type { UseMutationResult } from "@tanstack/react-query";
import { Button, Paper, Stack, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

type ReadablePV = [string, string, string, number, number, boolean, boolean, number];
interface EnergyScanPlan {
  element: string,
  edge: string,
  time_per_sweep:number,
  variable_exafs_time:boolean,
  number_of_sweeps:number,
  metadata: string,
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
  element: "element",
  edge: "edge",
  time_per_sweep:"time_per_sweep",
  variable_exafs_time:"variable_exafs_time",
  number_of_sweeps:"number_of_sweeps",
  metadata: "Optional metadata",
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


export default function EnergyScanPlanPanel(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, Error, object, unknown>;
  session: string;
  notifyOfPlan: (plan: object) => void;
}) {
  const [EnergyScanPlan, setEnergyScanPlan] = useState<EnergyScanPlan>({
    element:"Ar",
    edge:"K",
    time_per_sweep:8,
    variable_exafs_time:false,
    number_of_sweeps:1,
    metadata:"",
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
  const handleChange = (key: keyof EnergyScanPlan, value: any) => {
    setEnergyScanPlan(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Paper elevation={5}>
      <Stack height="100%" padding={"10px"} spacing={"20px"} overflow={"auto"}>
        <Typography>Energy Grid Scan</Typography>
        <Stack direction="column" spacing={"10px"}>
          {[
            "element",
            "edge",
            "time_per_sweep",
            "variable_exafs_time",
            "number_of_sweeps",
            "metadata",
          ]
          .map((key) => {
            const value = (EnergyScanPlan as any)[key]; // ✅ get value from plan
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
          
        </Stack>
        
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
                    checked={EnergyScanPlan.enable_pvs}
                    onChange={(e) => handleChange("enable_pvs", e.target.checked)}
                  />
                }
                label="Enable PVs"
              />

              {EnergyScanPlan.enable_pvs && (
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
                    const value = (EnergyScanPlan as any)[key]; // ✅ get value from plan
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
                        [EnergyScanPlan.pv_id, EnergyScanPlan.pv_name, EnergyScanPlan.pv_datatype, EnergyScanPlan.pv_min_threshold, EnergyScanPlan.pv_max_threshold, EnergyScanPlan.pv_ensure_in_range, EnergyScanPlan.pv_compute_snr, EnergyScanPlan.pv_snr_min_threshold],
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
            } = EnergyScanPlan;

            const params: any = {
                ...rest,
                metadata: {
                  user_comments: metadata,
                },
            };
            
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
              name: "seq_table_energy_scan",
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
