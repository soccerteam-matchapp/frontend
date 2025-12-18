// src/pages/TeamJoinPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams } from "../services/teamStore.js";
import "../styles/team.css";

export default function TeamJoinPage() {
  const nav = useNavigate();
  const [invite, setInvite] = useState("");
  const [allTeams, setAllTeams] = useState([]);

  useEffect(() => {
    setAllTeams(getTeams() || []);
  }, []);

  return (
    <div className="app-root">
      <div className="safe-top" />

      {/* TeamNewPage와 동일한 헤더 형태 */}
      <header className="tn-header">
        <button className="tn-back" onClick={() => nav(-1)} aria-label="뒤로">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="tn-title">팀 가입하기</h1>
        <div className="tn-right-spacer" />
      </header>

      <main className="tn-body">
        {/* 초대코드: 라벨 한 줄 */}
        <div className="tn-section-title" style={{ marginTop: 0, whiteSpace: "nowrap" }}>
          초대코드
        </div>
        <input
          className="tn-input"
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          placeholder=""
          style={{ width: "100%" }}
        />

        {/* 팀 둘러보기: 서버에 있는 팀만 노출(없으면 아무것도 안 보임) */}
        <div className="tn-section-title" style={{ marginTop: 24, whiteSpace: "nowrap" }}>
          팀 둘러보기
        </div>

        {allTeams.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 6,
            }}
          >
            {allTeams.map((t) => (
              <button
                key={t.id}
                type="button"
                className="teamcard--real"
                style={{ width: "100%", height: 160, cursor: "pointer" }}
                onClick={() => nav(`/teams/join/${t.id}`)}
              >
                <div className="teamcard-logo" style={{ width: 72, height: 72 }}>
                  {t.logoUrl ? (
                    <img src={t.logoUrl} alt={`${t.name} 로고`} />
                  ) : (
                    <span className="teamcard-initial">
                      {(t.name?.[0] || "A").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="teamcard-name">{t.name}</div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
