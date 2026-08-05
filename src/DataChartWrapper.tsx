import { useQuery } from "@tanstack/react-query";
import { DataChart } from "./DataChart";
import { getData } from "./queryfunctions";
import type { DataInfo, TiledEntryInfo } from "./models";

export default function DataChartWrapper(props: {
  id: TiledEntryInfo;
  dataInfo: DataInfo;
}) {
  const query = useQuery<number[], Error>({
    queryKey: [
      "array/full",
      props.id.id,
      props.dataInfo.datasetContainerName,
      props.dataInfo.datasetName,
      props.dataInfo.internal,
    ],
    queryFn: () => getData(props.id.id, props.dataInfo.datasetName, props.dataInfo.datasetContainerName, props.dataInfo.internal),
    refetchInterval: props.id.running ? 2000 : false,
  });
  return <DataChart data={query.data ? query.data : null}></DataChart>;
}
