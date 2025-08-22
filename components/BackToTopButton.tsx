
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button
      onClick={handleScrollTop}
      className="fixed right-6 bottom-24 md:bottom-20 z-40 bg-primary text-white hover:bg-primary/90 p-3 rounded-full shadow-lg border-2 border-white transition"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.20)' }}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  ) : null;
};
