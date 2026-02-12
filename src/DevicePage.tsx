import { useQuery } from "@tanstack/react-query";
import { getDevices } from "./queryfunctions";
import { Box, Stack, Typography } from "@mui/material";
import DeviceComponent from "./DeviceComponent";

export default function DevicePage() {
  const query = useQuery({
    queryKey: ["blueapi", "devices"],
    queryFn: getDevices,
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
        <Typography variant="h4">Devices</Typography>
        {query.data.devices.map((d, i) => (
          <DeviceComponent key={i} device={d} />
        ))}
      </Stack>
    );
  }
}
