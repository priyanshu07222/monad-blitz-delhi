import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for intersection observer animations
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.RefObject, boolean]} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

/**
 * Custom hook for count-up animations
 * @param {number} end - The end value
 * @param {Object} options - Animation options
 * @returns {number} - Current animated value
 */
export const useCountUp = (end, options = {}) => {
  const { duration = 2000, startOnMount = true, decimals = 0 } = options;
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = count;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (end - startValue) * easeOut;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(updateCount);
  }, [count, end, duration, decimals, isAnimating]);

  useEffect(() => {
    if (startOnMount && end > 0) {
      animate();
    }
  }, [startOnMount, end, animate]);

  return { count, animate, isAnimating };
};

/**
 * Custom hook for managing component animations
 * @returns {Object} - Animation utilities
 */
export const useAnimations = () => {
  const [animationStates, setAnimationStates] = useState({});

  const setAnimationState = useCallback((key, state) => {
    setAnimationStates((prev) => ({
      ...prev,
      [key]: state,
    }));
  }, []);

  const triggerAnimation = useCallback(
    (key, className = "animate-pulse", duration = 1000) => {
      setAnimationState(key, className);

      setTimeout(() => {
        setAnimationState(key, "");
      }, duration);
    },
    [setAnimationState]
  );

  const getAnimationClass = useCallback(
    (key) => {
      return animationStates[key] || "";
    },
    [animationStates]
  );

  return {
    animationStates,
    setAnimationState,
    triggerAnimation,
    getAnimationClass,
  };
};
