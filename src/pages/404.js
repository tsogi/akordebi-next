import Link from "next/link"
import Head from "next/head"
import { useEffect } from "react"

export default function Custom404() {
  // Ensure proper 404 status code is set
  useEffect(() => {
    // This helps ensure the status code is properly set for crawlers
    if (typeof window !== 'undefined' && window.history) {
      // Set document title for crawlers that might miss the Head component
      document.title = '404 Not Found - Akordebi.ge';
    }
  }, []);

  return (
    <>
      <Head>
        <title>404 Not Found - Page Does Not Exist | Akordebi.ge</title>
        <meta name="description" content="Error 404: The requested page was not found on this server. This page does not exist." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:title" content="404 Not Found - Page Does Not Exist" />
        <meta property="og:description" content="Error 404: The requested page was not found on this server." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://akordebi.ge/404" />
      </Head>
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl w-full text-center px-4">
          <div className="mb-8">
            {/* Clear 404 heading for Google */}
            <h1 className="text-8xl font-bold text-red-600 mb-4" role="heading" aria-level="1">
              404
            </h1>
            
            {/* Explicit error message */}
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Not Found
            </h2>
            
            <h3 className="text-xl font-medium text-gray-700 mb-6">
              Page Not Found - გვერდი ვერ მოიძებნა
            </h3>
            
            {/* Clear error description for Google */}
            <div className="text-gray-600 mb-8 space-y-2">
              <p className="text-lg">
                <strong>Error 404:</strong> The requested page does not exist on this server.
              </p>
              <p>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <p className="text-base text-gray-500">
                მითითებული გვერდი არ არსებობს, წაშლილია ან დროებით მიუწვდომელია.
              </p>
            </div>
          </div>
          
          {/* Navigation help */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-medium"
            >
              ← Return to Homepage
            </Link>
            
          </div>
        </div>
      </main>
    </>
  )
}