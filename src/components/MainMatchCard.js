// src/components/MainMatchCard.js

import React, { useState, useMemo } from 'react';
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
  const [expanded, setExpanded] = useState(false); // 팀원 목록이 없을 경우를 대비해 빈 배열을 사용

  const membersA = matchData.membersA || [];
  const membersB = matchData.membersB || []; // 표시할 최대 팀원 수 계산 (전체 또는 4명)
  const displayCount = expanded
    ? Math.max(membersA.length, membersB.length)
    : 4;

  const rowHeight = 30;

  const stripesHeight = useMemo(() => {
    return displayCount * rowHeight;
  }, [displayCount]);

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
            &bull;
          </span>
        ))}
      </div>
      <div className="match-card">
        {/* --- 캐러셀 화살표 --- */}
        <button
          className={`arrow left ${isPrevDisabled ? 'disabled' : ''}`}
          onClick={onPrev}
          disabled={isPrevDisabled}
        >
          &lt;
        </button>
        {/* 1. 상단 정보 영역 (줄무늬가 없는 영역) */}
        <div className="match-info-top">
          {/* 왼쪽 팀 서클과 팀명 */}
          <div className="team-side top-side">
            <div className="team-circle">A</div>
            <p className="team-label">{matchData.teamA}</p>
          </div>
          {/* 중앙 VS 및 장소 */}{' '}
          <div className="match-center top-center">
            <h3>11 vs 11</h3> <p>{matchData.location}</p>
          </div>
          {/* 오른쪽 팀 서클과 팀명 */}
          <div className="team-side top-side">
            <div className="team-circle">A</div>
            <p className="team-label">{matchData.teamB}</p>
          </div>
        </div>
        {/* 2. 줄무늬 영역 (선수 목록) */}
        <div
          className="match-stripes-area"
          style={{ height: `${stripesHeight}px` }}
        >
          {/* 왼쪽 팀원 목록 */}
          <div className="team-side player-side">
            <ul>
              {Array.from({ length: displayCount }).map((_, i) => (
                <li key={`A-${i}`}>{membersA[i] || ''}</li>
              ))}
            </ul>
          </div>
          {/* 중앙 빈 공간 (줄무늬 연결용) */}
          <div className="match-center player-center"></div>
          {/* 오른쪽 팀원 목록 */}
          <div className="team-side player-side">
            <ul>
              {Array.from({ length: displayCount }).map((_, i) => (
                <li key={`B-${i}`}>{membersB[i] || ''}</li>
              ))}
            </ul>
          </div>
        </div>
        {!expanded && <div className="fade-overlay-bottom"></div>}
        <button
          className={`arrow right ${isNextDisabled ? 'disabled' : ''}`}
          aria-label="next match"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          &gt;
        </button>
        {/* 3. 펼치기 버튼 영역 */}
        <div className="expand-area-wrapper">
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
