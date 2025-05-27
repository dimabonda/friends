import { useEffect, useRef, useState } from 'react';

export const useHasVerticalScroll = (dependency: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!ref.current) return;

      const scrollable = ref.current.querySelector('.simplebar-content-wrapper') as HTMLElement;
      if (!scrollable) return;

      const hasVerticalScroll = scrollable.scrollHeight > scrollable.clientHeight;
      console.log("hasVerticalScroll", hasVerticalScroll)
      setHasScroll(hasVerticalScroll);
    };

    check();

    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('resize', check);
    };
  }, [dependency]);

  return { ref, hasScroll };
};