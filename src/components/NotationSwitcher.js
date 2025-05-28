import { useLanguage } from '@/context/LanguageContext';

export default function NotationSwitcher({ 
    notationFormat, 
    onNotationFormatChange
}) {
    const { lang } = useLanguage();
    
    return (
        <div className="flex justify-center overflow-x-auto mb-6">
            <div className="inline-flex rounded-lg shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-1 max-w-full">
                <button
                    onClick={() => onNotationFormatChange("chords")}
                    className={`flex items-center justify-center space-x-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                        notationFormat === "chords"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <img 
                        src="/guitar_icon.svg"
                        className={`w-4 h-4 ${notationFormat === "chords" ? "brightness-[1.75] contrast-[0.7]" : ""}`} 
                        alt="Guitar icon"
                    />
                    <span>{lang._chords}</span>
                </button>
                <button
                    onClick={() => onNotationFormatChange("tabs")}
                    className={`flex items-center justify-center space-x-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                        notationFormat === "tabs"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <img 
                        src="/guitar_icon.svg" 
                        className={`w-4 h-4 ${notationFormat === "tabs" ? "brightness-[1.75] contrast-[0.7]" : ""}`} 
                        alt="Guitar icon"
                    />
                    <span>{lang._tabs}</span>
                </button>
                <button
                    onClick={() => onNotationFormatChange("fanduri")}
                    className={`flex items-center justify-center space-x-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                        notationFormat === "fanduri"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <img 
                        src="/fanduri_icon.png" 
                        className={`w-4 h-4 ${notationFormat === "fanduri" ? "brightness-[1.75] contrast-[0.7]" : ""}`} 
                        alt="Fanduri icon"
                    />
                    <span>{lang._chords}</span>
                </button>
            </div>
        </div>
    );
} 