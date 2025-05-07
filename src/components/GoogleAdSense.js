import Script from 'next/script';

// NOTE: This client-side component is no longer used.
// AdSense script is now added server-side in _document.js
// This file is kept for reference purposes only.

const GoogleAdSense = () => {
    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8346425726826566"
            crossOrigin="anonymous"
        />
    );
};

export default GoogleAdSense; 