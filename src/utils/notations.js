export const notations = [
    { code: "chords", name: "გიტარის აკორდები", chordsDir: "/chords/guitar"},
    { code: "tabs", name: "გიტარის ტაბები", chordsDir: "/chords/guitar" },
    { code: "fanduri", name: "ფანდურის აკორდები", chordsDir: "/chords/fanduri" },
];

export function getNotation(code){
    const notation = notations.find(notation => notation.code === code);

    return notation;
}