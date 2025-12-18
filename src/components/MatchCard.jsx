import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchCard({ matchId = 1, matchData }) {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate(`/match/${matchId}`);
  };

  return (
    <div className="match-card-horizontal">
      <div className="circle-icon">
        <div className="circle">A</div>
        <span style={{ margin: '0 6px', fontWeight: 600 }}>VS</span>
        <div className="circle">A</div>
      </div>

      <p className="small-date">{matchData?.date}</p>
      <p className="small-location">{matchData?.location}</p>
      <p className="small-count">{matchData?.count}</p>

      <button
        className="primary-btn-small"
        onClick={handleJoinClick}
      >
        참여하기
      </button>
    </div>
  );
}
