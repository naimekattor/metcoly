'use client';

import Cal from '@calcom/embed-react';

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Book Your Consultation
          </h1>
          <p className="text-gray-600 mt-2">
            Select a time that works for you. You'll receive a confirmation email immediately.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px]">
          <Cal
            calLink="naimhossen/consultation" 
            style={{ width: '100%', height: '700px', border: 'none' }}
            config={{
              theme: 'light',
            }}
          />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>✓ Instant email confirmation from Cal.com</p>
          <p>✓ You'll receive updates when admin approves your booking</p>
          <p>✓ Meeting link will be provided upon approval</p>
        </div>
      </div>
    </div>
  );
}