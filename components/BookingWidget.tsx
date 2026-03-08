import { useEffect } from 'react';
import Script from 'next/script';

interface BookingWidgetProps {
  eventType: string;
  userId: string;
  prefill?: any;
}

export default function BookingWidget({ eventType, userId, prefill }: BookingWidgetProps) {
  useEffect(() => {
    // Initialize Cal.com widget
    if (typeof window !== 'undefined' && (window as any).Cal) {
      (window as any).Cal.ns[`cal-${eventType}`]?.('init');
    }
  }, [eventType]);

  return (
    <>
      <Script 
        src="https://app.cal.com/embed.js"
        strategy="afterInteractive"
      />
      
      <div 
        className="cal-com-embed"
        data-cal-namespace={`cal-${eventType}`}
        data-cal-link={`${userId}/${eventType}`}
        data-cal-config='{"layout":"month_view","theme":"light"}'
        data-cal-prefill={JSON.stringify(prefill)}
      />
    </>
  );
}