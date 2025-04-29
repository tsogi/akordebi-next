import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

const TermsOfService = () => {
  const [copySuccess, setCopySuccess] = useState('');
  const { lang } = useLanguage();

  const handleCopy = () => {
    const accountNumber = 'GE16BG0000000366014987';

    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopySuccess('ანგარიშის ნომერი დაკოპირებულია!');
      setTimeout(() => setCopySuccess(''), 3000); // Clear the message after 3 seconds
    });
  };

  return (
    <>
    <Head>
        <title>დონაცია</title>
        <meta name="description" content={lang._footer_terms} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header />
      <div className='page_container'>
      <div className="flex justify-center">
        <div className="max-w-3xl rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
              დონაცია
          </h1>
          <p className="mb-4 text-white">
            ჩვენი სურვილია მოგაწოდოთ უფასო, მაღალი ხარისხის გიტარის აკორდები და დაკვრის ინსტრუქციები რეკლამების გარეშე. 
          </p>
          
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            რატომ გვჭირდება თქვენი მხარდაჭერა
          </h2>
          <p className="mb-4 text-white">
            ამ ვებგვერდის შენარჩუნება და გაუმჯობესება მოითხოვს დროს, შრომას და რესურსებს.
          </p>
          <p className="mb-4 text-white">
            თუ ჩვენი ვებგვერდი თქვენთვის ღირებულია, მხარდაჭერა შეგიძლიათ დონაციის საშუალებით. ნებისმიერი რაოდენობის შეწირულობა დაგვეხმარება გავაუმჯობესოთ და დავამატოთ ახალი ფუნქციონალი.
          </p>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            როგორ შეგიძლიათ წვლილი შეიტანოთ
          </h2>
          <p className="mb-4 text-white">
            თანხა შეგიძლიათ გადმორიცხოთ საქართველოს ბანკის ანგარიშზე. დანიშნულებაში მიუთითეთ თქვენი სახელი და გვარი რომელიც გამოჩნდება akordebi.ge-ზე, კონტრიბუტორების სიაში
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>საბანკო ანგარიშის დეტალები:</strong>
            </p>
            <p className="text-gray-700">ანგარიშის ნომერი: <span>GE16BG0000000366014987</span>
              <span className='ml-[10px]'>
                { copySuccess ? 
                  <span className="mt-2 px-4 py-[3px] cursor-pointer rounded bg-green-600 text-white transition">მზადაა</span>
                  :
                  <span 
                    onClick={handleCopy} 
                    className="mt-2 px-4 py-[3px] cursor-pointer rounded border border-solid border-[#0000ff] hover:bg-blue-600 hover:text-white transition">
                      კოპირება
                  </span>
                }
              </span>
            </p>
            <p className="text-gray-700">ანგარიშის მფლობელის სახელი: ნიკა ცოგიაიძე</p>
            <p className="text-gray-700">ბანკის სახელი: საქართველოს ბანკი</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default TermsOfService;