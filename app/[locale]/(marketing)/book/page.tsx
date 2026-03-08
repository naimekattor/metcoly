'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

export default function BookPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'consultation' });
      cal('ui', {
        cssVarsPerTheme: { 
          light: { 'cal-brand': '#1b3d6e' },
          dark: { 'cal-brand': '#1b3d6e' }
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#1b3d6e] tracking-tight">
            Book Your Consultation
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Select a convenient time for your visa consultation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[700px] border border-gray-100">
          <Cal
            namespace="consultation"
            calLink="naimhossen/consultation"
            style={{ width: '100%', height: '700px', border: 'none' }}
            config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-50">
            <p className="text-[#2E9E59] font-bold text-xl">✓</p>
            <p className="text-sm font-semibold text-gray-700">Instant Confirmation</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-50">
            <p className="text-[#2E9E59] font-bold text-xl">✓</p>
            <p className="text-sm font-semibold text-gray-700">Secure Payment</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-50">
            <p className="text-[#2E9E59] font-bold text-xl">✓</p>
            <p className="text-sm font-semibold text-gray-700">Expert Guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
  