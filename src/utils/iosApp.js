// Shared gating for the iOS app promos (top SmartAppBanner + bottom download bar).

export const APP_STORE_URL = 'https://apps.apple.com/app/id6776807977';

export function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as MacIntel but is touch-capable
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
}

export function isStandalone() {
  // Already added to home screen — don't promote the app.
  if (typeof window === 'undefined') return false;
  return (
    window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
  );
}

// Dev/QA override: ?testing=1 forces the promo on any device, ignoring the iOS
// check and the show-frequency throttle. No effect for real users.
export function isTestingMode() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('testing') === '1';
}
