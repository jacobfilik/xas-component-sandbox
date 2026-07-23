import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMetadata } from "./queryfunctions";
import type { TiledResponse } from "./models";
import TiledResponseComponent from "./TiledResponseComponent";

export default function ListenTiledPanel(props: {
  taskID: string;
  setDataName: (name: string) => void;
}) {
  const query = useQuery<TiledResponse, Error>({
    queryKey: ["taskId", props.taskID],
    queryFn: () => getMetadata(props.taskID),
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
  return (
    <TiledResponseComponent
      BlueapiItem={query.data as TiledResponse}
      setDataName={props.setDataName}
    />
  );
}
