import { useEffect } from 'react';

interface Options {
  callback: () => void;
  hasMore: boolean;
  isFetching: boolean;
  offset?: number;
}

export const useInfiniteScroll = ({
  callback,
  hasMore,
  isFetching,
  offset = 100,
}: Options) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;

      if (scrollBottom < offset && hasMore && !isFetching) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore, isFetching, offset]);
};