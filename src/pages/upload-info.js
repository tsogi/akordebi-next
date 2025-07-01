'use client';

import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useUser } from '@/utils/useUser';

export default function UploadInfo() {
  const { user, setAuthOpenedFrom } = useUser();

  const handleUploadClick = (notationType) => {
    if (!user) {
      setAuthOpenedFrom('upload-info');
      return;
    }
    // User is logged in, navigate to upload page with notation type
    window.location.href = `/createSong?notationType=${notationType}`;
  };

  const guitarChordsData = {
    title: "გიტარის აკორდები",
    price: "4 ლარი",
    requirements_title: "ატვირთვის წესები და პირობები",
    requirements: [
      "ტექსტი შეყვანილია სრულად, შემოკლებების გარეშე",
      "კუპლეტები გამოყოფილია ერთმანეთისგან",
      "მონიშნულია მისამღერის სტრიქონები",
      "მითითებულია მარჯვენა ხელის დაკვრის (რითმის) ინსტრუქცია ტექსტის თავში",
      "სიმღერის სახელწოდება და ავტორი მითითებული სწორად",
      "აკორდები მონიშნულია ზუსტად იმ სიმბოლოების თავზე რომლის დროსაც უნდა შეიცვალოს",
      "სასურველია youtube გაკვეთილის ლინკის მიბმა(თქვენი ან სხვისი)",
      "ატვირთვამდე, ძებნის მეშვეობით შეამოწმეთ ხომ არაა უკვე ატვირთული"
    ],
    example_link: "/resource/guitar_chord/tuki_gesizmrebi-besik_kalandadze"
  };

  const fanduriChordsData = {
    title: "ფანდურის აკორდები",
    price: "6 ლარი",
    requirements_title: "ატვირთვის წესები და პირობები",
    requirements: [
      "ტექსტი შეყვანილია სრულად, შემოკლებების გარეშე",
      "კუპლეტები გამოყოფილია ერთმანეთისგან",
      "მონიშნულია მისამღერის სტრიქონები",
      "მითითებულია მარჯვენა ხელის დაკვრის (რითმის) ინსტრუქცია ტექსტის თავში",
      "სიმღერის სახელწოდება და ავტორი მითითებული სწორად",
      "აკორდები მონიშნულია ზუსტად იმ სიმბოლოების თავზე რომლის დროსაც უნდა შეიცვალოს",
      "სასურველია youtube გაკვეთილის ლინკის მიბმა(თქვენი ან სხვისი)",
      "ატვირთვამდე, ძებნის მეშვეობით შეამოწმეთ ხომ არაა უკვე ატვირთული"
    ],
    example_link: "/resource/fanduri_chord/inatebs_chemo-teona_qumsiashvili"
  };

  const songTextsData = {
    title: "სიმღერების ტექსტები",
    price: "1 ლარი",
    requirements_title: "ატვირთვის წესები და პირობები",
    requirements: [
      "ტექსტი შეყვანილია სრულად, შემოკლებების გარეშე",
      "კუპლეტები გამოყოფილია ერთმანეთისგან",
      "მონიშნულია მისამღერის სტრიქონები",
      "ტექსტი უნდა იყოს წაკითხვადი და შეცდომების გარეშე",
      "სიმღერის სახელწოდება და ავტორი მითითებული სწორად",
      "მითითებულია სიმღერის youtube ლინკი",
      "ატვირთვამდე, ძებნის მეშვეობით შეამოწმეთ ხომ არაა უკვე ატვირთული",
    ],
    example_link: "/resource/song_text/saqartveloa-mgzavrebi"
  };

  const ResourceCard = ({ resourceData, notationType }) => (
    <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 w-full flex flex-col shadow-lg border transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 border-gray-500/50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
      
      <div className="mb-6 relative">
        <h3 className="text-2xl font-bold text-white mb-2 capital">{resourceData.title}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold text-green-400 capital">{resourceData.price}</span>
          <span className="text-gray-300 ml-2">/ რესურსი</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-100 mb-4 capital">
          {resourceData.requirements_title}
        </h4>
        <ul className="space-y-3">
          {resourceData.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mr-3 mt-0.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-200 text-sm leading-relaxed">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Upload Button for this resource type */}
      <div className="mt-auto mb-4">
        <button
          onClick={() => handleUploadClick(notationType)}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 capital"
        >
          ატვირთვა
        </button>
      </div>
      
      {resourceData.example_link && (
        <div className="pt-4 border-t border-gray-600">
          <p className="text-sm text-gray-300 mb-2">
            სრულფასოვან მაგალითად შეგიძლიათ გამოიყენოთ მოცემული რესურსი:
          </p>
          <a 
            href={resourceData.example_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm underline capital"
          >
            მაგალითის ნახვა
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>რესურსების ატვირთვა და გამომუშავება</title>
        <meta name="description" content="ათვირთეთ რესურსები და გამოიმუშავეთ თანხა - გიტარის აკორდები, ფანდურის აკორდები, სიმღერების ტექსტები" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <div className="mxedruli">
        <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 capital">
              გამოიმუშავეთ თანხა
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              ატვირთეთ <b>ქართული</b> რესურსები და მიიღეთ ანაზღაურება</p>
          </div>

          {/* Resource Types Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <ResourceCard resourceData={guitarChordsData} notationType="guitar_chord" />
              <ResourceCard resourceData={fanduriChordsData} notationType="fanduri_chord" />
              <ResourceCard resourceData={songTextsData} notationType="song_text" />
            </div>
          </div>

          {/* General Terms Section */}
          <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-2xl p-6 md:p-8 border border-amber-500/30 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 capital">
              ზოგადი წესები და პირობები
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mr-4">
                  <span className="text-amber-300 font-bold capital">1</span>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  პირველი რესურსის ატვირთვის შემდეგ tsogiaidze1@gmail.com-ზე უნდა მოგვწეროთ თქვენი მეილი რომლითაც შეხვედით სისტემაში რესურსის ატვირთვის წინ. ადმინისტრაცია შეამოწმებს ატვირთვის სისწორეს და მოგცემთ დასტურს გააგრძელოთ ატვირთვა.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mr-4">
                  <span className="text-amber-300 font-bold capital">2</span>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  ამის შემდეგ ყოველ 10 ატვირთულ რესურსაზე უნდა მოგვწეროთ თქვენი მეილი და ანგარიშის ნომერი, რის შემდეგაც ჩაგირიცხავთ კუთვნილ თანხას. ჩარიცხვის შემდეგ ადმინისტრაცია მოგცემთ დასტურს გააგრძელოთ და ატვირთოთ კიდევ 10 რესურსა.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center mr-4">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-gray-200 leading-relaxed font-semibold">
                  პირველი და ყოველი მომდევნო 10 რესურსის დამოწმება ადმინისტრაციის მიერ სავალდებულოა. წინააღმდეგ შემთხვევაში ადმინისტრაცია იტოვებს უფლებას თანხა არ ჩაგირიცხოთ.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </>
  );
} 