export const notations = [
    { 
        name: "გიტარა", 
        icon: "/icons/guitar.svg",
        tabs: [
            { code: "chords", category: "guitar", name: "აკორდები", page_title: "გიტარის აკორდი", chordsDir: "/chords/guitar", urlSegment: "guitar_chord"},
            { code: "tabs", category: "guitar", name: "ტაბები", page_title: "გიტარის ტაბი", chordsDir: "/chords/guitar", urlSegment: "guitar_tab"},
            { code: "guitar_lessons", category: "guitar", name: "გაკვეთილები", page_title: "გიტარის გაკვეთილი", chordsDir: "/chords/guitar", urlSegment: "guitar_lesson"},
        ] 
    },
    {
        name: "ფანდური", 
        icon: "/fanduri_icon.png",
        tabs: [
            { code: "fanduri", category: "fanduri", name: "აკორდები", page_title: "ფანდურის აკორდი", chordsDir: "/chords/fanduri", urlSegment: "fanduri_chord"},
            { code: "fanduri_lessons", category: "fanduri", name: "გაკვეთილებები", page_title: "ფანდურის გაკვეთილი", chordsDir: "/chords/fanduri", urlSegment: "fanduri_lesson"},
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