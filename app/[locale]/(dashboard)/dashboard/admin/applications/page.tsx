'use client';

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
          <p className="text-gray-500 text-sm">Review and manage all client immigration files.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Recent Applications</h3>
        </div>
        <div className="p-12 text-center">
          <p className="text-gray-400">Application management table will go here.</p>
        </div>
      </div>
    </div>
  );
}