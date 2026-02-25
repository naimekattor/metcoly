'use client';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back to the administration control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pending Review</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">42</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Support Tickets</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
      </div>

      {/* Placeholder for more content */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[300px] flex items-center justify-center border-dashed border-2">
        <p className="text-gray-400 font-medium">Analytics and charts will be displayed here.</p>
      </div>
    </div>
  );
}