import { useEffect, useRef } from 'react';

export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let cancelled = false;

    async function acquire() {
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
        console.log('[wakeLock] acquired');
        lockRef.current.addEventListener('release', () => {
          if (!cancelled) reacquireOnVisible();
        });
      } catch (e) {
        console.warn('[wakeLock] failed:', e);
      }
    }

    function reacquireOnVisible() {
      const handler = async () => {
        if (document.visibilityState === 'visible' && !cancelled) {
          document.removeEventListener('visibilitychange', handler);
          await acquire();
        }
      };
      document.addEventListener('visibilitychange', handler);
    }

    acquire();

    return () => {
      cancelled = true;
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, [active]);
}
