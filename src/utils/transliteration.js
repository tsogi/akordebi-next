// Georgian to Latin transliteration mapping
const georgianToLatinMap = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 
    'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 
    'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'f', 
    'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 
    'წ': 'w', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
};

/**
 * Converts Georgian text to Latin characters
 * @param {string} text - The Georgian text to transliterate
 * @returns {string} - The transliterated text in Latin characters
 */
const convertGeorgianToLatin = (text) => {
    if (!text) return '';
    
    return Array.from(text).map(char => {
        // Convert both lowercase and uppercase Georgian letters
        const lowerChar = char.toLowerCase();
        const latinChar = georgianToLatinMap[lowerChar];
        
        // If the character exists in our map, convert it
        // Otherwise, keep the original character
        if (latinChar) {
            // Preserve original case if possible
            return char === lowerChar ? latinChar : latinChar.toUpperCase();
        }
        return char;
    }).join('');
};

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with first letter of each word capitalized
 */
const capitalizeWords = (text) => {
    if (!text) return '';
    
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Converts Georgian text to Latin characters and capitalizes the first letter
 * @param {string} text - The Georgian text to transliterate
 * @returns {string} - The transliterated text with first letter capitalized
 */
const transliterateWithCapital = (text) => {
    if (!text) return '';
    const transliterated = convertGeorgianToLatin(text);
    return transliterated.charAt(0).toUpperCase() + transliterated.slice(1);
};

/**
 * Converts Georgian text to Latin characters and capitalizes first letter of each word
 * @param {string} text - The Georgian text to transliterate
 * @returns {string} - The transliterated text with first letter of each word capitalized
 */
const transliterateWithCapitalizedWords = (text) => {
    if (!text) return '';
    const transliterated = convertGeorgianToLatin(text);
    return capitalizeWords(transliterated);
};

export {
    convertGeorgianToLatin,
    transliterateWithCapital,
    transliterateWithCapitalizedWords,
    capitalizeWords
}; 