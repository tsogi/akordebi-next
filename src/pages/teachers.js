import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeachersList from '@/components/TeachersList';
import { useLanguage } from '@/context/LanguageContext';

export default function Teachers() {
  const { lang } = useLanguage();

  return (
    <>
      <Head>
        <title>{`${lang.teachers} - ${lang._guitar_chords}`}</title>
        <meta name="description" content={lang.teachers} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page_container">
        <TeachersList />
      </div>
      <Footer />
    </>
  );
} 