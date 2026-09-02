import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import type { TiledEntryInfo, TiledSearchData } from "./models";

export default function RunViewList(props: {
  data: TiledSearchData[];
  setId: (id: TiledEntryInfo) => void;
}) {
  return (
    <Stack spacing={"5px"} flex={1} overflow="auto">
      {props.data.map((td) => {
        return (
          <Card key={td.id} sx={{ overflow: "visible" }}>
            <CardActionArea
              onClick={() =>
                props.setId({
                  id: td.id,
                  running: td.attributes.metadata.stop == undefined,
                })
              }
            >
              <CardContent>
                <Typography>id: {td.id}</Typography>
                <Typography>
                  scan number: {td.attributes.metadata.start.scan_id}
                </Typography>
                <Typography>
                  plan name: {td.attributes.metadata.start.plan_name}
                </Typography>
                <Typography>
                  {new Date(
                    td.attributes.metadata.start.time * 1000
                  ).toISOString()}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
}
