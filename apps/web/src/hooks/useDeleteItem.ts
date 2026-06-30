import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';

export function useDeleteItem(queryKey: string[], endpoint: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
