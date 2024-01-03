import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import TermsGeo from '@/components/TermsGeo';
import TermsEng from '@/components/TermsEng';
import lang from '@/services/lang';

const TermsOfService = () => {
  return (
    <>
    <Head>
        <title>{lang._footer_terms}</title>
        <meta name="description" content={lang._footer_terms} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header />
      <div className='page_container'>
        {
          process.env.NEXT_PUBLIC_LANG == "geo" ?
          <TermsGeo />
          :
          <TermsEng />
        }
      </div>
    <Footer />
    </>
  );
};

export default TermsOfService;