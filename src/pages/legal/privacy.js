import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import PrivacyGeo from '@/components/PrivacyGeo';
import PrivacyEng from '@/components/PrivacyEng';
import { useLanguage } from '@/context/LanguageContext';

const PrivacyPolicy = () => {
  const { lang, language } = useLanguage();

  return (
    <>
    <Head>
        <title>{lang._footer_policy}</title>
        <meta name="description" content={lang._footer_policy} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header />
      <div className='page_container'>
        {
          language == "geo" ?
          <PrivacyGeo />
          :
          <PrivacyEng />
        }
      </div>
    <Footer />
    </>
  );
};

export default PrivacyPolicy;