import { useEffect, useRef, memo } from 'react';

function AdBanner({ adSlot, style = { display: 'block', width: '100%', height: 90 } }) {
  const adRef = useRef(null);

  useEffect(() => {
    const ins = adRef.current;
    if (!ins) return;

    // 🔑 CRITICAL: AdSense internal guard
    if (ins.dataset.adsbygoogleStatus === 'done') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-7308197349797955"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export default memo(AdBanner);
