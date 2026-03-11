import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetGenerations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["generations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGenerationRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveGeneration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      prompt,
      platform,
      imageUrl,
      width,
      height,
    }: {
      prompt: string;
      platform: string;
      imageUrl: string;
      width: number;
      height: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveGenerationRecord(
        prompt,
        platform,
        imageUrl,
        BigInt(width),
        BigInt(height),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}

export function useDeleteGeneration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGenerationRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}
