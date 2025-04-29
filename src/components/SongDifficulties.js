import React, { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { useLanguage } from '@/context/LanguageContext';

function getDifficulties(){
  const { lang } = useLanguage();
  return [
    { label: lang.difficulty.select, value: "-1"},
    { label: lang.difficulty.very_easy, value: 1 },
    { label: lang.difficulty.easy, value: 2 },
    { label: lang.difficulty.medium, value: 3 },
    { label: lang.difficulty.hard, value: 4 },
    { label: lang.difficulty.very_hard, value: 5 },
  ];
}

const SongDifficulties = (props) => {
  const [existingDifficulty, setExistingDifficulty] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(-1);
  const { lang } = useLanguage();

  useEffect(() => {
    refreshDifficultyPlugin();
  }, [props.songId]);

  async function refreshDifficultyPlugin() {
    let response = await (await fetch(`/api/difficulties/${props.songId}`)).json();
    let data = response.data;

    if (data?.existingDifficulty?.difficulty) {
      const difficulty = data.existingDifficulty?.difficulty;
      setExistingDifficulty(difficulty);
      setSelectedDifficulty(difficulty);
    }
  }

  const handleChange = async (event) => {
    const difficulty = parseInt(event.target.value);
    if(difficulty == -1) return;
    setSelectedDifficulty(difficulty);

    const method = existingDifficulty ? "PUT" : "POST";
    await fetch(`/api/difficulties/${props.songId}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    });

    refreshDifficultyPlugin();
  };

  return (
      <CustomSelect value={selectedDifficulty} onChange={handleChange} options={getDifficulties()} />
  );
};

export default SongDifficulties;