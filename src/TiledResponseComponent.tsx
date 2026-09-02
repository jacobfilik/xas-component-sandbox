import {
  Card,
  CardContent,
  Typography,
  Divider,
  CardActionArea,
} from "@mui/material";
import type { DataInfo, TiledData } from "./models";

export default function TiledResponseComponent(props: {
  BlueapiItem?: TiledData;
  setDataInfo: (dataInfo: DataInfo) => void;
}) {
  console.log(props.BlueapiItem);
  const data = props.BlueapiItem;
  if (!data) return <div>Loading...</div>;
  if (!data.attributes) return <div>No attributes</div>;
  if (!data.attributes.metadata) return <div>No metadata</div>;

  const attrs = data.attributes;
  const metadata = attrs.metadata;
  return (
    <Card sx={{ overflow: "visible", mb: 2, p: 2 }}>
      <CardContent>
        {/* Basic Info */}
        <Typography>ID: {data.id}</Typography>
        <Typography>UID: {metadata.uid}</Typography>
        <Typography>Time: {metadata.time}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* Data Keys */}
        <Typography variant="h6">Data Keys</Typography>
        {Object.entries(metadata.data_keys || {}).map(([key, dk]) => (
          <Card key={key} sx={{ mb: 1, p: 1 }}>
            <CardActionArea
              onClick={() => {
                props.setDataInfo({
                  datasetName: key,
                  datasetContainerName: data.id,
                  internal: dk.external ? false : true,
                });
              }}
            >
              <CardContent>
                <Typography>
                  <b>{key}</b>
                </Typography>
                <Typography>Source: {dk.source}</Typography>
                {dk.units && <Typography>Units: {dk.units}</Typography>}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
