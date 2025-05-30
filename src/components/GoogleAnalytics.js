import Script from 'next/script';

const GoogleTagManager = () => {
    const gtmId = getGtmIdForDomain(process.env.NEXT_PUBLIC_DOMAIN);

    return <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`} strategy="afterInteractive" />
        <Script strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());

            gtag('config', '${gtmId}');
        `}
        </Script>
    </>
};

function getGtmIdForDomain(domain) {
    switch (domain) {
        case 'akordebi.ge':
            return 'G-EQH6P2B20Z';
        case 'chords365.com':
            return 'G-VLP9K95ZLJ';
        default:
            return '';
    }
}

export default GoogleTagManager;