/**
 * usePlantingReportQueries Hook
 * Tanstack Query hooks for all planting report operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import plantingReportService from '../../../Services/plantingReportService';

// Query Keys
export const queryKeys = {
	all: ['planting-reports'],
	lists: () => [...queryKeys.all, 'list'],
	list: (filters) => [...queryKeys.lists(), filters],
	deleted: () => [...queryKeys.all, 'deleted'],
	deletedList: (filters) => [...queryKeys.deleted(), filters],
	detail: (id) => [...queryKeys.all, 'detail', id],
	statistics: () => [...queryKeys.all, 'statistics'],
	summary: () => [...queryKeys.all, 'summary'],
	varieties: ['varieties'],
	varietyDetail: (id) => [...queryKeys.varieties, 'detail', id],
	varietyReports: (id) => [...queryKeys.varieties, 'reports', id],
	seasons: ['seasons'],
	seasonDetail: (id) => [...queryKeys.seasons, 'detail', id],
	seasonReports: (id) => [...queryKeys.seasons, 'reports', id]
};

// ===========================
// QUERIES
// ===========================

export function useAllReports({ page, limit, state, isArchived, distributionLinked, search, sortBy, sortOrder, ...filters }) {
	const { dateRange, ...restFilters } = filters || {};
	const dateFrom = dateRange?.start ? new Date(dateRange.start).toISOString() : undefined;
	const dateTo = dateRange?.end ? new Date(dateRange.end).toISOString() : undefined;

	const queryParams = {
		page,
		limit,
		state,
		isArchived,
		distributionLinked,
		search,
		sortBy,
		sortOrder,
		...restFilters,
		...(dateFrom && { dateFrom }),
		...(dateTo && { dateTo })
	};

	return useQuery({
		queryKey: queryKeys.list(queryParams),
		queryFn: () => plantingReportService.getAllReports(queryParams),
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		placeholderData: (previousData) => previousData
	});
}

export function useDeletedReports({ page, limit, search, sortBy, sortOrder, ...filters }) {
	const { dateRange, ...restFilters } = filters || {};
	const dateFrom = dateRange?.start ? new Date(dateRange.start).toISOString() : undefined;
	const dateTo = dateRange?.end ? new Date(dateRange.end).toISOString() : undefined;
	const queryParams = {
		page,
		limit,
		search,
		sortBy,
		sortOrder,
		...restFilters,
		...(dateFrom && { dateFrom }),
		...(dateTo && { dateTo })
	};

	return useQuery({
		queryKey: queryKeys.deletedList(queryParams),
		queryFn: () => plantingReportService.getDeletedReports(queryParams),
		staleTime: 1 * 60 * 1000,
		placeholderData: (previousData) => previousData
	});
}

export function useReportById(id, options = {}) {
	return useQuery({
		queryKey: queryKeys.detail(id),
		queryFn: () => plantingReportService.getReportById(id),
		enabled: !!id,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

export function useStatistics() {
	return useQuery({
		queryKey: queryKeys.statistics(),
		queryFn: () => plantingReportService.getStatistics(),
		staleTime: 3 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000
	});
}

export function useReportSummary() {
	return useQuery({
		queryKey: queryKeys.summary(),
		queryFn: () => plantingReportService.getReportSummary(),
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000
	});
}

// ===========================
// MUTATIONS
// ===========================

export function useCreateReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => plantingReportService.createReport(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			// Invalidate distribution queries for reports created from distribution
			queryClient.invalidateQueries({ queryKey: ['distributionRequests'] });
			queryClient.invalidateQueries({ queryKey: ['distributionStacks'] });
			toast.success('Report created successfully');
			return data;
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to create report');
		}
	});
}

export function useUpdateReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => plantingReportService.updateReport(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report updated successfully');
			return data;
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to update report');
		}
	});
}

export function useDeleteReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.deleteReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.deleted() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report deleted successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to delete report');
		}
	});
}

export function useRestoreReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.restoreReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.deleted() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report restored successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to restore report');
		}
	});
}

export function useTransitionToPlanted() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => plantingReportService.transitionToPlanted(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report transitioned to Planted state');
			return data;
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to transition report');
		}
	});
}

export function useTransitionToCompleted() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => plantingReportService.transitionToCompleted(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report transitioned to Completed state');
			return data;
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to transition report');
		}
	});
}

export function useArchiveReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.archiveReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report archived successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to archive report');
		}
	});
}

export function useUnarchiveReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.unarchiveReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report unarchived successfully');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to unarchive report');
		}
	});
}

export function useBulkArchive() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids) => plantingReportService.bulkArchive(ids),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success(`${data.count} reports archived successfully`);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to archive reports');
		}
	});
}

export function useBulkDelete() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids) => plantingReportService.bulkDelete(ids),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.deleted() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success(`${data.count} reports deleted successfully`);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to delete reports');
		}
	});
}

export function usePermanentDeleteReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => plantingReportService.deleteReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.deleted() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success('Report permanently deleted');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to permanently delete report');
		}
	});
}

export function useBulkRestore() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (ids) => {
			await Promise.all(ids.map((id) => plantingReportService.restoreReport(id)));
			return { count: ids.length };
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.deleted() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success(`${data.count} reports restored successfully`);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to restore reports');
		}
	});
}

export function useBulkPermanentDelete() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (ids) => {
			await Promise.all(ids.map((id) => plantingReportService.deleteReport(id)));
			return { count: ids.length };
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: queryKeys.deleted() });
			queryClient.invalidateQueries({ queryKey: queryKeys.statistics() });
			queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
			toast.success(`${data.count} reports permanently deleted`);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Failed to permanently delete reports');
		}
	});
}

export default {
	useAllReports,
	useDeletedReports,
	useReportById,
	useStatistics,
	useReportSummary,
	useCreateReport,
	useUpdateReport,
	useDeleteReport,
	useRestoreReport,
	useTransitionToPlanted,
	useTransitionToCompleted,
	useArchiveReport,
	useUnarchiveReport,
	useBulkArchive,
	useBulkDelete,
	usePermanentDeleteReport,
	useBulkRestore,
	useBulkPermanentDelete,
	queryKeys
};
