import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Generic Table Skeleton
export function TableSkeleton({ rows = 5, columns = 6 }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {[...Array(rows)].map((_, index) => (
        <div key={index} className={`px-6 py-4 border-b last:border-b-0 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
                {i === 0 && <div className={`h-3 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Card Grid Skeleton
export function CardGridSkeleton({ count = 6, columns = 3 }) {
  const { isDark } = useTheme();
  
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-6`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={`rounded-xl overflow-hidden shadow-lg border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Image */}
          <div className={`h-48 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
          
          {/* Content */}
          <div className="p-4 space-y-3">
            <div className={`h-5 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            <div className={`h-4 w-full rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            <div className={`h-4 w-5/6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            
            <div className="flex justify-between items-center pt-2">
              <div className={`h-6 w-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-8 w-16 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// List Skeleton (for requests, items, etc.)
export function ListSkeleton({ count = 5 }) {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className={`rounded-xl p-6 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-md`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className={`h-5 w-2/3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-4 w-full rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-4 w-4/5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className="flex gap-2 mt-3">
                <div className={`h-6 w-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
                <div className={`h-6 w-24 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className={`h-9 w-20 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-9 w-20 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Statistics Cards Skeleton
export function StatsSkeleton({ count = 4 }) {
  const { isDark } = useTheme();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className={`rounded-xl shadow-lg p-6 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className={`h-4 w-24 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-8 w-16 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className={`h-12 w-12 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Filter Bar Skeleton
export function FilterBarSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className={`h-10 w-64 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
      {[...Array(4)].map((_, index) => (
        <div key={index} className={`h-10 w-32 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        } animate-pulse`}></div>
      ))}
    </div>
  );
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className="mb-6">
      <div className={`h-8 w-64 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
      <div className={`h-4 w-96 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
    </div>
  );
}

// Inventory specific skeleton
export function InventoryTableSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1">
            <div className={`h-5 w-5 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-3">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-2">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-2">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-2">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-2">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
        </div>
      </div>
      
      {/* Rows */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className={`px-6 py-4 border-b last:border-b-0 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className={`h-5 w-5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-3 space-y-2">
              <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-3 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2">
              <div className={`h-4 w-2/3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2">
              <div className={`h-6 w-16 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2">
              <div className={`h-4 w-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Seminar/Program List Skeleton
export function ProgramListSkeleton({ count = 4 }) {
  const { isDark } = useTheme();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className={`rounded-xl overflow-hidden shadow-lg border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Image */}
          <div className={`h-40 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
          
          {/* Content */}
          <div className="p-5 space-y-3">
            <div className={`h-6 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            <div className={`h-4 w-full rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            <div className={`h-4 w-5/6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            
            <div className="flex items-center gap-2 pt-2">
              <div className={`h-4 w-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-4 w-24 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            
            <div className="flex gap-2 pt-3">
              <div className={`h-9 flex-1 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-9 w-20 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full Page Loading Skeleton
export function FullPageSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <PageHeaderSkeleton />
      
      {/* Stats */}
      <StatsSkeleton />
      
      {/* Filters */}
      <FilterBarSkeleton />
      
      {/* Content */}
      <TableSkeleton />
    </div>
  );
}
