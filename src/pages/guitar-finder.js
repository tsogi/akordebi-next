import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GuitarQuiz from '@/components/GuitarQuiz';
import lang from '@/services/lang';
import uiDb from '@/services/data';

export default function GuitarFinder() {
  useEffect(() => {
    // Log when user visits the guitar finder page
    uiDb.logEvent("guitar_finder_page_visit");
  }, []);

  return (
    <>
      <Head>
        <title>{`გიტარის შერჩევა - ${lang._guitar_chords}`}</title>
        <meta name="description" content="შეარჩიე საუკეთესო გიტარა რამდენიმე მარტივი კითხვის საშუალებით" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page_container">
        <GuitarQuiz />
      </div>
      <Footer />
    </>
  );
} 