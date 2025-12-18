// src/pages/TeamPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMatches, isMine } from "../services/matchStore.js";
import { getTeamsForUser, getCurrentUser } from "../services/teamStore.js";

function getUserName() {
  try {
    const raw = localStorage.getItem("sportly:user");
    if (!raw) return "사용자";
    const u = JSON.parse(raw);
    return u?.name || "사용자";
  } catch {
    return "사용자";
  }
}

function getMyMonthlyMatchCount() {
  const list = (getMatches?.() || []);
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  return list.filter((mt) => {
    if (!(isMine?.(mt))) return false;
    if (!mt.matchDate) return false;
    const [yy, mm] = mt.matchDate.split("-").map(Number);
    return yy === y && mm === m;
  }).length;
}

export default function TeamPage() {
  const [name, setName] = useState("사용자");
  const [teams, setTeams] = useState([]);

  // 현재 사용자
  const me = useMemo(() => {
    try {
      const u = getCurrentUser?.();
      return u && u.id ? u : { id: "me", name: "사용자" };
    } catch {
      return { id: "me", name: "사용자" };
    }
  }, []);

  const monthlyMax = 10;
  const monthlyCount = useMemo(() => getMyMonthlyMatchCount(), []);
  const progress = Math.max(
    0,
    Math.min(100, Math.round((monthlyCount / monthlyMax) * 100))
  );

  useEffect(() => {
    setName(getUserName());
    const list = getTeamsForUser?.(me.id) || [];
    setTeams(Array.isArray(list) ? list : []);
  }, [me.id]);

  return (
    <div className="app-root">
      <div className="safe-top" />
      <main className="team-screen">
        <div className="section-title-chip">내 정보</div>
        <h1 className="hello-title">
          {name}
          <span>님 안녕하세요!</span>
        </h1>

        <section className="stat-card">
          <div className="stat-title">이번달에 뛴 매치</div>
          <div className="stat-sub">총 {monthlyCount}개</div>
          <div className="stat-bar">
            <div className="stat-bar__fill" style={{ width: `${progress}%` }} />
            <div className="stat-bar__ticks">
              <span>0개</span>
              <span>{monthlyMax}개</span>
            </div>
          </div>
        </section>

        <div className="section-title-chip mt-20">팀 정보</div>

        {/* 팀이 없으면 회색 박스 2개만 */}
        <section className="team-grid">
          {teams.length === 0 ? (
            <>
              <div className="team-card" />
              <div className="team-card" />
            </>
          ) : (
            <>
              {teams.map((t) => (
                <Link key={t.id} className="teamcard--real" to={`/teams/manage/${t.id}`}>
                  <div className="teamcard-logo">
                    {t.logoUrl ? (
                      <img src={t.logoUrl} alt="팀 로고" />
                    ) : (
                      <span className="teamcard-initial">
                        {(t.name?.[0] || "A").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="teamcard-name">{t.name}</div>
                </Link>
              ))}
              {Array.from({ length: Math.max(0, 2 - teams.length) }).map((_, i) => (
                <div key={`ph-${i}`} className="team-card" />
              ))}
            </>
          )}
        </section>

        <section className="team-actions">
          <Link className="action-row" to="/teams/new">
            <span>팀 만들기</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#9AA0A6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link className="action-row" to="/teams/join">
            <span>팀 가입하기</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#9AA0A6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      </main>

      
    </div>
  );
}
