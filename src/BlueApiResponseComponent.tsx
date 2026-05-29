import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import type { BlueapiResponse } from "./models";

function getStatus(task: BlueapiResponse): string {
  return task.data.attributes.metadata.stop?.exit_status || "unknown";
}

export default function BlueapiResponseComponent(props: { BlueapiItem: BlueapiResponse }) {
  const { data } = props.BlueapiItem;
  const attrs = data.attributes;
  const start = attrs.metadata.start;
  const stop = attrs.metadata.stop;
  const plan = start.plan_args;

  return (
    <Card sx={{ overflow: "visible", mb: 2 }}>
      <CardContent>
        {/* ---- Header ---- */}
        <Typography variant="h6" gutterBottom>
          Scan #{start.scan_id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          UID: {data.id}
        </Typography>
        <Typography>Status: {getStatus(props.BlueapiItem)}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* ---- Basic Info ---- */}
        <Typography variant="subtitle1">Basic Info</Typography>
        <Box ml={1}>
          <Typography>User: {start.user}</Typography>
          <Typography>Instrument: {start.instrument}</Typography>
          <Typography>Plan: {start.plan_name}</Typography>
          <Typography>Type: {start.plan_type}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ---- Timing ---- */}
        <Typography variant="subtitle1">Timing</Typography>
        <Box ml={1}>
          <Typography>Start: {start.time}</Typography>
          <Typography>Stop: {stop?.time}</Typography>
          <Typography>
            Duration:{" "}
            {stop && start
              ? (stop.time - start.time).toFixed(2) + " s"
              : "-"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ---- Scan Parameters ---- */}
        <Typography variant="subtitle1">Scan Parameters</Typography>
        <Box ml={1}>
          <Typography>Element: {plan.element}</Typography>
          <Typography>Edge: {plan.edge}</Typography>
          <Typography>
            Detector: {plan.detectors?.join(", ")}
          </Typography>
          <Typography>
            Sweeps: {plan.number_of_sweeps}
          </Typography>
          <Typography>
            Time per Sweep: {plan.time_per_sweep}
          </Typography>
          <Typography>Spec: {plan.spec}</Typography>
          <Typography>Angle: {plan.grid}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ---- Data Info ---- */}
        <Typography variant="subtitle1">Data</Typography>
        <Box ml={1}>
          <Typography>
            Events: {stop?.num_events?.primary}
          </Typography>
          <Typography>
            Data Path: {start.data_session_directory}
          </Typography>
          <Typography>
            File Template: {start.detector_file_template}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}