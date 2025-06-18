'use client';

import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useUser } from '@/utils/useUser';

export default function UploadInfo() {
  const { user, setAuthOpenedFrom } = useUser();

  const handleUploadClick = () => {
    if (!user) {
      setAuthOpenedFrom('upload-info');
      return;
    }
    // User is logged in, navigate to upload page
    window.location.href = '/createSong';
  };

  const UploadButton = ({ className = "" }) => (
    <button
      onClick={handleUploadClick}
      className={`w-full py-4 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 capital ${className}`}
    >
      რესურსის ატვირთვა
    </button>
  );

  const guitarChordsData = {
    title: "გიტარის აკორდები",
    price: "5 ლარი",
    requirements_title: "გიტარის აკორდების ატვირთვის წესები და პირობები (5 ლარი)",
    requirements: [
      "ტექსტი შეყვანილია სრულად, შემოკლებების გარეშე",
      "კუპლეტები გამოყოფილია ერთმანეთისგან ზუსტად 1 ხაზით",
      "მონიშნულია მისამღერის სტრიქონები",
      "მითითებულია მარჯვენა ხელის დაკვრის (რითმის) ინსტრუქცია ტექსტის თავში",
      "აკორდები მონიშნულია ზუსტად იმ სიმბოლოების თავზე რომლის დროსაც უნდა შეიცვალოს",
      "მიბმულია youtube გაკვეთილის ლინკი (შეგიძლიათ გამოიყენოთ youtube-ზე არსებული სხვისი ვიდეო გაკვეთილები)"
    ],
    example_link: "https://akordebi.ge/chord/meliqishvilis_gamziri-zura_doijashvili"
  };

  const fanduriChordsData = {
    title: "ფანდურის აკორდები",
    price: "5 ლარი",
    requirements_title: "ფანდურის აკორდების ატვირთვის წესები და პირობები (5 ლარი)",
    requirements: [
      "ტექსტი შეყვანილია სრულად, შემოკლებების გარეშე",
      "კუპლეტები გამოყოფილია ერთმანეთისგან ზუსტად 1 ხაზით",
      "მონიშნულია მისამღერის სტრიქონები",
      "მითითებულია მარჯვენა ხელის დაკვრის (რითმის) ინსტრუქცია ტექსტის თავში",
      "აკორდები მონიშნულია ზუსტად იმ სიმბოლოების თავზე რომლის დროსაც უნდა შეიცვალოს",
      "მიბმულია youtube გაკვეთილის ლინკი (შეგიძლიათ გამოიყენოთ youtube-ზე არსებული სხვისი ვიდეო გაკვეთილები)"
    ]
  };

  const songTextsData = {
    title: "სიმღერების ტექსტები",
    price: "3 ლარი",
    requirements_title: "სიმღერების ტექსტების ატვირთვის წესები და პირობები (3 ლარი)",
    requirements: [
      "ტექსტი შეყვანილია სრულად, შემოკლებების გარეშე",
      "კუპლეტები გამოყოფილია ერთმანეთისგან ზუსტად 1 ხაზით",
      "მონიშნულია მისამღერის სტრიქონები",
      "ტექსტი უნდა იყოს წაკითხვადი და შეცდომების გარეშე",
      "სიმღერის სახელწოდება და ავტორი მითითებული სწორად"
    ]
  };

  const ResourceCard = ({ resourceData, isHighlighted = false }) => (
    <div className={`relative rounded-2xl overflow-hidden p-6 md:p-8 w-full flex flex-col shadow-lg border transition-all duration-300 hover:shadow-xl ${
      isHighlighted 
        ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      {/* Decorative elements */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        isHighlighted ? 'from-blue-500 to-indigo-500' : 'from-green-400 to-emerald-500'
      }`}></div>
      
      {isHighlighted && (
        <div className="absolute top-6 right-6">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capital">
            რეკომენდებული
          </span>
        </div>
      )}
      
      <div className="mb-6 relative">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capital">{resourceData.title}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold text-green-600 dark:text-green-400 capital">{resourceData.price}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">/ რესურსი</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 capital">
          {resourceData.requirements_title}
        </h4>
        <ul className="space-y-3">
          {resourceData.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-0.5">
                <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {resourceData.example_link && (
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            სრულფასოვანი სიმღერის მაგალითად შეგიძლიათ გამოიყენოთ მოცემული რესურსა:
          </p>
          <a 
            href={resourceData.example_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm underline capital"
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 capital">
              გამოიმუშავეთ თანხა რესურსების ატვირთვით
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              ატვირთეთ ხარისხიანი რესურსები და მიიღეთ ანაზღაურება ყოველი დამოწმებული ატვირთვისთვის
            </p>
            
            {/* Top Upload Button */}
            <div className="max-w-sm mx-auto">
              <UploadButton />
            </div>
          </div>

          {/* Resource Types Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 capital">
              ხელმისაწვდომი რესურსის ტიპები
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <ResourceCard resourceData={guitarChordsData} isHighlighted={true} />
              <ResourceCard resourceData={fanduriChordsData} />
              <ResourceCard resourceData={songTextsData} />
            </div>
          </div>

          {/* General Terms Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 md:p-8 border border-amber-200 dark:border-amber-800 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 capital">
              ზოგადი წესები და პირობები
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4">
                  <span className="text-amber-600 dark:text-amber-400 font-bold capital">1</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  პირველი რესურსის ატვირთვის შემდეგ tsogiaidze1@gmail.com-ზე უნდა მოგვწეროთ თქვენი მეილი რომლითაც შეხვედით სისტემაში რესურსის ატვირთვის წინ. ადმინისტრაცია შეამოწმებს ატვირთვის სისწორეს და მოგცემთ დასტურს გააგრძელოთ ატვირთვა.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4">
                  <span className="text-amber-600 dark:text-amber-400 font-bold capital">2</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  ამის შემდეგ ყოველ 10 ატვირთულ რესურსაზე უნდა მოგვწეროთ თქვენი მეილი და ანგარიშის ნომერი, რის შემდეგაც ჩაგირიცხავთ კუთვნილ თანხას. ჩარიცხვის შემდეგ ადმინისტრაცია მოგცემთ დასტურს გააგრძელოთ და ატვირთოთ კიდევ 10 რესურსა.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                  პირველი და ყოველი მომდევნო 10 რესურსის დამოწმება ადმინისტრაციის მიერ სავალდებულოა. წინააღმდეგ შემთხვევაში ადმინისტრაცია იტოვებს უფლებას თანხა არ ჩაგირიცხოთ.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Upload Button */}
          <div className="text-center">
            <div className="max-w-sm mx-auto">
              <UploadButton />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {!user ? 'ატვირთვისთვის საჭიროა ავტორიზაცია' : 'მზად ხართ ატვირთვის დასაწყებად?'}
            </p>
          </div>
        </main>
      </div>
      
      <Footer />
    </>
  );
} 