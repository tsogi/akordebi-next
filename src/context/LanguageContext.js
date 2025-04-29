import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { interfaceGeo, interfaceEng } from '../services/lang_temp';
import { useRouter } from 'next/router';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('geo');
    const [lang, setLang] = useState(interfaceGeo);
    const router = useRouter();

    useEffect(() => {
        const storedLanguage = Cookies.get('language') || 'geo';
        setLanguage(storedLanguage);
        setLang(storedLanguage === 'eng' ? interfaceEng : interfaceGeo);
    }, []);

    const toggleLanguage = () => {
        const newLanguage = language === 'geo' ? 'eng' : 'geo';
        setLanguage(newLanguage);
        setLang(newLanguage === 'eng' ? interfaceEng : interfaceGeo);
        Cookies.set('language', newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, lang, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}; 