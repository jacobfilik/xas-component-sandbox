import { Card, CardContent, Typography } from "@mui/material";
import type { Device } from "./models";

export default function DeviceComponent(props: { device: Device }) {
  const protocols: string = props.device.protocols
    .reduce<string>((ac, cu) => {
      return ac + ", " + cu.name;
    }, "")
    .slice(1);

  return (
    <Card sx={{ overflow: "visible" }}>
      <CardContent>
        <Typography>{props.device.name}</Typography>
        <Typography>{protocols}</Typography>
      </CardContent>
    </Card>
  );
}
