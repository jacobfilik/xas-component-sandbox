import { useQuery } from "@tanstack/react-query";
import { DataChart } from "./DataChart";
import { getData } from "./queryfunctions";
import type { TiledEntryInfo } from "./models";

export default function DataChartWrapper(props: {
  id: TiledEntryInfo;
  dataName: string;
}) {
  const query = useQuery<number[], Error>({
    queryKey: ["array/full", props.id.id, props.dataName],
    queryFn: () => getData(props.id.id, props.dataName),
    refetchInterval: props.id.running ? 2000 : false,
  });
  return <DataChart data={query.data ? query.data : null}></DataChart>;
}
