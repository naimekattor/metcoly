'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    key: 'sarah',
    name: 'Sarah Jenkins',
    role: 'Software Engineer from UK',
    avatar: 'https://img.freepik.com/free-photo/handsome-bearde…b3c787be208f9666bfedac14f49086f08cf08e4b14&w=1480',
    featured: false,
  },
  {
    key: 'ahmed',
    name: 'Ahmed Al-Sayed',
    role: 'Entrepreneur from UAE',
    avatar: 'https://img.freepik.com/free-photo/handsome-bearde…b3c787be208f9666bfedac14f49086f08cf08e4b14&w=1480',
    featured: true,
  },
  {
    key: 'elena',
    name: 'Elena Rodriguez',
    role: 'Graphic Designer from Brazil',
    avatar: 'https://img.freepik.com/free-photo/handsome-bearde…b3c787be208f9666bfedac14f49086f08cf08e4b14&w=1480',
    featured: false,
  },
] as const;

function Stars({ filled = 5 }: { filled?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations('landing.testimonials');

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
          {t('title')}
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
          {TESTIMONIALS.map(({ key, name, role, avatar, featured }) => (
            <div
              key={key}
              className={`rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200 ${
                featured
                  ? 'bg-[#1b3d6e] shadow-xl scale-[1.03]'
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Stars */}
              <Stars filled={5} />

              {/* Quote */}
              <p className={`text-sm leading-relaxed ${featured ? 'text-white/90' : 'text-gray-600'}`}>
                "{t(`items.${key}.quote`)}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${featured ? 'text-white' : 'text-gray-900'}`}>
                    {name}
                  </p>
                  <p className={`text-xs ${featured ? 'text-white/60' : 'text-gray-400'}`}>
                    {role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}