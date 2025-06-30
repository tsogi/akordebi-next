export const notations = [
    { 
        name: "გიტარა", 
        icon: "/icons/guitar.svg",
        tabs: [
            { code: "guitar_chord", category: "guitar", name: "აკორდები", page_title: "გიტარის აკორდი", page_title_plural: "გიტარის აკორდები", chordsDir: "/chords/guitar"},
            { code: "guitar_tab", category: "guitar", name: "ტაბები", page_title: "გიტარის ტაბი", page_title_plural: "გიტარის ტაბები", chordsDir: "/chords/guitar"},
            { code: "guitar_lesson", category: "guitar", name: "გაკვეთილები", page_title: "გიტარის გაკვეთილი", page_title_plural: "გიტარის გაკვეთილები", chordsDir: "/chords/guitar", isFree: true},
        ] 
    },
    {
        name: "ფანდური", 
        icon: "/icons/fanduri_icon.png",
        tabs: [
            { code: "fanduri_chord", category: "fanduri", name: "აკორდები", page_title: "ფანდურის აკორდი", page_title_plural: "ფანდურის აკორდები", chordsDir: "/chords/fanduri"},
            { code: "fanduri_lesson", category: "fanduri", name: "გაკვეთილებები", page_title: "ფანდურის გაკვეთილი", page_title_plural: "ფანდურის გაკვეთილები", chordsDir: "/chords/fanduri", isFree: true},
        ] 
    },
    {
        name: "სიმღერები", 
        icon: "/icons/songs_icon.png",
        tabs: [
            { code: "song_text", category: "songs", name: "ტექსტები", page_title: "სიმღერის ტექსტი", page_title_plural: "სიმღერის ტექსტები", chordsDir: "/chords/guitar", isFree: true, hideDifficulty: true, hideChords: true},
            // { code: "song_singer", category: "songs", name: "შემსრულებლები", page_title: "მომღერალი", chordsDir: "/chords/guitar"},
            // { code: "song_bands", category: "songs", name: "ჯგუფები", page_title: "ჯგუფი", chordsDir: "/chords/guitar"},
        ] 
    }
]

export function getNotation(code) {
    // Find the category and tab that matches the code
    for (const category of notations) {
        const tab = category.tabs.find(tab => tab.code === code);
        if (tab) {
            return {
                ...category,
                ...tab
            };
        }
    }
    return null;
}