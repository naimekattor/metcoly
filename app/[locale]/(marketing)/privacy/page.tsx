'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link } from '@/nextInt/navigation';
import { settingsAPI } from '@/lib/api/settings';

export default function PublicPrivacyPolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await settingsAPI.getSetting('privacy-policy');
        if (res.status === 'success') {
          setContent(res.data.value || 'No privacy policy has been published yet.');
          if (res.data.updatedAt) {
            setUpdatedAt(new Date(res.data.updatedAt));
          }
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setContent('Error loading privacy policy. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#0F2A4D] transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <Shield size={12} /> Legal Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Privacy <span className="text-blue-600 italic">Policy</span>
          </h1>
          {updatedAt && (
            <div className="flex items-center gap-2 mt-6 text-sm font-bold text-gray-400">
              <Clock size={16} /> Last Updated: {updatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 p-8 md:p-12">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="prose prose-blue max-w-none">
              <div className="whitespace-pre-wrap text-gray-600 leading-relaxed font-medium">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Trust Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            Metcoly Information Security & Canadian Compliance
          </p>
        </div>
      </div>
    </div>
  );
}
