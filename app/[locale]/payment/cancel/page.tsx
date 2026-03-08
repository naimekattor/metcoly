"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function PaymentCancelPage() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] to-[#FFF0F0] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(200,0,0,0.1)] p-12 max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-200 mb-8"
        >
          <XCircle size={48} className="text-white" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h1 className="text-3xl font-black text-[#0F2A4D] mb-3">Payment Cancelled</h1>
          <p className="text-gray-500 font-medium mb-2">
            Your payment was not completed. No charges have been made.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Your application draft has been saved. You can return and complete the payment at any time from your cases page.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => router.push(`/${locale}/dashboard/user/my-cases/new`)}
            className="w-full bg-[#0F2A4D] hover:bg-[#1a3a61] text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#0F2A4D]/20 active:scale-95"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>

          <button
            onClick={() => router.push(`/${locale}/dashboard/user`)}
            className="w-full bg-transparent border border-gray-200 text-gray-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
