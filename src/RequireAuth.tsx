import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Box, Typography } from "@mui/material";

export default function RequireAuth(props: { children: React.ReactNode }) {
  const user_result = useContext(UserContext);

  if (user_result.person_status == "PENDING" && user_result.person == null) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (user_result.person == null) {
    return (
      <Box>
        <Typography>UNAUTHORIZED</Typography>
      </Box>
    );
  }

  return props.children;
}
