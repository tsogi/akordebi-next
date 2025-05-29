export const notations = [
    { 
        name: "გიტარა", 
        icon: "/icons/guitar.svg",
        tabs: [
            { code: "chords", category: "guitar", name: "აკორდები", chordsDir: "/chords/guitar"},
            { code: "tabs", category: "guitar", name: "ტაბები", chordsDir: "/chords/guitar" },
            { code: "guitar_lessons", category: "guitar", name: "გაკვეთილები", chordsDir: "/chords/guitar" },
        ] 
    },
    {
        name: "ფანდური", 
        icon: "/fanduri_icon.png",
        tabs: [
            { code: "fanduri", category: "fanduri", name: "აკორდები", chordsDir: "/chords/fanduri" },
            { code: "fanduri_lessons", category: "fanduri", name: "გაკვეთილებები", chordsDir: "/chords/fanduri" },
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