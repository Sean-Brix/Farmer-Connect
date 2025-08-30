import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch crops for a user, optionally including reports
export function useMyCrops(userId, { includeReports = true } = {}) {
  const enabled = !!userId;
  return useQuery({
    queryKey: ['seed-track', 'my-crops', { userId, includeReports }],
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('userId', String(userId));
      if (includeReports) params.set('includeReports', 'true');
      const res = await fetch(`/api/seed-track/crops?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch crops: ${res.status}`);
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    },
    staleTime: 60 * 1000,
  });
}

export function useCreateCrop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/seed-track/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create crop failed: ${res.status}`);
      const json = await res.json();
      return json.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate this user's crops
      if (variables?.userId) {
        qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops', { userId: variables.userId, includeReports: true }] });
        qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops'] });
      }
    },
  });
}

export function useUpdateCrop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data, userId }) => {
      const res = await fetch(`/api/seed-track/crops/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Update crop failed: ${res.status}`);
      const json = await res.json();
      return { ...json.data, userId };
    },
    onSuccess: (data) => {
      if (data?.userId) {
        qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops'] });
      }
    },
  });
}

export function useDeleteCrop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const res = await fetch(`/api/seed-track/crops/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete crop failed: ${res.status}`);
      return { id, userId };
    },
    onSuccess: ({ userId }) => {
      if (userId) qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops'] });
    },
  });
}

export function useCreateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/seed-track/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create report failed: ${res.status}`);
      const json = await res.json();
      return json.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate user's crops to refresh reports
      if (variables?.userId) qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops'] });
    },
  });
}

export function useUpdateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data, userId }) => {
      const res = await fetch(`/api/seed-track/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Update report failed: ${res.status}`);
      const json = await res.json();
      return { ...json.data, userId };
    },
    onSuccess: (data) => {
      if (data?.userId) qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops'] });
    },
  });
}

export function useDeleteReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const res = await fetch(`/api/seed-track/reports/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete report failed: ${res.status}`);
      return { id, userId };
    },
    onSuccess: ({ userId }) => {
      if (userId) qc.invalidateQueries({ queryKey: ['seed-track', 'my-crops'] });
    },
  });
}

export default {
  useMyCrops,
  useCreateCrop,
  useUpdateCrop,
  useDeleteCrop,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
};
