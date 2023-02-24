import React, { useState, useEffect } from 'react';
import { IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import styles from "./SongVotes.module.css";

const SongVotes = (props) => {
  const [votedUp, setVotedUp] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votedDown, setVotedDown] = useState(false);

  useEffect(() => {
    console.log(props.songId)
    refreshVotePlugin();
  }, [props.songId]);

  async function refreshVotePlugin(){
    let response = await (await fetch(`/api/votes/${props.songId}`)).json();
    let data = response.data;

    setTotalVotes(data.totalCount);

    if (data?.existingVote?.vote) {
      const vote = data.existingVote.vote;

      if (vote == 1) {
        setVotedUp(true);
        setVotedDown(false);
      } else if (vote == -1) {
        setVotedUp(false);
        setVotedDown(true);
      }
    }
  }

  let handleUpVote = async () => {
    if(votedDown) {
      await fetch(`/api/votes/${props.songId}`, { method: "PUT", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ vote: 1 }) })
      refreshVotePlugin();
      return;
    }
    await fetch(`/api/votes/${props.songId}`, { method: "POST", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ vote: 1 }) })
    refreshVotePlugin();
  };

  const handleDownVote = async () => {
    if(votedUp) {
      await fetch(`/api/votes/${props.songId}`, { method: "PUT", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ vote: -1 }) })
      refreshVotePlugin();
      return;
    }
    await fetch(`/api/votes/${props.songId}`, { method: "POST", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ vote: -1 }) })
    refreshVotePlugin();
  };

  return (
    <div className={styles.votesPlugin}>
      <IconButton onClick={handleUpVote} disabled={votedUp} color={votedUp ? 'primary' : 'default'}>
        <ThumbUp />
      </IconButton>
      <Typography variant="body1" component="div">{totalVotes}</Typography>
      <IconButton onClick={handleDownVote} disabled={votedDown} color={votedDown ? 'secondary' : 'default'}>
        <ThumbDown />
      </IconButton>
    </div>
  );
};

export default SongVotes;