import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';

const SW_AD_SCOPE = '/';

async function unregisterAdServiceWorkers() {
    if (!('serviceWorker' in navigator)) return;
    try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
            const swUrl = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || '';
            if (swUrl.includes('3nbf4') || swUrl.includes('sw.js') || swUrl.includes('monetag')) {
                await reg.unregister();
            }
        }
    } catch {}
}

function removeAdScripts() {
    ['monetag-inpage', 'monetag-vignette'].forEach(id => {
        document.getElementById(id)?.remove();
    });
    document.querySelectorAll('script[src*="nap5k.com"], script[src*="n6wxm.com"], script[src*="3nbf4.com"]').forEach(el => el.remove());
}

function injectAdScripts() {
    if (document.getElementById('monetag-inpage')) return;

    const s1 = document.createElement('script');
    s1.id = 'monetag-inpage';
    s1.dataset.zone = '10830371';
    s1.src = 'https://nap5k.com/tag.min.js';
    document.body.appendChild(s1);

    const s2 = document.createElement('script');
    s2.id = 'monetag-vignette';
    s2.dataset.zone = '10830377';
    s2.src = 'https://n6wxm.com/vignette.min.js';
    document.body.appendChild(s2);
}

function registerAdServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: SW_AD_SCOPE }).catch(() => {});
}

export default function Monetag() {
    const { isPremium, hasResolved } = useUser();

    useEffect(() => {
        // Only act once user status is fully resolved (one-way latch — never fires during race window)
        if (!hasResolved) return;

        if (isPremium) {
            removeAdScripts();
            unregisterAdServiceWorkers();
        } else {
            injectAdScripts();
            registerAdServiceWorker();
        }
    }, [hasResolved, isPremium]);

    return null;
}
