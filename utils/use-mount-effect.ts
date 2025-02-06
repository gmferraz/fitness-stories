import { useEffect } from 'react';

/**
 * Runs once on component mount.
 * Equivalent to useEffect with empty dependencies, but avoids eslint warning.
 */
export const useMountEffect = (effect: React.EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};

/**
 * Runs once on component unmount.
 * Equivalent to useEffect with empty dependencies, but avoids eslint warning.
 */
export const useUnmountEffect = (callback: (args?: any) => any) => {
  useEffect(() => {
    return () => callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
