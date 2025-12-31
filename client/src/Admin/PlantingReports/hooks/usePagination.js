/**
 * usePagination Hook
 * Client-side pagination state management
 */

import { useCallback, useState } from 'react';
import { PAGINATION_CONFIG } from '../constants/plantingReportConstants';

export function usePagination(initialPage = 1, initialLimit = PAGINATION_CONFIG.defaultPageSize) {
	const [page, setPage] = useState(initialPage);
	const [limit, setLimit] = useState(initialLimit);

	const goToPage = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	const nextPage = useCallback(() => {
		setPage((prev) => prev + 1);
	}, []);

	const previousPage = useCallback(() => {
		setPage((prev) => Math.max(1, prev - 1));
	}, []);

	const changeLimit = useCallback((newLimit) => {
		setLimit(newLimit);
		setPage(1);
	}, []);

	const reset = useCallback(() => {
		setPage(1);
	}, []);

	const getPaginationInfo = useCallback(
		(serverPagination, fallbackTotal = 0) => {
			const requestedPage = Math.max(1, Number(serverPagination?.page ?? page) || 1);
			const pageSize = Math.max(1, Number(serverPagination?.limit ?? limit) || PAGINATION_CONFIG.defaultPageSize);
			const totalItems = Number(
				serverPagination?.totalItems ?? serverPagination?.total ?? serverPagination?.totalRecords ?? fallbackTotal ?? 0
			);
			const totalPagesSource = serverPagination?.totalPages ?? Math.ceil(totalItems / pageSize);
			const totalPages = Math.max(1, Number(totalPagesSource || 1));
			const currentPage = Math.min(requestedPage, totalPages);
			const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
			const endItem = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);
			const hasNextPage =
				serverPagination?.hasNext !== undefined ? serverPagination.hasNext : currentPage < totalPages;
			const hasPreviousPage =
				serverPagination?.hasPrev !== undefined ? serverPagination.hasPrev : currentPage > 1;

			return {
				currentPage,
				pageSize,
				totalPages,
				totalItems,
				startItem,
				endItem,
				hasNextPage,
				hasPreviousPage
			};
		},
		[limit, page]
	);

	return {
		page,
		limit,
		goToPage,
		nextPage,
		previousPage,
		changeLimit,
		reset,
		getPaginationInfo
	};
}

export default usePagination;
