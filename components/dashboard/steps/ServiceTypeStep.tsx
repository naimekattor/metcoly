"use client";

import { useTranslations } from 'next-intl';
import { useCaseStore } from '@/stores/useCaseStore';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Users, Home, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { servicesAPI } from '@/lib/api/services';

// Fallback icons by service name keywords
const SERVICE_ICONS: Record<string, any> = {
  default: Briefcase,
  study: GraduationCap,
  student: GraduationCap,
  work: Briefcase,
  permanent: Home,
  citizenship: Home,
  family: Users,
  sponsorship: Users,
};

function getServiceIcon(name: string) {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(SERVICE_ICONS)) {
    if (key !== 'default' && lowerName.includes(key)) return SERVICE_ICONS[key];
  }
  return SERVICE_ICONS.default;
}

type Service = {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
  currency?: string;
};

export default function ServiceTypeStep() {
  const t = useTranslations('dashboard.newCase.step1');
  const { serviceType, setServiceType, nextStep } = useCaseStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesAPI.getActiveServices();
        const data = res.data?.services ?? [];
        setServices(data);
      } catch (e) {
        console.error('Failed to load services:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const formatPrice = (service: Service) => {
    if (!service.basePrice) return 'Contact us';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: service.currency || 'USD',
      minimumFractionDigits: 0,
    }).format(service.basePrice);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-[#0F2A4D]">{t('title')}</h2>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#0F2A4D]" size={36} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service) => {
            const isSelected = serviceType?.id === service.id;
            const Icon = getServiceIcon(service.name);

            return (
              <motion.button
                key={service.id}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setServiceType({
                  id: service.id,
                  label: service.name,
                  price: formatPrice(service),
                })}
                className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#0F2A4D] bg-[#0F2A4D]/5 ring-4 ring-[#0F2A4D]/5'
                    : 'border-gray-100 bg-white hover:border-[#0F2A4D]/30'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                    isSelected ? 'bg-[#0F2A4D] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-[#0F2A4D]/10 group-hover:text-[#0F2A4D]'
                  }`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isSelected ? 'text-[#0F2A4D]' : 'text-gray-900'}`}>
                      {service.name}
                    </h3>
                    <p className="text-[#B38B3F] font-bold mt-1 text-xl">{formatPrice(service)}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-4 bg-[#0F2A4D] text-white p-1 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="flex justify-end pt-8 border-t border-gray-100">
        <button
          disabled={!serviceType}
          onClick={nextStep}
          className="bg-[#0F2A4D] hover:bg-[#1a3a61] text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#0F2A4D]/20 active:scale-95"
        >
          Next Step
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

