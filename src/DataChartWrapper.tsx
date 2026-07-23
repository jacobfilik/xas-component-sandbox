import { useQuery } from "@tanstack/react-query";
import { DataChart } from "./DataChart";
import { getData } from "./queryfunctions";

export default function DataChartWrapper(props: {
  id: string;
  dataName: string;
}) {
  const query = useQuery<number[], Error>({
    queryKey: ["array/full", props.id, props.dataName],
    queryFn: () => getData(props.id, props.dataName),
  });
  return <DataChart data={query.data ? query.data : null}></DataChart>;
}
