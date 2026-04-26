import { useEffect, useRef } from 'react';

export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) {
      lockRef.current?.release();
      lockRef.current = null;
      // Clear media session
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
      }
      return;
    }

    // Wake lock
    if ('wakeLock' in navigator) {
      let cancelled = false;

      async function acquire() {
        try {
          lockRef.current = await navigator.wakeLock.request('screen');
          lockRef.current.addEventListener('release', () => {
            if (!cancelled) reacquireOnVisible();
          });
        } catch (e) {
          console.warn('[wakeLock]', e);
        }
      }

      function reacquireOnVisible() {
        const fn = async () => {
          if (document.visibilityState === 'visible' && !cancelled) {
            document.removeEventListener('visibilitychange', fn);
            await acquire();
          }
        };
        document.addEventListener('visibilitychange', fn);
      }

      acquire();

      return () => {
        cancelled = true;
        lockRef.current?.release();
        lockRef.current = null;
      };
    }
  }, [active]);

  // MediaSession — runs independently, tells Android this is active audio
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (active) {
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Voice Assistant',
        artist: 'Jeeves',
      });
      // Handle action so Android doesn't kill the session
      navigator.mediaSession.setActionHandler('pause', () => {});
      navigator.mediaSession.setActionHandler('stop', () => {});
    } else {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
    }
  }, [active]);
}
