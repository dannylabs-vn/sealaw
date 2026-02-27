import { useInView } from 'react-intersection-observer';

export function useScrollAnimation(options = {}) {
  const { threshold = 0.1, triggerOnce = true } = options;
  const [ref, inView] = useInView({ threshold, triggerOnce });

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const slideLeft = {
    initial: { opacity: 0, x: -40 },
    animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const slideRight = {
    initial: { opacity: 0, x: 40 },
    animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  return { ref, inView, fadeUp, fadeIn, slideLeft, slideRight };
}
