import { useQuery } from "@tanstack/react-query";
import { DataChart } from "./DataChart";
import { getData } from "./queryfunctions";
import type { DataInfo, TiledEntryInfo } from "./models";

export default function DataChartWrapper(props: {
  beamline: string;
  visit: string;
  id: TiledEntryInfo;
  dataInfo: DataInfo;
}) {
  const query = useQuery<number[], Error>({
    queryKey: [
      "array/full",
      props.beamline,
      props.visit,
      props.id.id,
      props.dataInfo.datasetContainerName,
      props.dataInfo.datasetName,
      props.dataInfo.internal,
    ],
    queryFn: () =>
      getData(
        props.beamline,
        props.visit,
        props.id.id,
        props.dataInfo.datasetName,
        props.dataInfo.datasetContainerName,
        props.dataInfo.internal,
      ),
    refetchInterval: props.id.running ? 2000 : false,
  });

  console.log(`${props.beamline} ${props.visit} ${props.dataInfo.datasetName}`);
  return <DataChart data={query.data ? query.data : null}></DataChart>;
}
