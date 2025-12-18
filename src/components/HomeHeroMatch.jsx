import React, { useMemo, useState } from "react";

/** 홈 히어로용 매치 카드 (가로 캐러셀 슬라이드 한 장) */
export default function HomeHeroMatch({ matchData, onPrev, onNext, isPrevDisabled, isNextDisabled }) {
  const [expanded, setExpanded] = useState(false);

  const membersA = matchData.membersA || [];
  const membersB = matchData.membersB || [];
  const displayCount = expanded ? Math.max(membersA.length, membersB.length) : 4;

  const rowHeight = 30;
  const stripesHeight = useMemo(() => displayCount * rowHeight, [displayCount]);

  return (
    <div className="hm-slide">
      <div className="hm-card">
        {/* 상단 정보 */}
        <div className="hm-info-top">
          <div className="hm-team-side">
            <div className="hm-team-circle">A</div>
            <p className="hm-team-label">{matchData.teamA}</p>
          </div>
          <div className="hm-center">
            <h3>11 vs 11</h3>
            <p>{matchData.location}</p>
          </div>
          <div className="hm-team-side">
            <div className="hm-team-circle">A</div>
            <p className="hm-team-label">{matchData.teamB}</p>
          </div>
        </div>

        {/* 좌/우 화살표 */}
        <button
          className={`hm-arrow hm-left ${isPrevDisabled ? "is-disabled" : ""}`}
          onClick={onPrev}
          disabled={isPrevDisabled}
          aria-label="이전"
        >
          &lt;
        </button>
        <button
          className={`hm-arrow hm-right ${isNextDisabled ? "is-disabled" : ""}`}
          onClick={onNext}
          disabled={isNextDisabled}
          aria-label="다음"
        >
          &gt;
        </button>

        {/* 줄무늬(선수 목록) */}
        <div className="hm-stripes" style={{ height: `${stripesHeight}px` }}>
          <div className="hm-players" style={{ width: "33%", textAlign: "center" }}>
            <ul>
              {Array.from({ length: displayCount }).map((_, i) => (
                <li key={`A-${i}`}>{membersA[i] || ""}</li>
              ))}
            </ul>
          </div>
          <div className="hm-center" style={{ width: "33%" }} />
          <div className="hm-players" style={{ width: "33%", textAlign: "center" }}>
            <ul>
              {Array.from({ length: displayCount }).map((_, i) => (
                <li key={`B-${i}`}>{membersB[i] || ""}</li>
              ))}
            </ul>
          </div>
        </div>

        {!expanded && <div className="hm-fade-bottom" />}

        {/* 펼치기 */}
        <div className="hm-expand-wrap">
          <button className="hm-expand" onClick={() => setExpanded(v => !v)}>
            {expanded ? "접기" : "펼치기"}
          </button>
        </div>
      </div>
    </div>
  );
}
