import React, { useState } from 'react';
import '../index.css';

export default function MainMatchCard({
  matchData,
  currentIndex,
  totalMatches,
  onNext,
  onPrev,
  isPrevDisabled,
  isNextDisabled,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="main-match">
      <div className="match-header">
        <h2 className="match-date">{matchData.date}</h2>
        <p className="match-text">예정된 매치가 있어요!</p>
      </div>

      <div className="dot-indicator">
        {Array.from({ length: totalMatches }).map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
          >
            &bull; {/* 작은 점 문자 */}
          </span>
        ))}
      </div>

      <div className="match-card">
        <button
          className={`arrow left ${isPrevDisabled ? 'disabled' : ''}`}
          onClick={onPrev}
          disabled={isPrevDisabled} // 실제 HTML disabled 속성 적용
        >
          &lt;
        </button>

        <div className="match-content">
          {/* 왼쪽 팀 */}
          <div className="team-side">
            <div className="team-circle">A</div>
            <p className="team-label">{matchData.teamA}</p>
            <ul>
              {(matchData.membersA || [])
                .slice(0, expanded ? 11 : 4)
                .map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
            </ul>
          </div>

          {/* 중앙 */}
          <div className="match-center">
            <h3>11 vs 11</h3>
            <p>{matchData.location}</p>
          </div>

          {/* 오른쪽 팀 */}
          <div className="team-side">
            <div className="team-circle">A</div>
            <p className="team-label">{matchData.teamB}</p>
            <ul>
              {(matchData.membersB || [])
                .slice(0, expanded ? 11 : 4)
                .map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
            </ul>
          </div>
        </div>

        <button
          className={`arrow right ${isNextDisabled ? 'disabled' : ''}`}
          aria-label="next match"
          onClick={onNext}
          disabled={isNextDisabled} // 실제 HTML disabled 속성 적용
        >
          &gt;
        </button>

        {/* 펼치기 버튼 */}
        <div className="expand-area">
          <button
            className="expand-btn"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? '접기' : '펼치기'}
          </button>
        </div>
      </div>
    </div>
  );
}
