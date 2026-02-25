import ContactHero from '@/components/ContactHero';
import ContactMain from '@/components/ContactMain';
import ContactFAQ from '@/components/ContactFAQ';

export default function ContactPage() {
  return (
    <>
      <main>
        <ContactHero />
        <ContactMain />
        <ContactFAQ />
      </main>
    </>
  );
}