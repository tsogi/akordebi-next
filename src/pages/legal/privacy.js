import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
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
      <h1>Privacy Policy for {process.env.NEXT_PUBLIC_DOMAIN}</h1>
      <p><strong>Last Updated:</strong> 1 Jan 2024</p>
      
      <section className="mt-[30px]">
        <h2>Introduction</h2>
        <p>Welcome to {process.env.NEXT_PUBLIC_DOMAIN}. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
      </section>

      <section className="mt-[30px]">
        <h2>Information We Collect</h2>
        <p>As part of our Service, we collect the following information:</p>
        <ul>
          <li>Email addresses from users who authenticate using Supabase Gmail and Facebook auth.</li>
          <li>IP addresses to enable non-registered users to vote for songs.</li>
        </ul>
      </section>

      <section className="mt-[30px]">
        <h2>How We Use Your Information</h2>
        <p>We use your email to create a unique account for you to save your favorite songs. Your IP address is used to ensure that voting for songs is fair and prevents multiple votes from a single user.</p>
      </section>

      <section className="mt-[30px]">
        <h2>Sharing Your Information</h2>
        <p>We do not share your personal information with third parties except as necessary to provide our service or as required by law.</p>
      </section>

      <section className="mt-[30px]">
        <h2>Your Rights</h2>
        <p>You have the right to access, correct, delete, or transfer your personal data that we hold. You also have the right to complain to a Data Protection Authority about our collection and use of your personal data.</p>
      </section>

      <section className="mt-[30px]">
        <h2>Security of Your Data</h2>
        <p>We are committed to protecting the security of your personal data. We use a variety of security technologies and procedures to help protect your personal data from unauthorized access, use, or disclosure.</p>
      </section>

      <section className="mt-[30px]">
        <h2>Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      </section>

      <section className="mt-[30px]">
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, You can contact us:</p>
        <ul>
          <li>By email: tsogiaidze1@gmail.com</li>
        </ul>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default PrivacyPolicy;