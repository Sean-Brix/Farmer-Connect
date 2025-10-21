import { useQuery } from '@tanstack/react-query';

// Fetch all crop guidelines for client (farmers)
export const useCropGuidelines = (filters = {}) => {
  return useQuery({
    queryKey: ['clientCropGuidelines', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`/api/seed-track/guidelines?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch guidelines: ${res.status}`);
      const data = await res.json();
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - guidelines don't change often
  });
};

// Fetch single crop guideline
export const useCropGuideline = (id) => {
  return useQuery({
    queryKey: ['clientCropGuideline', id],
    queryFn: async () => {
      const res = await fetch(`/api/seed-track/guidelines/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch guideline: ${res.status}`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};
