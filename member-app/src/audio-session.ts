type PlaybackNavigator = Navigator & {audioSession?: {type: string}};

// Keep the real <audio> element alive in the app shell. Neither hiding the
// page nor locking the screen should pause it or replace its signed source.
export function connectAudioSession(
  audio: HTMLAudioElement,
  title: string,
  stop: () => void,
  failed: () => void,
  browser: PlaybackNavigator = navigator,
): () => void {
  const category = browser.audioSession;
  try { if (category) category.type = 'playback'; } catch { /* Optional Safari API. */ }
  const media = browser.mediaSession;
  if (!media) return () => { try { if (category) category.type = 'auto'; } catch {} };

  if (typeof MediaMetadata !== 'undefined') {
    media.metadata = new MediaMetadata({title, artist: 'Well-Vie', artwork: [
      {src: '/app/assets/icon512.png', sizes: '512x512', type: 'image/png'},
    ]});
  }
  const update = () => {
    media.playbackState = audio.paused || audio.ended ? 'paused' : 'playing';
    try {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        media.setPositionState?.({duration: audio.duration,
          position: Math.max(0, Math.min(audio.duration, audio.currentTime)),
          playbackRate: audio.playbackRate || 1});
      } else media.setPositionState?.();
    } catch { /* Position reporting must never interrupt playback. */ }
  };
  const seek = (position: number) => {
    if (!Number.isFinite(position) || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, position));
    update();
  };
  const handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
    play: () => { void audio.play().catch(failed); },
    pause: () => audio.pause(),
    stop,
    seekbackward: details => seek(audio.currentTime - (details.seekOffset ?? 15)),
    seekforward: details => seek(audio.currentTime + (details.seekOffset ?? 15)),
    seekto: details => { if (details.seekTime !== undefined) seek(details.seekTime); },
  };
  for (const [action, handler] of Object.entries(handlers)) {
    try { media.setActionHandler(action as MediaSessionAction, handler); } catch { /* Unsupported action. */ }
  }
  const events = ['play', 'pause', 'ended', 'loadedmetadata', 'durationchange', 'timeupdate', 'ratechange'];
  events.forEach(event => audio.addEventListener(event, update));
  update();
  return () => {
    events.forEach(event => audio.removeEventListener(event, update));
    Object.keys(handlers).forEach(action => {
      try { media.setActionHandler(action as MediaSessionAction, null); } catch {}
    });
    media.metadata = null;
    media.playbackState = 'none';
    try { media.setPositionState?.(); } catch {}
    try { if (category) category.type = 'auto'; } catch {}
  };
}
