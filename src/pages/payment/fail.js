import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Head from 'next/head';
import Footer from '@/components/Footer';

export default function PaymentFail() {
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>გიტარის მაღაზია | აკორდები.გე</title>
        <meta name="description" content="მაღალი ხარისხის გიტარები და აქსესუარები. შეიძინეთ კლასიკური და აკუსტიკური გიტარები." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="w-[90%] mx-auto my-16 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">გადახდა ვერ შესრულდა</h1>
        <div className="text-gray-600 mb-6 mxedruli text-left">
          <p>პირველ რიგში დარწმუნდით რომ ბარათის ნომერი, მოქმედების ვადა და CVV კოდი სწორად ჩაწერეთ.</p>
          <p>გთხოვთ სცადოთ მოგვიანებით ან დაუკავშირდეთ ადმინისტრაციას tsogiaidze1@gmail.com.</p>
        </div>
        <button 
          onClick={goToHomePage}
          className="mt-4 px-6 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors"
        >
          მთავარი გვერდი
        </button>
      </div>
      <Footer />
    </>
  );
} 