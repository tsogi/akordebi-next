import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import styles from "./Pagination.module.css";
import { useLanguage } from '@/context/LanguageContext';

export default function Pagination({ 
  currentPage = 1, 
  totalResults = 300, 
  resultsPerPage = 20,
  onNextClick = () => {}, 
  onPreviousClick = () => {}, 
  goToPage = () => {},
  notation = null
}) {
  const { lang } = useLanguage();
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const getPageNumbers = () => {
    let numbers = [];
    
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
        let left = currentPage <= 5 ? Array.from(Array(currentPage - 1), (_, i) => i + 1) : [1, "...", currentPage - 2, currentPage - 1];

        let right = currentPage >= totalPages - 4 ? getTrailNumbers(totalPages, currentPage + 1) : [currentPage + 1, currentPage + 2, "...", totalPages];

        numbers = [...left, currentPage, ...right];
    }

    return numbers;
  };

  function getTrailNumbers(from, to) {
    let numbersArray = [];
  
    for (let i = to; i <= from; i++) {
      numbersArray.push(i);
    }
  
    return numbersArray;
  }
  
  return (
    <div className="flex items-center justify-center mt-[20px] text-white px-[10px] py-3">
      <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className='mb-[15px]'>
          {
            paginationMeta(currentPage, totalResults, notation)
          }
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <span
                onClick={currentPage > 1 ? onPreviousClick : null}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2  ring-1 ring-inset ring-gray-300 hover:bg-[#f2ac2b] focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed':"cursor-pointer"}`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            
            {getPageNumbers().map((number, index) => {
                if (number === '...') {
                    return (
                        <span key={index} className={`${styles.pageBox} relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 focus:outline-offset-0`}>...</span>
                    );
                }

                return (
                    <span
                        key={index}
                        onClick={(e) => { e.preventDefault(); goToPage(number); }}
                        className={`${styles.pageBox} relative inline-flex items-center px-4 py-2 text-sm font-semibold ${number === currentPage ? 'bg-[#f2ac2b] text-white' : 'text-gray hover:bg-[#f2ac2b] cursor-pointer'} ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                    >
                        {number}
                    </span>
                );
            })}

            <span
                onClick={currentPage < totalPages ? onNextClick : null}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-white ring-1 ring-inset ring-gray-300 hover:bg-[#f2ac2b] focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed': "cursor-pointer"}`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </nav>
        </div>
      </div>
    </div>
  )
}

function paginationMeta(currentPage, totalResults, notation){
  const { lang } = useLanguage();

  // Use notation.page_title if available, otherwise fall back to lang._song
  const displayText = notation?.page_title || lang._song;

  if(process.env.NEXT_PUBLIC_LANG == "geo") {
    return <p className="text-sm text-white">
        {lang._isShown} 
        <span className="font-medium"> {(currentPage - 1) * 20}</span>
        -{lang._from} 
        <span className="font-medium"> {currentPage * 20}</span>
        -{lang._till}{' '}
        {lang._totally}
        <span className="font-medium"> {totalResults} </span> 
        {displayText}
    </p>
  }

  return <p className="text-sm text-white">
      {lang._isShown} 
      <span> </span>
      {lang._from}
      <span className="font-medium"> {(currentPage - 1) * 20} </span>
      {lang._till}
      <span className="font-medium"> {currentPage * 20}</span>
      . {lang._totally}
      <span className="font-medium"> {totalResults} </span> 
      {displayText}
  </p>
}