export const notations = [
    { 
        name: "გიტარა", 
        icon: "/icons/guitar.svg",
        tabs: [
            { code: "guitar_chord", category: "guitar", name: "აკორდები", page_title: "გიტარის აკორდი", chordsDir: "/chords/guitar"},
            { code: "guitar_tab", category: "guitar", name: "ტაბები", page_title: "გიტარის ტაბი", chordsDir: "/chords/guitar"},
            { code: "guitar_lesson", category: "guitar", name: "გაკვეთილები", page_title: "გიტარის გაკვეთილი", chordsDir: "/chords/guitar"},
        ] 
    },
    {
        name: "ფანდური", 
        icon: "/fanduri_icon.png",
        tabs: [
            { code: "fanduri_chord", category: "fanduri", name: "აკორდები", page_title: "ფანდურის აკორდი", chordsDir: "/chords/fanduri"},
            { code: "fanduri_lesson", category: "fanduri", name: "გაკვეთილებები", page_title: "ფანდურის გაკვეთილი", chordsDir: "/chords/fanduri"},
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