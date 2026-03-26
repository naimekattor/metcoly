'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { settingsAPI } from '@/lib/api/settings';
import { toast } from 'react-hot-toast';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await settingsAPI.getSetting('privacy-policy');
        if (res.status === 'success') {
          setContent(res.data.value || '');
          if (res.data.updatedAt) {
            setLastSaved(new Date(res.data.updatedAt));
          }
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        toast.error('Failed to load privacy policy');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await settingsAPI.updateSetting('privacy-policy', content);
      if (res.status === 'success') {
        toast.success('Privacy policy updated successfully');
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      toast.error('Failed to update privacy policy');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0F2A4D] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Privacy Policy...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-blue-600" size={24} />
              Privacy Policy Management
            </h1>
            <p className="text-sm text-gray-500">Edit and update the platform's public privacy policy</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:block">
              Last saved: {lastSaved.toLocaleString()}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0F2A4D] text-white rounded-xl font-bold text-sm hover:bg-[#1a3d6e] disabled:opacity-50 transition-all shadow-lg shadow-blue-900/10"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Policy Content (Markdown Supported)</span>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <CheckCircle size={14} /> Autosave disabled
          </div>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the privacy policy content here..."
          className="flex-1 p-8 outline-none resize-none font-medium text-gray-700 leading-relaxed placeholder:text-gray-300"
        />
      </div>

      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <Shield size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Pro-tip: Content Formatting</h4>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            You can use standard Markdown formatting to structure your policy. This includes headings, bold text, lists, and links. The public facing page will automatically render these styles to ensure professional appearance.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
