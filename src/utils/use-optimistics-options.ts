import { QueryKey, useQueryClient } from "react-query";
import { Task } from "types/task";
import { reorder } from "./reorder";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate: async (target: any) => {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return previousItems;
    },
    onError: (error: any, newItem: any, context: any) => {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    return (
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
    );
  });

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    return old?.filter((item) => item.id !== target.id) || [];
  });

export const useAddConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target, old) => {
    return old ? [...old, target] : [];
  });
};

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
