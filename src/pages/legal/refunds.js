import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import RefundsGeo from '@/components/RefundsGeo';
import RefundsEng from '@/components/RefundsEng';
import { useLanguage } from '@/context/LanguageContext';

const RefundPolicy = () => {
  const { lang, language } = useLanguage();

  return (
    <>
    <Head>
        <title>{lang._footer_refunds || "დაბრუნება"}</title>
        <meta name="description" content={lang._footer_refunds || "დაბრუნება"} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header />
      <div className='page_container'>
        {
          language == "geo" ?
          <RefundsGeo />
          :
          <RefundsEng />
        }
      </div>
    <Footer />
    </>
  );
};

export default RefundPolicy; 