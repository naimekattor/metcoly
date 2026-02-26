'use client';

import { useTranslations } from 'next-intl';

export default function AdminUsersPage() {
  const t = useTranslations('admin.users');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 text-sm">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-400">{t('empty')}</p>
      </div>
    </div>
  );
}