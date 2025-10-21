import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch all crop guidelines
export const useCropGuidelines = (filters = {}) => {
  return useQuery({
    queryKey: ['cropGuidelines', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.includeInactive) params.append('includeInactive', 'true');

      const res = await fetch(`/api/seed-track/guidelines?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch guidelines: ${res.status}`);
      const data = await res.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch single crop guideline
export const useCropGuideline = (id) => {
  return useQuery({
    queryKey: ['cropGuideline', id],
    queryFn: async () => {
      const res = await fetch(`/api/seed-track/guidelines/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch guideline: ${res.status}`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!id,
  });
};

// Create crop guideline
export const useCreateCropGuideline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guidelineData) => {
      const res = await fetch('/api/seed-track/guidelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guidelineData),
      });
      if (!res.ok) throw new Error(`Failed to create guideline: ${res.status}`);
      const data = await res.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cropGuidelines'] });
    },
  });
};

// Update crop guideline
export const useUpdateCropGuideline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...guidelineData }) => {
      const res = await fetch(`/api/seed-track/guidelines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guidelineData),
      });
      if (!res.ok) throw new Error(`Failed to update guideline: ${res.status}`);
      const data = await res.json();
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cropGuidelines'] });
      queryClient.invalidateQueries({ queryKey: ['cropGuideline', variables.id] });
    },
  });
};

// Delete crop guideline
export const useDeleteCropGuideline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/seed-track/guidelines/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to delete guideline: ${res.status}`);
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cropGuidelines'] });
    },
  });
};
