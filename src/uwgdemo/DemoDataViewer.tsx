import { Stack } from "@mui/material";
import { DataChartImage } from "./DataChartImage";
import { useQuery } from "@tanstack/react-query";
import type { DataInfo } from "../models";
import { getData } from "../queryfunctions";
import { DataChartSlice } from "./DataChartSlice";
import { reshapeSnake } from "../utils";
import type { TiledScanInfo } from "./DemoPage";

function arrayMin(arr: number[]) {
  return arr.reduce(function (p, v) {
    return p < v ? p : v;
  });
}

function arrayMax(arr: number[]) {
  return arr.reduce(function (p, v) {
    return p > v ? p : v;
  });
}

function InnerDemoDataViewer(props: {
  planRunning: boolean;
  beamline: string;
  visit: string;
  tiledScanInfo: TiledScanInfo;
  dataInfo: DataInfo;
}) {
  const query = useQuery<number[], Error>({
    queryKey: [
      "array/full",
      props.beamline,
      props.visit,
      props.tiledScanInfo.tiledID,
      props.dataInfo.datasetContainerName,
      props.dataInfo.datasetName,
      props.dataInfo.internal,
    ],
    queryFn: () =>
      getData(
        props.beamline,
        props.visit,
        props.tiledScanInfo.tiledID,
        props.dataInfo.datasetName,
        props.dataInfo.datasetContainerName,
        props.dataInfo.internal,
      ),
    refetchInterval: props.planRunning ? 2000 : false,
  });

  if (query.data == undefined) {
    return <DataView />;
  }

  console.log(`DATA RUNNING ${props.planRunning}`);

  const min = arrayMin(query.data);
  const max = arrayMax(query.data);

  const { start, stop, step } = props.tiledScanInfo;

  const numPointsRow = Math.floor(stop - start) / step + 1;

  const reshaped = reshapeSnake(query.data, numPointsRow);

  return (
    <Stack margin="10px" minHeight="10px" spacing="20px" flex height="95%">
      <Stack flex={2} minHeight="10px">
        <DataChartImage
          data={reshaped}
          xrange={[0, reshaped.shape[1]]}
          yrange={[0, reshaped.shape[0]]}
          crange={[min, max]}
        />
      </Stack>
      <Stack flex={1} minHeight="10px">
        <DataChartSlice data={reshaped} xrange={[0, reshaped.shape[1]]} />
      </Stack>
      {/* <DataChart data={Array.from({ length: 10 }, (_value,index) => index)}/> */}
    </Stack>
  );
}

function DataView() {
  return (
    <Stack margin="10px" minHeight="10px" spacing="20px" flex height="95%">
      <Stack flex={2} minHeight="10px">
        <DataChartImage
          data={null}
          xrange={[0, 1000]}
          yrange={[0, 100]}
          crange={[0, 1]}
        />
      </Stack>
      <Stack flex={1} minHeight="10px">
        <DataChartSlice data={null} xrange={[0, 1000]} />
      </Stack>
    </Stack>
  );
}

export default function DemoDataViewer(props: {
  planRunning: boolean;
  beamline: string;
  visit: string;
  tiledScanInfo: TiledScanInfo | null;
  dataInfo: DataInfo;
}) {
  if (props.tiledScanInfo === null) {
    return <DataView />;
  }

  return (
    <InnerDemoDataViewer
      planRunning={props.planRunning}
      beamline={props.beamline}
      visit={props.visit}
      tiledScanInfo={props.tiledScanInfo}
      dataInfo={props.dataInfo}
    />
  );
}
