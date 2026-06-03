import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title }) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <button onClick={handleShare} className="share-btn">
      {shared ? <Check size={18} /> : <Share2 size={18} style={{position: 'relative', left: '-1px'}} />}
    </button>
  );
}