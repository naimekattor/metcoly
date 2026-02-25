'use client';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
        <p className="text-gray-500 text-sm">Generate and view detailed analytics reports.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-400">Reports and data visualization will go here.</p>
      </div>
    </div>
  );
}