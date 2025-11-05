import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function MatchCard({ matchId = 1 }) {
  //matchId 임시로 1로 지정.
  const navigate = useNavigate();
  const handleJoinClick = () => {
    navigate('/match/${matchId}');
  };
  return (
    <div className="match-card-small">
      <div className="circle-icon">
        <div className="circle">A</div>
        VS
        <div className="circle">A</div>
      </div>
      <p className="small-date">11월 9일 12:00</p>
      <p className="small-location">잠실 A구장</p>
      <p className="small-count">0 / 11</p>
      <button
        className="primary-btn-small"
        onClick={handleJoinClick}
        style={{
          marginTop: '0.5rem',
          width: '100%',
          background: '#FFD84D',
          border: 'none',
          borderRadius: '10px',
          padding: '0.4rem 0',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        참여하기
      </button>
    </div>
  );
}
