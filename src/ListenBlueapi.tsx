import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMetadata } from "./queryfunctions";
import type { BlueapiResponse } from "./models";
import BlueapiResponseComponent from "./BlueApiResponseComponent";

export default function ListenBlueapiPanel(props: { taskID: string, authToken: string}) {
  const query = useQuery<BlueapiResponse, Error>({
    queryKey: ["taskId", "authToken", props.taskID, props.authToken],
    queryFn: () => getMetadata(props.taskID, props.authToken),
    enabled: !!props.taskID, // prevents running with empty ID
  });

  if (query.isLoading) {
    return <Box>Loading Blueapi events...</Box>;
  }

  if (query.isError) {
    return <Box>Error: {query.error.message}</Box>;
  }

  if (!query.data) {
    return <Box>No data available</Box>;
  }
  return <BlueapiResponseComponent BlueapiItem={query.data as BlueapiResponse} />;

}

