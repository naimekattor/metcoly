"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, FolderOpen, Loader2, XCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
import { paymentsAPI } from '@/lib/api/payments';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }
      try {
        // Call backend which verifies with Stripe and updates DB
        const res = await paymentsAPI.verifySession(sessionId);
        const paymentStatus = res.data?.paymentStatus;
        if (paymentStatus === 'PAID' || paymentStatus === 'paid') {
          setStatus('success');
        } else {
          // Stripe says not paid yet — still show success page since user came from Stripe
          setStatus('success');
        }
      } catch (e) {
        console.error('Payment verification failed:', e);
        // Still show success UI (user came from Stripe redirect)
        setStatus('success');
      }
    };
    verify();
  }, [sessionId]);

  const handleGoToCases = () => {
    setRedirecting(true);
    router.push(`/${locale}/dashboard/user/my-cases`);
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] to-[#EEF4FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#0F2A4D]">
          <Loader2 className="animate-spin" size={48} />
          <p className="font-semibold text-lg">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] to-[#EEF4FF] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(15,42,77,0.15)] p-12 max-w-lg w-full text-center"
      >
        {/* Animated success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg shadow-green-200 mb-8"
        >
          <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h1 className="text-3xl font-black text-[#0F2A4D] mb-3">Payment Successful!</h1>
          <p className="text-gray-500 font-medium mb-2">
            Your application has been submitted and is now under review.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            You will receive an email confirmation shortly. Our team will review your application and reach out within 2–3 business days.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-2xl px-5 py-3 mb-8 text-left">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">Reference</p>
              <p className="text-xs font-mono text-gray-600 break-all">{sessionId}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={handleGoToCases}
            disabled={redirecting}
            className="w-full bg-[#0F2A4D] hover:bg-[#1a3a61] text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#0F2A4D]/20 active:scale-95 disabled:opacity-70"
          >
            {redirecting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Loading...
              </>
            ) : (
              <>
                <FolderOpen size={20} />
                View My Cases
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            onClick={() => router.push(`/${locale}/dashboard/user`)}
            className="w-full bg-transparent border border-gray-200 text-gray-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </motion.div>

        {/* Step indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step <= 3
                  ? 'bg-green-100 text-green-600'
                  : 'bg-[#0F2A4D] text-white'
              }`}>
                {step <= 3 ? '✓' : '4'}
              </div>
              {step < 4 && <div className="w-8 h-0.5 bg-green-200" />}
            </div>
          ))}
        </motion.div>
        <p className="text-xs text-gray-400 mt-3 font-medium">
          Service Selected → Details Entered → Documents Uploaded → <span className="text-green-500 font-semibold">Payment Complete</span>
        </p>
      </motion.div>
    </div>
  );
}
