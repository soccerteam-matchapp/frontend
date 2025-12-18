import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/team.css";
import {
  ensureMockTeams,
  getCurrentUser,
  getTeamById,
  isLeader,
  promoteToLeader,
  removeMember,
  updateTeamFields,
  deleteTeam,
  getLeader,
  getMembersWithoutLeader,
} from "../services/teamStore.js";

/* ───────── 공용 확인 모달 ───────── */
function ConfirmModal({
  open,
  text,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}) {
  const cardRef = useRef(null);

  // Escape로 닫기 + 첫 버튼 포커스
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      cardRef.current?.querySelector("button")?.focus();
    }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div
      className="tm-confirm-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="tm-confirm-card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tm-confirm-text">{text}</div>
        <div className="tm-confirm-actions">
          <button className="tm-confirm-no" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="tm-confirm-yes" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeamManagePage() {
  const { id } = useParams(); // ✅ 팀 id
  const nav = useNavigate();
  const me = useMemo(() => getCurrentUser(), []);
  const [team, setTeam] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rowMenu, setRowMenu] = useState(null);

  // 확인 모달 상태
  // type: 'delete-team' | 'leave-team' | 'promote' | 'kick'
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    ensureMockTeams();
    setTeam(getTeamById(id));
  }, [id]);

  const leader = team && isLeader(team.id, me.id);
  const isMember =
    !!team &&
    Array.isArray(team.members) &&
    team.members.some((m) => m.id === me.id);

  if (!team) {
    return (
      <div className="app-root">
        <div className="safe-top" />
        <main className="team-manage">
          <div className="tm-header">
            <button className="tm-back" onClick={() => nav(-1)} aria-label="뒤로">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19L8 12L15 5"
                  stroke="#111"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="tm-title">팀 관리</div>
            <div />
          </div>
          <div style={{ padding: 16 }}>팀이 없습니다.</div>
        </main>
      </div>
    );
  }

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = updateTeamFields(team.id, { logoUrl: reader.result });
      setTeam(next);
    };
    reader.readAsDataURL(file);
  };

  const onFieldChange = (key, val) => {
    const next = updateTeamFields(team.id, { [key]: val });
    setTeam(next);
  };

  // ── 상단 메뉴 액션들 ─────────────────────────
  const openDeleteTeam = () => {
    setMenuOpen(false);
    setConfirm({ type: "delete-team" });
  };

  const doDeleteTeam = () => {
    deleteTeam(team.id);
    setConfirm(null);
    nav("/teams", { replace: true });
  };

  const openLeaveTeam = () => {
    setMenuOpen(false);
    setConfirm({ type: "leave-team" });
  };

  const doLeaveTeam = () => {
    // 현재 사용자 팀에서 제거
    removeMember(team.id, me.id);
    setConfirm(null);
    nav("/teams", { replace: true });
  };

  const doPromote = (memberId) => {
    promoteToLeader(team.id, memberId);
    setTeam(getTeamById(team.id));
    setRowMenu(null);
  };
  const doKick = (memberId) => {
    removeMember(team.id, memberId);
    setTeam(getTeamById(team.id));
    setRowMenu(null);
  };

  const leaderRow = getLeader(team.id);
  const memberRows = getMembersWithoutLeader(team.id);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setRowMenu(null);
  };

  // 멤버용 모달 오프너
  const openPromoteModal = (member) => {
    setRowMenu(null);
    setConfirm({ type: "promote", member });
  };
  const openKickModal = (member) => {
    setRowMenu(null);
    setConfirm({ type: "kick", member });
  };

  // 모달 텍스트/확인 핸들러
  const modalConfig = (() => {
    if (!confirm) return null;
    if (confirm.type === "delete-team") {
      return {
        text: `정말로 팀을 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`,
        confirmLabel: "삭제",
        onConfirm: doDeleteTeam,
      };
    }
    if (confirm.type === "leave-team") {
      return {
        text: `정말로 팀에서 나가시겠어요?`,
        confirmLabel: "나가기",
        onConfirm: doLeaveTeam,
      };
    }
    if (confirm.type === "promote") {
      return {
        text: `정말로 ${confirm.member?.name}님을 팀장으로 승격할까요?`,
        confirmLabel: "승격",
        onConfirm: () => {
          doPromote(confirm.member.id);
          setConfirm(null);
        },
      };
    }
    if (confirm.type === "kick") {
      return {
        text: `정말로 ${confirm.member?.name}님을 내보낼까요?`,
        confirmLabel: "내보내기",
        onConfirm: () => {
          doKick(confirm.member.id);
          setConfirm(null);
        },
      };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })();

  return (
    <div className="app-root" onClick={closeAllMenus}>
      <div className="safe-top" />
      <main className="team-manage" onClick={(e) => e.stopPropagation()}>
        <div className="tm-header">
          <button className="tm-back" onClick={() => nav(-1)} aria-label="뒤로">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 19L8 12L15 5"
                stroke="#111"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="tm-title">팀 관리</div>

          <button
            className="tm-kebab"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="더보기"
          >
            <span className="tm-kebab-dot" />
            <span className="tm-kebab-dot" />
            <span className="tm-kebab-dot" />
          </button>

          {/* ✅ 팀장/멤버 모두 표시. 항목만 다름 */}
          {menuOpen && (
            <div className="tm-topmenu" onClick={(e) => e.stopPropagation()}>
              {leader ? (
                <button className="tm-topmenu-item danger" onClick={openDeleteTeam}>
                  팀 삭제하기
                </button>
              ) : (
                isMember && (
                  <button className="tm-topmenu-item danger" onClick={openLeaveTeam}>
                    팀 나가기
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <section className="tm-info">
          <div className="tm-info-left">
            <label className="tm-logo">
              {team.logoUrl ? (
                <img src={team.logoUrl} alt="팀 로고" />
              ) : (
                <span className="tm-logo-initial">
                  {(team.name?.[0] || "A").toUpperCase()}
                </span>
              )}
              {leader && (
                <input
                  type="file"
                  accept="image/*"
                  className="tm-avatar-input"
                  onChange={onLogoChange}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                />
              )}
            </label>
          </div>

          <div className="tm-info-right">
            <div className="tm-fieldRow">
              <span className="tm-fieldLabel">팀명</span>
              {leader ? (
                <input
                  className="tm-meta-input"
                  value={team.name || ""}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  placeholder="팀명"
                />
              ) : (
                <span className="tm-fieldValue">{team.name || "-"}</span>
              )}
            </div>
            <div className="tm-fieldRow">
              <span className="tm-fieldLabel">팀 소개</span>
              {leader ? (
                <input
                  className="tm-meta-input"
                  value={team.intro || ""}
                  onChange={(e) => onFieldChange("intro", e.target.value)}
                  placeholder="팀 소개"
                />
              ) : (
                <span className="tm-fieldValue">{team.intro || "-"}</span>
              )}
            </div>
            <div className="tm-fieldRow">
              <span className="tm-fieldLabel">활동 지역</span>
              {leader ? (
                <input
                  className="tm-meta-input"
                  value={team.region || ""}
                  onChange={(e) => onFieldChange("region", e.target.value)}
                  placeholder="활동 지역"
                />
              ) : (
                <span className="tm-fieldValue">{team.region || "-"}</span>
              )}
            </div>
          </div>
        </section>

        <section className="tm-listWrap">
          <div className="tm-chipRow">
            <span className="tm-chip">팀장</span>
          </div>
          {leaderRow && (
            <div className="tm-personRow">
              <div className="tm-personName">
                {leaderRow.name}
                <span className="tm-roleBadge">팀장</span>
              </div>
            </div>
          )}

          <div className="tm-chipRow mt8">
            <span className="tm-chip">멤버</span>
          </div>

          {memberRows.length ? (
            memberRows.map((m) => (
              <div className="tm-personRow" key={m.id}>
                <div className="tm-personName">{m.name}</div>

                {leader && (
                  <>
                    <button
                      className="tm-rowKebab"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowMenu((prev) => (prev === m.id ? null : m.id));
                      }}
                      aria-label="행 메뉴"
                    >
                      <span className="tm-kebab-dot" />
                      <span className="tm-kebab-dot" />
                      <span className="tm-kebab-dot" />
                    </button>

                    {rowMenu === m.id && (
                      <div className="tm-rowmenu" onClick={(e) => e.stopPropagation()}>
                        <button className="tm-rowmenu-item" onClick={() => openPromoteModal(m)}>
                          팀장 승격
                        </button>
                        <button className="tm-rowmenu-item danger" onClick={() => openKickModal(m)}>
                          내보내기
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="tm-empty">팀원이 없습니다.</div>
          )}
        </section>
      </main>

      {/* 확인 모달 */}
      <ConfirmModal
        open={!!confirm}
        text={modalConfig?.text}
        confirmLabel={modalConfig?.confirmLabel}
        onConfirm={modalConfig?.onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
