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
    staleTime: 0, // Always refetch on invalidation
    refetchOnMount: 'always',
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
    staleTime: 0, // Always refetch on invalidation
    refetchOnMount: 'always',
  });
}

// Combine accounts + crops->reports into Admin UI-friendly shapes
export function useAdminSeedTrack() {
  const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { data: crops = [], isLoading: cropsLoading, error: cropsError } = useCropsWithReports();

  const { farmers, reports, cropsByUser } = useMemo(() => {
    // Build a quick index of crops by userId and flattened reports
    const cropsByUser = new Map();
    const flatReports = [];

    for (const crop of crops) {
      if (!cropsByUser.has(crop.userId)) cropsByUser.set(crop.userId, []);
      cropsByUser.get(crop.userId).push(crop);

      const cropReports = Array.isArray(crop.reports) ? crop.reports : [];
      for (const r of cropReports) {
        // JSON fields (costs and weatherSnapshot) are already parsed by the backend
        flatReports.push({
          // Map all fields from the farmer's submitted report
          id: r.id,
          farmerId: crop.userId,
          cropId: crop.id,
          crop: crop.cropType,
          variety: crop.variety,
          plantingDate: crop.plantingDate,
          expectedHarvest: crop.expectedHarvest,
          area: crop.area,
          
          // Report details - all fields the farmer fills
          reportDate: r.reportDate,
          growthStage: r.growthStage,
          plantHeight: r.plantHeight,
          healthStatus: r.healthStatus || 'Healthy',
          estimatedYield: r.estimatedYield,
          actualYield: r.actualYield,
          soilCondition: r.soilCondition,
          
          // Pest & Disease Management
          pestsObserved: r.pestsObserved,
          diseasesObserved: r.diseasesObserved,
          pestsAndDiseases: r.pestsObserved, // Legacy compatibility
          
          // Farm Management Activities
          fertilizersApplied: r.fertilizersApplied,
          pesticideApplications: r.pesticideApplications,
          irrigationFrequency: r.irrigationFrequency,
          majorActivities: r.majorActivities,
          
          // Planning & Challenges
          challenges: r.challenges,
          plannedActions: r.plannedActions,
          
          // Weather & Environment
          weatherImpact: r.weatherImpact,
          weatherSnapshot: r.weatherSnapshot, // Already parsed object with temp, humidity, etc.
          
          // Financial Data
          costs: r.costs, // Already parsed object with seeds, fertilizer, pesticides, labor, etc.
          
          // Additional Notes
          notes: r.notes,
          
          // Timestamps
          submissionDate: r.submissionDate || r.createdAt,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
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

    return { farmers, reports: flatReports, cropsByUser };
  }, [accounts, crops]);

  return {
    farmers,
    reports,
    cropsByUser,
    isLoading: accountsLoading || cropsLoading,
    error: accountsError || cropsError,
  };
}

export default useAdminSeedTrack;
