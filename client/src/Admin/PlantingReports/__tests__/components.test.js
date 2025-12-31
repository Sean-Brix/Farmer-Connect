/**
 * Component Import Test
 * Verify all common components are importable
 */

import StateWorkflowIndicator from '../components/common/StateWorkflowIndicator';
import MobileReportCard from '../components/common/MobileReportCard';
import ResponsiveFormSection from '../components/common/ResponsiveFormSection';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
	TableLoadingSkeleton,
	CardLoadingSkeleton,
	FormLoadingSkeleton,
	StatisticsLoadingSkeleton
} from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorBoundary from '../components/common/ErrorBoundary';

console.log('All common components imported successfully', {
	StateWorkflowIndicator,
	MobileReportCard,
	ResponsiveFormSection,
	ConfirmDialog,
	TableLoadingSkeleton,
	CardLoadingSkeleton,
	FormLoadingSkeleton,
	StatisticsLoadingSkeleton,
	EmptyState,
	ErrorBoundary
});

export default {
	StateWorkflowIndicator,
	MobileReportCard,
	ResponsiveFormSection,
	ConfirmDialog,
	TableLoadingSkeleton,
	CardLoadingSkeleton,
	FormLoadingSkeleton,
	StatisticsLoadingSkeleton,
	EmptyState,
	ErrorBoundary
};
