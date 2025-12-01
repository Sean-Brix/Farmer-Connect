import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

// Table skeleton for request section
export function RequestTableSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
      }`}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-2">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
          <div className="col-span-1">
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
        <div key={index} className={`px-6 py-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 space-y-2">
              <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-3 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2">
              <div className={`h-4 w-2/3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-1">
              <div className={`h-6 w-12 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2">
              <div className={`h-4 w-1/2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2">
              <div className={`h-6 w-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <div className={`h-8 w-16 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
              <div className={`h-8 w-16 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Statistics skeleton
export function StatisticsSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-lg p-6 border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`h-4 w-24 rounded mb-3 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
            <div className={`h-8 w-16 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'} animate-pulse`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Filter skeleton
export function FilterSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {[...Array(5)].map((_, index) => (
        <div key={index} className={`h-10 w-32 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        } animate-pulse`}></div>
      ))}
    </div>
  );
}

// Card skeleton for items grid
export function ItemCardSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${
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
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className={`px-6 py-4 border-b ${
      isDark ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="grid grid-cols-12 gap-4 items-center">
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
          <div className={`h-4 w-1/2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
        </div>
        <div className="col-span-3 flex justify-end space-x-2">
          <div className={`h-8 w-16 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
          <div className={`h-8 w-16 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
        </div>
      </div>
    </div>
  );
}
