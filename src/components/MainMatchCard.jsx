// src/components/MainMatchCard.jsx
import React, { useState, useMemo } from 'react'
import '../index.css'

export default function MainMatchCard({
  matchData,
  currentIndex,
  totalMatches,
  onNext,
  onPrev,
  isPrevDisabled,
  isNextDisabled,
}) {
  const [expanded, setExpanded] = useState(false)

  const membersA = matchData.membersA || []
  const membersB = matchData.membersB || []

  const displayCount = expanded
    ? Math.max(membersA.length, membersB.length)
    : 4

  const rowHeight = 36
  const stripesHeight = useMemo(
    () => displayCount * rowHeight,
    [displayCount]
  )

  return (
    <div className="main-match">
      <div className="match-header">
        <h2 className="match-date">{matchData.date}</h2>
        <p className="match-text">예정된 매치가 있어요!</p>
      </div>

      <div className="dot-indicator">
        {Array.from({ length: totalMatches }).map((_, i) => (
          <span key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="match-card">
        <button
          className={`arrow left ${isPrevDisabled ? 'disabled' : ''}`}
          onClick={onPrev}
          disabled={isPrevDisabled}
        >
          &lt;
        </button>

        {/*  상단 팀 정보 */}
        <div className="match-info-top grid-3col">
          <div className="team-col">
            <div className="team-circle">A</div>
            <p className="team-label">{matchData.teamA}</p>
          </div>

          <div className="center-col">
            <h3>11 vs 11</h3>
            <p>{matchData.location}</p>
          </div>

          <div className="team-col">
            <div className="team-circle">A</div>
            <p className="team-label">{matchData.teamB}</p>
          </div>
        </div>

        {/*  선수 명단 */}
        <div
          className="match-stripes-area grid-3col"
          style={{ height: `${stripesHeight}px` }}
        >
          <ul className="player-col">
            {Array.from({ length: displayCount }).map((_, i) => (
              <li key={`A-${i}`}>{membersA[i] || ''}</li>
            ))}
          </ul>

          <div className="center-col" />

          <ul className="player-col">
            {Array.from({ length: displayCount }).map((_, i) => (
              <li key={`B-${i}`}>{membersB[i] || ''}</li>
            ))}
          </ul>
        </div>

        {!expanded && <div className="fade-overlay-bottom" />}

        <button
          className={`arrow right ${isNextDisabled ? 'disabled' : ''}`}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          &gt;
        </button>

        <div className="expand-area-wrapper">
          <button
            className="expand-btn"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? '접기' : '펼치기'}
          </button>
        </div>
      </div>
    </div>
  )
}
