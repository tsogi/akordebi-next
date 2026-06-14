import { useEffect, useState } from 'react';
import styles from './SmartAppBanner.module.css';

const APP_STORE_URL = 'https://apps.apple.com/app/id6776807977';
const STORAGE_KEY = 'ios_app_banner_dismissed';
const LOGO_SRC = '/akordebige_logo.svg';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as MacIntel but is touch-capable
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
}

function isStandalone() {
  // Already added to home screen — don't promote the app.
  if (typeof window === 'undefined') return false;
  return (
    window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
  );
}

export default function SmartAppBanner() {
  // Start hidden so SSR and first client render match (avoids hydration mismatch).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Dev/QA override: ?testing=1 forces the banner on any device, ignoring
    // the iOS check and the once-per-day suppression. No effect for real users.
    const isTesting = new URLSearchParams(window.location.search).get('testing') === '1';

    if (isTesting) {
      setVisible(true);
      return;
    }

    if (!isIosDevice() || isStandalone()) return;

    let dismissedOn = null;
    try {
      dismissedOn = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage may be unavailable (private mode); fail open and show.
    }

    // "Once per day": suppress only if dismissed earlier today.
    if (dismissedOn === todayKey()) return;

    setVisible(true);
  }, []);

  function recordDismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, todayKey());
    } catch {
      // ignore
    }
  }

  function dismiss() {
    recordDismiss();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="akordebi.ge iOS app">
      <button className={styles.close} onClick={dismiss} aria-label="დახურვა">
        ×
      </button>
      <div className={styles.top}>
        <img className={styles.icon} src={LOGO_SRC} alt="akordebi.ge" width={56} height={56} />
        <div className={styles.text}>
          <span className={styles.title}>akordebi.ge — უკვე მობილურში</span>
          {/* <span className={styles.subtitle + ' mxedruli'}>
            ქართული სიმღერების აკორდები გიტარასა და ფანდურზე
          </span> */}
        </div>
      </div>
      <ul className={styles.features + ' mxedruli'}>
        <li>გიტარისა და ფანდურის აკორდები — ინტერნეტის გარეშეც</li>
        <li>გიტარის და ფანდურის აწყობა</li>
        <li>ნოტების სავარჯიშო</li>
        <li>ძიება, ფავორიტები და ტონალობის შეცვლა</li>
      </ul>
      <a
        className={styles.cta}
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={recordDismiss}
      >
        ნახვა App Store-ში
      </a>
    </div>
  );
}
