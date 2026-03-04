import { useEffect } from 'react';
import Script from 'next/script';

export default function BookingWidget({ eventType, userId, prefill }) {
  useEffect(() => {
    // Initialize Cal.com widget
    if (window.Cal) {
      window.Cal.ns[`cal-${eventType}`]?.('init');
    }
  }, []);

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