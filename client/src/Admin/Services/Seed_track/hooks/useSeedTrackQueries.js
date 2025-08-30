import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// Fetch all user accounts for admin directory (limit to regular users if needed)
function useAccounts() {
  return useQuery({
    queryKey: ['admin-accounts', { roles: 'User' }],
    queryFn: async () => {
      const res = await fetch('/api/account/all?roles=User');
      if (!res.ok) throw new Error(`Accounts error: ${res.status}`);
      const json = await res.json();
      // API returns { list: accounts }
      return json.list || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch all crops with reports included
function useCropsWithReports() {
  return useQuery({
    queryKey: ['seed-track-crops', { includeReports: true }],
    queryFn: async () => {
      const res = await fetch('/api/seed-track/crops?includeReports=true');
      if (!res.ok) throw new Error(`Crops error: ${res.status}`);
      const json = await res.json();
      // API returns { success, data }
      return Array.isArray(json.data) ? json.data : [];
    },
    staleTime: 60 * 1000,
  });
}

// Combine accounts + crops->reports into Admin UI-friendly shapes
export function useAdminSeedTrack() {
  const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { data: crops = [], isLoading: cropsLoading, error: cropsError } = useCropsWithReports();

  const { farmers, reports } = useMemo(() => {
    // Build a quick index of crops by userId and flattened reports
    const cropsByUser = new Map();
    const flatReports = [];

    for (const crop of crops) {
      if (!cropsByUser.has(crop.userId)) cropsByUser.set(crop.userId, []);
      cropsByUser.get(crop.userId).push(crop);

      const cropReports = Array.isArray(crop.reports) ? crop.reports : [];
      for (const r of cropReports) {
        flatReports.push({
          // Map to Admin sampleSeedTrackingData shape
          id: r.id,
          farmerId: crop.userId,
          crop: crop.cropType,
          variety: crop.variety,
          plantingDate: crop.plantingDate,
          expectedHarvest: crop.expectedHarvest,
          area: crop.area,
          reportDate: r.reportDate,
          growthStage: r.growthStage,
          plantHeight: r.plantHeight,
          healthStatus: r.healthStatus || 'Healthy',
          estimatedYield: r.estimatedYield,
          pestsAndDiseases: r.pestsObserved,
          weatherImpact: r.weatherImpact,
          notes: r.notes,
        });
      }
    }

    // Build farmers directory rows
    const farmers = accounts.map((acc) => {
      const userCrops = cropsByUser.get(acc.id) || [];
      const cropTypes = Array.from(new Set(userCrops.map((c) => c.cropType)));
      const totalReports = userCrops.reduce((sum, c) => sum + (Array.isArray(c.reports) ? c.reports.length : 0), 0);
      const fullName = [acc.firstName, acc.surname].filter(Boolean).join(' ').trim() || acc.username || `User ${acc.id}`;
      return {
        id: acc.id,
        farmerId: acc.id,
        name: fullName,
        email: acc.email || '',
        phone: '',
        location: acc.client_profile || '—',
        joinDate: '',
        cropTypes,
        totalReports,
        status: userCrops.length > 0 ? 'Active' : 'Inactive',
      };
    });

    return { farmers, reports: flatReports };
  }, [accounts, crops]);

  return {
    farmers,
    reports,
    isLoading: accountsLoading || cropsLoading,
    error: accountsError || cropsError,
  };
}

export default useAdminSeedTrack;
