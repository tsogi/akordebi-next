import React, { useState, useEffect } from "react";
import styles from "./SongDifficulties.module.css";

const difficulties = [
  { name: "Very Easy", value: 1 },
  { name: "Easy", value: 2 },
  { name: "Medium", value: 3 },
  { name: "Hard", value: 4 },
  { name: "Very Hard", value: 5 },
];

const SongDifficulties = (props) => {
  const [existingDifficulty, setExistingDifficulty] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    refreshDifficultyPlugin();
  }, [props.songId]);

  async function refreshDifficultyPlugin() {
    let response = await (
      await fetch(`/api/difficulties/${props.songId}`)
    ).json();
    let data = response.data;

    // console.log(data.totalCount);

    if (data?.existingDifficulty?.difficulty) {
      const difficulty = data.existingDifficulty?.difficulty;
      setExistingDifficulty(difficulty);
      setSelectedDifficulty(difficulty);
    }
  }

  const handleOptionClick = async (difficulty) => {
    setSelectedDifficulty(difficulty);
    if (!existingDifficulty) {
      await fetch(`/api/difficulties/${props.songId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });
    } else {
      await fetch(`/api/difficulties/${props.songId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });
    }
    refreshDifficultyPlugin();

    setShowOptions(false);
  };

  const handleSelectClick = () => {
    setShowOptions(!showOptions);
  };

  const selectedDifficultyName =
    selectedDifficulty === -1
      ? "Select Difficulty"
      : difficulties.find(
          (difficulty) => difficulty.value === selectedDifficulty
        )?.name;

  return (
    <div className={styles.select} onClick={handleSelectClick}>
      <div className={styles.select_styled}>{selectedDifficultyName}</div>
      {showOptions && (
        <ul className={styles.select_options}>
          {difficulties.map((difficulty, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(difficulty.value)}
              className={
                selectedDifficulty === difficulty.value
                  ? styles.is_selected
                  : ""
              }
            >
              {difficulty.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongDifficulties;
