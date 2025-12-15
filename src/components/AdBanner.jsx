import { useEffect } from 'react'

function AdBanner({ adSlot, style = { display: 'block', width: '100%', height: 90 } }) {
  useEffect(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }, []);
  
    return (
      <ins className="adsbygoogle"
           style={style}
           data-ad-client="ca-pub-7308197349797955"
           data-ad-slot={adSlot}
           data-ad-format="auto"
           data-full-width-responsive="true">
  
      </ins>
    );
}

export default AdBanner