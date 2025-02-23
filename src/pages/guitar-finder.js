import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GuitarQuiz from '@/components/GuitarQuiz';
import lang from '@/services/lang';

export default function GuitarFinder() {
  return (
    <>
      <Head>
        <title>{`Guitar Finder - ${lang._guitar_chords}`}</title>
        <meta name="description" content="Find the perfect guitar for you by answering a few simple questions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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