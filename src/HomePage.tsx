import { Stack, Typography } from "@mui/material";
import SwiftIcon from "./SwiftIcon";

export default function HomePage() {
  return (
    <Stack
      height={"100%"}
      width={"100%"}
      // alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <SwiftIcon fontSize="large" sx={{ height: "500px", width: "500px" }} />
      <Typography variant="h1"> K14 SWIFT</Typography>
    </Stack>
  );
}
