import { Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMetadata } from "./queryfunctions";
import type { DataInfo, TiledResponse } from "./models";
import TiledResponseComponent from "./TiledResponseComponent";

export default function TiledContainerPanel(props: {
  taskID: string;
  setDataInfo: (name: DataInfo) => void;
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
    <Stack>
      {query.data.data.map((item, index) => {
        return (
          <TiledResponseComponent
            key={index}
            BlueapiItem={item}
            setDataInfo={props.setDataInfo}
          />
        );
      })}
    </Stack>
  );
}

// function ListenTiledPanel(props: {
//   taskID: string;
//   dataContainerName: string;
//   setDataName: (name: string) => void;
// }) {
//   const query = useQuery<TiledResponse, Error>({
//     queryKey: ["taskId", props.taskID],
//     queryFn: () => getMetadata(props.taskID),
//     enabled: !!props.taskID, // prevents running with empty ID
//   });

//   if (query.isLoading) {
//     return <Box>Loading Blueapi events...</Box>;
//   }

//   if (query.isError) {
//     return <Box>Error: {query.error.message}</Box>;
//   }

//   if (!query.data) {
//     return <Box>No data available</Box>;
//   }
//   return (
//     <TiledResponseComponent
//       BlueapiItem={query.data as TiledResponse}
//       setDataName={props.setDataName}
//     />
//   );
// }
