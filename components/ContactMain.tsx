'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Phone, Mail, Globe, MapPin, Clock, Send } from 'lucide-react';

// ── Contact Info Cards ────────────────────────────────────────────────────────
function ContactInfoCards() {
  const t = useTranslations('contact.info');

  const cards = [
    {
      icon: Phone,
      key: 'phone',
      value: '+1 (800) 555-VISA',
      sub: t('phoneHours'),
    },
    {
      icon: Mail,
      key: 'email',
      value: 'info@larouss.ca',
      sub: t('emailResponse'),
    },
    {
      icon: Globe,
      key: 'portal',
      value: t('portalValue'),
      sub: t('portalSub'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {cards.map(({ icon: Icon, key, value, sub }) => (
        <div
          key={key}
          className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow duration-200"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon size={18} className="text-[#1b3d6e]" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">{t(`${key}Title`)}</p>
            <p className="text-[#1b3d6e] font-bold text-sm mt-0.5">{value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const t = useTranslations('contact.form');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6">{t('title')}</h2>

      {sent ? (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Send size={20} className="text-green-600" />
          </div>
          <p className="font-semibold text-gray-900">{t('successTitle')}</p>
          <p className="text-gray-500 text-sm">{t('successDesc')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('fullName')}</label>
            <input
              type="text"
              placeholder="John Doe"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('emailAddress')}</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('phoneNumber')}</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition"
            />
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('serviceOfInterest')}</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition bg-white"
            >
              <option value="">{t('selectService')}</option>
              {['permanentResidence', 'studyPermits', 'workPermits', 'familyImmigration'].map((s) => (
                <option key={s} value={s}>{t(`services.${s}`)}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('message')}</label>
            <textarea
              rows={4}
              placeholder={t('messagePlaceholder')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b3d6e] hover:bg-[#152f56] disabled:opacity-70 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <Send size={15} />
            {loading ? t('sending') : t('send')}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Office Locations ──────────────────────────────────────────────────────────
const OFFICES = [
  {
    key: 'toronto',
    address: '123 Bay Street, Suite 1500\nToronto, ON M5J 2N8',
    phone: '+1 (416) 555-0100',
    email: 'toronto@larouss.ca',
    hours: 'Mon–Fri: 9:00 AM – 6:00 PM EST',
  },
  {
    key: 'vancouver',
    address: '456 West Georgia Street, Suite 800\nVancouver, BC V6B 4N6',
    phone: '+1 (604) 555-0200',
    email: 'vancouver@larouss.ca',
    hours: 'Mon–Fri: 9:00 AM – 6:00 PM PST',
  },
  {
    key: 'montreal',
    address: '789 Rue Sainte-Catherine O, Suite 300\nMontréal, QC H3B 1G5',
    phone: '+1 (514) 555-0300',
    email: 'montreal@larouss.ca',
    hours: 'Mon–Fri: 9:00 AM – 6:00 PM EST',
  },
] as const;

function OfficeLocations() {
  const t = useTranslations('contact.offices');

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">{t('title')}</h2>
      <div className="flex flex-col gap-4">
        {OFFICES.map(({ key, address, phone, email, hours }) => (
          <div key={key} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-[#1b3d6e] flex-shrink-0" />
              <p className="font-bold text-gray-900 text-sm">{t(`${key}.name`)}</p>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-3 whitespace-pre-line">{address}</p>
            <div className="space-y-1.5">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-600 hover:text-[#1b3d6e] text-xs transition-colors">
                <Phone size={12} className="text-gray-400 flex-shrink-0" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-gray-600 hover:text-[#1b3d6e] text-xs transition-colors">
                <Mail size={12} className="text-gray-400 flex-shrink-0" /> {email}
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock size={12} className="flex-shrink-0" /> {hours}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function ContactMain() {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactInfoCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />
          <OfficeLocations />
        </div>
      </div>
    </section>
  );
}