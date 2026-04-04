import Script from 'next/script';
import { useUser } from '@/utils/useUser';

export default function Monetag() {
    const { isPremium, isLoading } = useUser();

    // Only on akordebi.ge
    // if (process.env.NEXT_PUBLIC_DOMAIN !== 'akordebi.ge') return null;

    // Wait until user status is resolved, then hide for premium users
    // if (isLoading) return null;
    // if (isPremium) return null;

    return (
        <>
            {/* In-Page Push */}
            <Script
                id="monetag-inpage"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(s){s.dataset.zone='10830371',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
                }}
            />
            {/* Vignette */}
            <Script
                id="monetag-vignette"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(s){s.dataset.zone='10830377',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
                }}
            />
        </>
    );
}
