// src/pages/TeamJoinDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/team.css";
import {
  getCurrentUser,
  getTeamById,
  getLeader,
  getMembersWithoutLeader,
  addMember,
  isMember,
} from "../services/teamStore.js";

export default function TeamJoinDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const me = useMemo(() => getCurrentUser(), []);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    setTeam(getTeamById(id));
  }, [id]);

  if (!team) {
    return (
      <div className="app-root">
        <div className="safe-top" />
        <main className="team-manage">
          <div className="tm-header">
            <button className="tm-back" onClick={() => nav(-1)} aria-label="뒤로">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15 19L8 12L15 5" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* 제목/케밥 없음 */}
            <div />
            <div />
          </div>
          <div style={{ padding: 16 }}>팀이 없습니다.</div>
        </main>
      </div>
    );
  }

  const leaderRow = getLeader(team.id);
  const memberRows = getMembersWithoutLeader(team.id);

  const onJoin = () => {
    if (isMember(team.id, me.id)) {
      alert("이미 이 팀의 멤버입니다.");
      return;
    }
    addMember(team.id, { id: me.id, name: me.name || "사용자" });
    alert("팀에 가입되었습니다.");
    nav(`/teams/manage/${team.id}`, { replace: true });
  };

  return (
    <div className="app-root">
      <div className="safe-top" />
      <main className="team-manage">
        <div className="tm-header">
          <button className="tm-back" onClick={() => nav(-1)} aria-label="뒤로">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 19L8 12L15 5" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* 제목/케밥 제거 (가운데/오른쪽 비움) */}
          <div />
          <div />
        </div>

        {/* 상단 정보 영역 (읽기 전용) */}
        <section className="tm-info">
          <div className="tm-info-left">
            <div className="tm-logo">
              {team.logoUrl ? (
                <img src={team.logoUrl} alt="팀 로고" />
              ) : (
                <span className="tm-logo-initial">
                  {(team.name?.[0] || "A").toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="tm-info-right">
            <div className="tm-fieldRow">
              <span className="tm-fieldLabel">팀명</span>
              <span className="tm-fieldValue">{team.name || "-"}</span>
            </div>
            <div className="tm-fieldRow">
              <span className="tm-fieldLabel">팀 소개</span>
              <span className="tm-fieldValue">{team.intro || "-"}</span>
            </div>
            <div className="tm-fieldRow">
              <span className="tm-fieldLabel">활동 지역</span>
              <span className="tm-fieldValue">{team.region || "-"}</span>
            </div>
          </div>
        </section>

        {/* 팀장/멤버 리스트 */}
        <section className="tm-listWrap">
          <div className="tm-chipRow">
            <span className="tm-chip">팀장</span>
          </div>
          {leaderRow ? (
            <div className="tm-personRow">
              <div className="tm-personName">
                {leaderRow.name}
                <span className="tm-roleBadge">팀장</span>
              </div>
            </div>
          ) : (
            <div className="tm-empty">팀장 정보가 없습니다.</div>
          )}

          <div className="tm-chipRow mt8">
            <span className="tm-chip">멤버</span>
          </div>

          {memberRows.length ? (
            memberRows.map((m) => (
              <div className="tm-personRow" key={m.id}>
                <div className="tm-personName">{m.name}</div>
              </div>
            ))
          ) : (
            <div className="tm-empty">팀원이 없습니다.</div>
          )}
        </section>

        {/* 하단 가입하기 버튼 */}
        <div className="tn-cta" style={{ marginTop: 20 }}>
          <button
            type="button"
            className="tn-submit"
            onClick={onJoin}
          >
            <span className="tn-submit-label">가입하기</span>
          </button>
        </div>
      </main>
    </div>
  );
}
