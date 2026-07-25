import React from 'react';

// Single Box Card Skeleton
export const BoxCardSkeleton = () => (
  <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-md animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-navy-700 rounded-2xl" />
        <div className="space-y-1.5">
          <div className="w-28 h-4 bg-gray-200 dark:bg-navy-700 rounded-md" />
          <div className="w-20 h-3 bg-gray-200 dark:bg-navy-800 rounded-md" />
        </div>
      </div>
      <div className="w-16 h-6 bg-gray-200 dark:bg-navy-700 rounded-full" />
    </div>
    <div className="w-full h-12 bg-gray-100 dark:bg-navy-800 rounded-2xl" />
    <div className="flex justify-between items-center pt-2">
      <div className="w-24 h-3 bg-gray-200 dark:bg-navy-700 rounded-md" />
      <div className="w-14 h-4 bg-gray-300 dark:bg-navy-600 rounded-md" />
    </div>
  </div>
);

// Stat Box Metric Card Skeleton
export const StatCardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="w-24 h-4 bg-gray-200 dark:bg-navy-700 rounded" />
      <div className="w-10 h-10 bg-gray-200 dark:bg-navy-700 rounded-xl" />
    </div>
    <div className="w-20 h-8 bg-gray-300 dark:bg-navy-600 rounded" />
    <div className="w-32 h-3 bg-gray-200 dark:bg-navy-700 rounded" />
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100 dark:border-navy-800/60 animate-pulse">
    <td className="py-4 px-6"><div className="w-28 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-4 px-6"><div className="w-36 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-4 px-6"><div className="w-24 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-4 px-6"><div className="w-20 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-4 px-6"><div className="w-44 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-4 px-6"><div className="w-16 h-6 bg-gray-200 dark:bg-navy-700 rounded-full" /></td>
    <td className="py-4 px-6"><div className="w-24 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-4 px-6"><div className="w-16 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
  </tr>
);

// User Table Row Skeleton
export const UserTableRowSkeleton = () => (
  <tr className="border-b border-gray-100 dark:border-navy-800/60 animate-pulse">
    <td className="py-3.5 px-4"><div className="w-28 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-3.5 px-4"><div className="w-40 h-4 bg-gray-200 dark:bg-navy-700 rounded" /></td>
    <td className="py-3.5 px-4"><div className="w-20 h-6 bg-gray-200 dark:bg-navy-700 rounded-full" /></td>
    <td className="py-3.5 px-4"><div className="w-28 h-8 bg-gray-200 dark:bg-navy-700 rounded-xl" /></td>
  </tr>
);

// Chart Box Skeleton
export const ChartSkeleton = () => (
  <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 animate-pulse h-72 flex flex-col justify-between">
    <div className="w-36 h-5 bg-gray-200 dark:bg-navy-700 rounded" />
    <div className="w-full h-44 bg-gray-100 dark:bg-navy-800 rounded-2xl flex items-end justify-around p-4 gap-3">
      <div className="w-1/6 h-1/2 bg-gray-200 dark:bg-navy-700 rounded-t-xl" />
      <div className="w-1/6 h-3/4 bg-gray-200 dark:bg-navy-700 rounded-t-xl" />
      <div className="w-1/6 h-2/3 bg-gray-200 dark:bg-navy-700 rounded-t-xl" />
      <div className="w-1/6 h-full bg-gray-200 dark:bg-navy-700 rounded-t-xl" />
      <div className="w-1/6 h-4/5 bg-gray-200 dark:bg-navy-700 rounded-t-xl" />
    </div>
  </div>
);

// Full Page Box Skeleton Loader
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-navy-950 p-6 space-y-8 animate-pulse">
    {/* Navbar Header Box */}
    <div className="h-16 w-full bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gray-200 dark:bg-navy-700 rounded-xl" />
        <div className="w-28 h-5 bg-gray-200 dark:bg-navy-700 rounded" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-20 h-8 bg-gray-200 dark:bg-navy-700 rounded-xl" />
        <div className="w-9 h-9 bg-gray-200 dark:bg-navy-700 rounded-xl" />
      </div>
    </div>

    {/* Hero / Banner Box */}
    <div className="h-44 w-full bg-white dark:bg-navy-900 rounded-3xl border border-gray-200 dark:border-navy-800 p-8 flex flex-col justify-center space-y-3">
      <div className="w-64 h-7 bg-gray-200 dark:bg-navy-700 rounded-lg" />
      <div className="w-96 h-4 bg-gray-100 dark:bg-navy-800 rounded-md" />
    </div>

    {/* Stat Box Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Main Content / Table Box */}
    <div className="p-6 bg-white dark:bg-navy-900 rounded-3xl border border-gray-200 dark:border-navy-800 space-y-4">
      <div className="w-48 h-6 bg-gray-200 dark:bg-navy-700 rounded" />
      <div className="space-y-3">
        <div className="w-full h-12 bg-gray-100 dark:bg-navy-800 rounded-xl" />
        <div className="w-full h-12 bg-gray-100 dark:bg-navy-800 rounded-xl" />
        <div className="w-full h-12 bg-gray-100 dark:bg-navy-800 rounded-xl" />
      </div>
    </div>
  </div>
);

// Form Box Skeleton Loader
export const FormBoxSkeleton = () => (
  <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 shadow-xl animate-pulse space-y-6 max-w-lg mx-auto">
    <div className="space-y-2 text-center">
      <div className="w-36 h-6 bg-gray-200 dark:bg-navy-700 rounded mx-auto" />
      <div className="w-56 h-3 bg-gray-100 dark:bg-navy-800 rounded mx-auto" />
    </div>
    <div className="space-y-4">
      <div className="h-12 w-full bg-gray-100 dark:bg-navy-800 rounded-2xl" />
      <div className="h-12 w-full bg-gray-100 dark:bg-navy-800 rounded-2xl" />
      <div className="h-12 w-full bg-gray-100 dark:bg-navy-800 rounded-2xl" />
      <div className="h-12 w-full bg-gray-200 dark:bg-navy-700 rounded-2xl" />
    </div>
  </div>
);
