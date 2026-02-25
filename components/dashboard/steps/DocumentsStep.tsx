"use client";

import { useTranslations } from 'next-intl';
import { useCaseStore } from '@/stores/useCaseStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, CheckCircle2, X } from 'lucide-react';
import { useRef } from 'react';

const documentConfig = [
  { id: 'passport', label: 'Passport Copy', hint: 'Upload passport copy (Bio page)' },
  { id: 'photo', label: 'Passport Size Photo', hint: 'Upload recent passport size photo' },
  { id: 'birthCertificate', label: 'Birth Certificate', hint: 'Upload birth certificate' },
  { id: 'education', label: 'Education Certificate', hint: 'Upload highest education certificate' },
  { id: 'employment', label: 'Employment Letter', hint: 'Upload current employment letter' },
  { id: 'financial', label: 'Financial Documents', hint: 'Upload bank statements / proof of funds' },
];

export default function DocumentsStep() {
  const t = useTranslations('dashboard.newCase.step3');
  const { documents, setDocument, nextStep, prevStep } = useCaseStore();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocument(key as any, file);
  };

  const removeFile = (key: string) => {
    setDocument(key as any, null);
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key]!.value = '';
    }
  };

  const mandatoryKeys = ['passport', 'photo', 'birthCertificate'];
  const isComplete = mandatoryKeys.every(key => documents[key as keyof typeof documents] !== null);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-[#0F2A4D]">{t('title')}</h2>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentConfig.map((doc) => {
          const file = documents[doc.id as keyof typeof documents];
          const isMandatory = mandatoryKeys.includes(doc.id);

          return (
            <div key={doc.id} className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                <span>{doc.label} {isMandatory && <span className="text-red-500">*</span>}</span>
                {file && <span className="text-green-600 text-xs flex items-center gap-1"><CheckCircle2 size={12} /> Ready</span>}
              </label>
              
              <div className={`relative group transition-all duration-300 ${file ? 'bg-green-50/30 border-green-200' : 'bg-white border-gray-100 hover:border-[#0F2A4D]/30'} border-2 rounded-2xl p-4 flex items-center gap-4 h-[100px]`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${file ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  {file ? <FileText size={24} /> : <Upload size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  {file ? (
                    <div>
                      <p className="text-sm font-bold text-[#0F2A4D] truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.hint}</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {file ? (
                    <button 
                      onClick={() => removeFile(doc.id)}
                      className="p-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <X size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      className="px-4 py-2 bg-gray-50 hover:bg-[#0F2A4D] hover:text-white border border-gray-100 rounded-xl text-xs font-bold transition-all"
                    >
                      Select File
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={el => { fileInputRefs.current[doc.id] = el; }}
                  onChange={(e) => handleFileChange(doc.id, e)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-8 border-t border-gray-100 max-w-4xl mx-auto">
        <button
          onClick={prevStep}
          className="px-8 py-4 rounded-2xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 active:scale-95"
        >
          <ArrowLeft size={18} />
          Previous
        </button>
        <button
          disabled={!isComplete}
          onClick={nextStep}
          className="bg-[#0F2A4D] hover:bg-[#1a3a61] text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#0F2A4D]/20 active:scale-95"
        >
          Next Step
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {isComplete ? (
        <p className="text-center text-xs text-green-600 font-medium">✨ All mandatory documents are uploaded!</p>
      ) : (
        <p className="text-center text-xs text-gray-400 font-medium">* Mandatory documents are required to proceed</p>
      )}
    </div>
  );
}
