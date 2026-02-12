import { useQuery } from "@tanstack/react-query";
import { Box, Stack, Typography } from "@mui/material";
import { getPlans } from "./queryfunctions";
import PlanComponent from "./PlanComponent";

export default function PlanPage() {
  const query = useQuery({
    queryKey: ["blueapi", "plans"],
    queryFn: getPlans,
  });

  if (!query.data) {
    return (
      <Box height="100%" bgcolor="red">
        <Typography>No Plans</Typography>
      </Box>
    );
  } else {
    return (
      <Stack
        height="100%"
        padding={"50px"}
        spacing={"10px"}
        overflow={"auto"}
        flex={1}
      >
        <Typography variant="h4">Plans</Typography>
        {query.data.plans.map((p, i) => (
          <PlanComponent key={i} plan={p} />
        ))}
      </Stack>
    );
  }
}
