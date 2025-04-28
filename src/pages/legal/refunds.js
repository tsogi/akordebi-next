import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import RefundsGeo from '@/components/RefundsGeo';
import RefundsEng from '@/components/RefundsEng';
import lang from '@/services/lang';

const RefundPolicy = () => {
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
          process.env.NEXT_PUBLIC_LANG == "geo" ?
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