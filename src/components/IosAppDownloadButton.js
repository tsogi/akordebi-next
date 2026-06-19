import { useEffect, useState } from 'react';
import styles from './IosAppDownloadButton.module.css';
import { APP_STORE_URL, isIosDevice, isStandalone, isTestingMode } from '@/utils/iosApp';

// Inline "download the iOS app" button for the footer. Same gating as the top
// SmartAppBanner: mobile iOS only, with a ?testing=1 override. Unlike the
// banner it isn't dismissible — it's just a static link in the footer.
export default function IosAppDownloadButton() {
  // Start hidden so SSR and first client render match (avoids hydration mismatch).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTestingMode()) {
      setVisible(true);
      return;
    }

    if (isIosDevice() && !isStandalone()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <a
      className={styles.badgeLink}
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download akordebi.ge on the App Store"
    >
      {/* Official Apple badge — do not restyle or recolor (App Store guidelines). */}
      <img
        className={styles.badge}
        src="/app-store-badge.svg"
        alt="Download on the App Store"
        width={148}
        height={49}
      />
    </a>
  );
}
