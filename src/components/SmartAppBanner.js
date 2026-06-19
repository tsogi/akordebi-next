import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './SmartAppBanner.module.css';
import { APP_STORE_URL, isIosDevice, isStandalone, isTestingMode } from '@/utils/iosApp';

const COUNT_KEY = 'ios_app_banner_pageviews';
const SHOW_EVERY = 4; // show on the first page view, then every 4th after
const LOGO_SRC = '/akordebige_logo.svg';

export default function SmartAppBanner() {
  // Start hidden so SSR and first client render match (avoids hydration mismatch).
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  // Last path we counted, so a single page view is never counted twice — guards
  // against React Strict Mode's double-invoked effects and any re-render that
  // doesn't actually change the page.
  const lastCountedPath = useRef(null);

  // Runs on initial load and again whenever the path changes (any client-side
  // navigation), since this component lives in _app and re-renders on route
  // changes. Each distinct page view is counted exactly once.
  useEffect(() => {
    // Dev/QA override: ?testing=1 forces the banner on. No effect for real users.
    if (isTestingMode()) {
      setVisible(true);
      return;
    }

    if (!isIosDevice() || isStandalone()) return;

    const path = router.asPath;
    if (path === lastCountedPath.current) return;
    lastCountedPath.current = path;

    let count;
    try {
      count = (parseInt(window.localStorage.getItem(COUNT_KEY), 10) || 0) + 1;
      window.localStorage.setItem(COUNT_KEY, String(count));
    } catch {
      // localStorage unavailable (private mode); never show.
      return;
    }
    // count 1, 5, 9, … → first visit, then every 4th page view.
    setVisible(count % SHOW_EVERY === 1);
  }, [router.asPath]);

  function dismiss() {
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
        onClick={dismiss}
      >
        ნახვა App Store-ში
      </a>
    </div>
  );
}
