/**
 * useReferenceData Hook
 * Tanstack Query hooks for varieties and seasons
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import plantingReportService from '../../../Services/plantingReportService';
import { queryKeys } from './usePlantingReportQueries';

export function useVarieties() {
	return useQuery({
		queryKey: queryKeys.varieties,
		queryFn: async () => {
			const response = await plantingReportService.getAllVarieties();
			// Extract varieties array from response
			return response.varieties || response.data || response;
		},
		staleTime: 5 * 60 * 1000
	});
}

export function useActiveVarieties() {
	return useQuery({
		queryKey: [...queryKeys.varieties, 'active'],
		queryFn: async () => {
			const response = await plantingReportService.getActiveVarieties();
			// Extract varieties array from response
			return response.varieties || response.data || response;
		},
		staleTime: 5 * 60 * 1000
	});
}

export function useVarietyById(id, options = {}) {
	return useQuery({
		queryKey: queryKeys.varietyDetail(id),
		queryFn: () => plantingReportService.getVarietyById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		...options
	});
}

export function useReportsByVariety(varietyId, options = {}) {
	return useQuery({
		queryKey: queryKeys.varietyReports(varietyId),
		queryFn: () => plantingReportService.getReportsByVariety(varietyId),
		enabled: !!varietyId,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

export function useCreateVariety() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => plantingReportService.createVariety(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.varieties });
			toast.success('Variety created successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to create variety');
		}
	});
}

export function useUpdateVariety() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => plantingReportService.updateVariety(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.varieties });
			queryClient.invalidateQueries({ queryKey: queryKeys.varietyDetail(variables.id) });
			toast.success('Variety updated successfully');
			return data;
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to update variety');
		}
	});
}

export function useDeleteVariety() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.deleteVariety(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.varieties });
			toast.success('Variety deleted successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to delete variety');
		}
	});
}

export function useSeasons() {
	return useQuery({
		queryKey: queryKeys.seasons,
		queryFn: async () => {
			const response = await plantingReportService.getAllSeasons();
			// Extract seasons array from response
			return response.seasons || response.data || response;
		},
		staleTime: 5 * 60 * 1000
	});
}

export function useActiveSeasons() {
	return useQuery({
		queryKey: [...queryKeys.seasons, 'active'],
		queryFn: async () => {
			const response = await plantingReportService.getActiveSeasons();
			// Extract seasons array from response
			return response.seasons || response.data || response;
		},
		staleTime: 5 * 60 * 1000
	});
}

export function useSeasonById(id, options = {}) {
	return useQuery({
		queryKey: queryKeys.seasonDetail(id),
		queryFn: () => plantingReportService.getSeasonById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		...options
	});
}

export function useReportsBySeason(seasonId, options = {}) {
	return useQuery({
		queryKey: queryKeys.seasonReports(seasonId),
		queryFn: () => plantingReportService.getReportsBySeason(seasonId),
		enabled: !!seasonId,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

export function useCreateSeason() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => plantingReportService.createSeason(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.seasons });
			toast.success('Season created successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to create season');
		}
	});
}

export function useUpdateSeason() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => plantingReportService.updateSeason(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.seasons });
			queryClient.invalidateQueries({ queryKey: queryKeys.seasonDetail(variables.id) });
			toast.success('Season updated successfully');
			return data;
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to update season');
		}
	});
}

export function useDeleteSeason() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.deleteSeason(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.seasons });
			toast.success('Season deleted successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to delete season');
		}
	});
}

export default {
	useVarieties,
	useActiveVarieties,
	useVarietyById,
	useReportsByVariety,
	useCreateVariety,
	useUpdateVariety,
	useDeleteVariety,
	useSeasons,
	useActiveSeasons,
	useSeasonById,
	useReportsBySeason,
	useCreateSeason,
	useUpdateSeason,
	useDeleteSeason
};
