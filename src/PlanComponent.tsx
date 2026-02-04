import { Card, CardContent, Typography } from "@mui/material";
import type { Plan } from "./models";

export default function PlanComponent(props: { plan: Plan }) {
  return (
    <Card sx={{ overflow: "visible" }}>
      <CardContent>
        <Typography>{props.plan.name}</Typography>
        <Typography>{props.plan.description}</Typography>
      </CardContent>
    </Card>
  );
}
