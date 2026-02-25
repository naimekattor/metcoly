import { useTranslations } from 'next-intl';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import ImmigrationServices from '@/components/ImmigrationServices';
import HowItWorks from '@/components/HowItWorks';
import SecurityCompliance from '@/components/SecurityCompliance';
import SecurePlatformSection from '@/components/SecurePlatformSection';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <SecurePlatformSection />
      <ImmigrationServices />
      <HowItWorks />
      <SecurityCompliance />
      
      <Testimonials />
        <CallToAction />
    </main>
  );
}