import { useQuery } from "react-query";
import { Kanban } from "types/kanban";
import { useHttp } from "utils/http";

export const useKanban = (param?: Partial<Kanban>) => {
  const client = useHttp();
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};
