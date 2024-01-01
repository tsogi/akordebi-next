import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <>
    <Head>
        <title>{`Terms of service`}</title>
        <meta name="description" content={"Terms of service"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8346425726826566" crossOrigin="anonymous"></script>
    </Head>
    <Header />
    <div style={{ padding: '20px' }}>
      <h1>Terms of Service for {process.env.NEXT_PUBLIC_DOMAIN}</h1>
      <p><strong>Last Updated:</strong> 1 Jan 2024</p>
      <br></br>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using {process.env.NEXT_PUBLIC_DOMAIN}, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you should not use or access this website.</p>

      <br></br>
      <h2>2. Description of Service</h2>
      <p>{process.env.NEXT_PUBLIC_DOMAIN} provides guitar chords for songs. These chords are for educational and informational purposes only.</p>

      <br></br>
      <h2>3. User Conduct</h2>
      <p>You agree to use {process.env.NEXT_PUBLIC_DOMAIN} only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.</p>
      <p>The content provided on {process.env.NEXT_PUBLIC_DOMAIN} is for personal use only. Commercial use of any content on this website is strictly prohibited.</p>

      <br></br>
      <h2>4. Intellectual Property Rights</h2>
      <p>The chords and related content are provided for educational purposes and may be subject to copyright or other intellectual property rights owned by third parties.</p>
      <p>You may not copy, reproduce, redistribute, sell, or exploit any content on this website without explicit permission from the rightful owner.</p>

      <br></br>
      <h2>5. Content Accuracy</h2>
      <p>{process.env.NEXT_PUBLIC_DOMAIN} does not guarantee the accuracy, completeness, or reliability of any information on this site.</p>

      <br></br>
      <h2>6. Limitation of Liability</h2>
      <p>{process.env.NEXT_PUBLIC_DOMAIN} will not be liable for any damages or injury that accompany or result from your use of any of its services.</p>

      <br></br>
      <h2>7. Modifications to Terms of Service</h2>
      <p>{process.env.NEXT_PUBLIC_DOMAIN} reserves the right to modify these Terms at any time.</p>
    </div>
    <Footer />
    </>
  );
};

export default TermsOfService;