export const notations_old = [
    { code: "chords", category: "guitar", name: "გიტარის აკორდები", chordsDir: "/chords/guitar"},
    { code: "tabs", category: "guitar", name: "გიტარის ტაბები", chordsDir: "/chords/guitar" },
    { code: "fanduri", category: "fanduri", name: "ფანდურის აკორდები", chordsDir: "/chords/fanduri" },
];

export const notations = [
    { 
        name: "გიტარა", 
        icon: "/icons/guitar.svg",
        tabs: [
            { code: "chords", category: "guitar", name: "გიტარის აკორდები", chordsDir: "/chords/guitar"},
            { code: "tabs", category: "guitar", name: "გიტარის ტაბები", chordsDir: "/chords/guitar" },
        ] 
    },
    {
        name: "ფანდური", 
        icon: "/icons/fanduri.svg",
        tabs: [
            { code: "fanduri", category: "fanduri", name: "ფანდურის აკორდები", chordsDir: "/chords/fanduri" },
        ] 
    }
]

export function getNotation(code){
    const notation = notations.find(notation => notation.code === code);

    return notation;
}