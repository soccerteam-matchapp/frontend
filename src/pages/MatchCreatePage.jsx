import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMatch } from "../services/matchStore.js";
import { getCurrentUser, getTeamsForUser } from "../services/teamStore.js";

export default function MatchCreatePage() {
  const nav = useNavigate();

  // 현재 사용자 & 내가 팀장인 팀
  const me = useMemo(() => getCurrentUser(), []);
  const [leaderTeams, setLeaderTeams] = useState([]);
  const hasLeaderTeam = leaderTeams.length > 0;
  const selectedTeam = leaderTeams[0] || null;

  // 폼 상태
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [place, setPlace] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [skill, setSkill] = useState("");
  const [fieldCost, setFieldCost] = useState("");
  const [proCount, setProCount] = useState("");

  // 팀명은 자동 포함(팀장 팀의 첫 번째 팀)
  const teamName = selectedTeam?.name || "";

  useEffect(() => {
    try {
      const mine = (getTeamsForUser(me.id) || []).filter(
        (t) => t.leaderId === me.id
      );
      setLeaderTeams(mine);
    } catch {
      setLeaderTeams([]);
    }
  }, [me.id]);

  // ✅ 필수값 체크
  const isDateValid = !!matchDate;
  const isPlaceValid = place.trim().length > 0;
  const isPlayerValid = /^[0-9]+$/.test(playerCount.trim());

  // 제출 가능 여부: 팀장 팀이 있어야 하고, 필수 입력이 유효해야 함
  const isFormValid =
    hasLeaderTeam && isDateValid && isPlaceValid && isPlayerValid;

  // 버튼 위 에러 메시지
  let errorMessage = "";
  if (!hasLeaderTeam) {
    errorMessage = "팀장 권한이 있는 팀이 없어 매칭을 생성할 수 없습니다.";
  } else if (!isDateValid) {
    errorMessage = "날짜 형식이 일치하지 않습니다.";
  } else if (!isPlaceValid) {
    errorMessage = "장소 형식이 일치하지 않습니다.";
  } else if (!isPlayerValid) {
    errorMessage = "경기 인원 형식이 일치하지 않습니다.";
  }

  const handleSave = (e) => {
    e?.preventDefault?.();
    if (!isFormValid) return;

    addMatch({
      matchDate,
      matchTime,
      place,
      playerCount,
      skill,
      fieldCost,
      proCount,
      teamName, // ← 팀장 팀의 이름을 자동 포함
    });

    nav("/matches");
  };

  return (
    <div className="app-root create-root">
      <div className="safe-top" />

      {/* ✅ 헤더: 팀 만들기(TeamNewPage)와 동일한 구조/아이콘, 타이틀만 변경 */}
      <header className="tn-header">
        <button className="tn-back" onClick={() => nav(-1)} aria-label="뒤로">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 19L8 12L15 5"
              stroke="#121212"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="tn-title">매칭 생성</h1>
        <div className="tn-right-spacer" />
      </header>

      <main className="create-body">
        <form onSubmit={handleSave} className="create-form">
          {/* 팀 표시/안내 */}
          <label className="create-field">
            <span className="create-label required">팀</span>

            {/* 팀장 팀이 없는 경우: 2줄 안내 문구 */}
            {!hasLeaderTeam ? (
              <div className="create-team-note">
              <p className="note-line">팀장 권한이 있는 팀이 없습니다.</p>
              <p className="note-sub">팀장만 매칭을 생성할 수 있어요.</p>
              </div>
              ) : (
              // 팀장 팀이 있는 경우: 읽기 전용으로 팀명 노출
              <div
                className="create-input"
                style={{
                  borderBottom: "1px solid #d1d5db",
                  padding: "10px 0",
                  color: "#111827",
                }}
              >
                {teamName}
              </div>
            )}
          </label>

          {/* 날짜 + 시간 */}
          <div className="create-row-2">
            <label className="create-field">
              <span className="create-label required">날짜</span>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="create-input"
              />
            </label>
            <label className="create-field">
              <span className="create-label">시간</span>
              <input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className="create-input"
              />
            </label>
          </div>

          {/* 장소 */}
          <label className="create-field">
            <span className="create-label required">장소</span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="create-input"
              placeholder="예) 잠실 A구장"
            />
          </label>

          {/* 경기 인원 */}
          <label className="create-field">
            <span className="create-label required">경기 인원</span>
            <input
              type="text"
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              className="create-input"
              placeholder="예) 11"
              inputMode="numeric"
            />
          </label>

          {/* 팀 실력 */}
          <label className="create-field">
            <span className="create-label">팀 실력</span>
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="create-input"
              placeholder="예) 상 / 중 / 하"
            />
          </label>

          {/* 구장비용 */}
          <label className="create-field">
            <span className="create-label">구장비용</span>
            <input
              type="number"
              min="0"
              value={fieldCost}
              onChange={(e) => setFieldCost(e.target.value)}
              className="create-input"
              placeholder="예) 80000"
            />
          </label>

          {/* 선출 인원수 */}
          <label className="create-field">
            <span className="create-label">선출 인원수</span>
            <input
              type="number"
              min="0"
              value={proCount}
              onChange={(e) => setProCount(e.target.value)}
              className="create-input"
              placeholder="예) 1"
            />
          </label>

          {/* 버튼 위 에러 영역 */}
          <div className="create-error-slot">
            {errorMessage && (
              <p className="create-error-text">{errorMessage}</p>
            )}
          </div>

          {/* 생성 버튼 */}
          <button
            type="submit"
            className={`create-submit ${!isFormValid ? "is-disabled" : ""}`}
            disabled={!isFormValid}
          >
            매칭 생성하기
          </button>
        </form>
      </main>
    </div>
  );
}
