import { useState, useEffect } from 'react';

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
      return;
    }

    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

  return isTouchDevice;
};