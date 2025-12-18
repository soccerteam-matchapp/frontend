// src/services/teamStore.js
// 다중 팀 배열 구조 (로컬스토리지)
// 이전 단일 키 'sportly:team'은 시작 시 자동 마이그레이션

const TEAMS_KEY = "sportly:teams";
const LEGACY_TEAM_KEY = "sportly:team";
const USER_KEY = "sportly:user";

// ───────── 사용자 ─────────
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      const anon = { id: "me", name: "사용자" };
      localStorage.setItem(USER_KEY, JSON.stringify(anon));
      return anon;
    }
    return JSON.parse(raw);
  } catch {
    return { id: "me", name: "사용자" };
  }
}

export function setCurrentUserName(name) {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const u = raw ? JSON.parse(raw) : { id: "me" };
    u.name = name ?? "사용자";
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  } catch {}
}

// ───────── Storage 접근 유틸 ─────────
function readLegacyTeam() {
  try {
    const raw = localStorage.getItem(LEGACY_TEAM_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw);
    // 단일 팀 스키마 → 다중 스키마로 변환
    if (!t.id) t.id = crypto.randomUUID();
    if (!Array.isArray(t.members)) {
      const me = getCurrentUser();
      t.members = [{ id: me.id, name: me.name || "사용자" }];
      t.leaderId = me.id;
    }
    return t;
  } catch {
    return null;
  }
}

function readTeams() {
  try {
    const raw = localStorage.getItem(TEAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTeams(arr) {
  try {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(arr || []));
  } catch {}
}

// 외부에서 직접 쓰고 싶을 때
export function getTeams() {
  // 레거시 마이그레이션
  const legacy = readLegacyTeam();
  if (legacy) {
    const curr = readTeams();
    if (!curr.some((t) => t.id === legacy.id)) {
      writeTeams([legacy, ...curr]);
    }
    localStorage.removeItem(LEGACY_TEAM_KEY);
  }
  return readTeams();
}

// 사용자별 팀 목록
export function getTeamsForUser(userId) {
  try {
    return getTeams().filter(
      (t) => Array.isArray(t.members) && t.members.some((m) => m.id === userId)
    );
  } catch {
    return [];
  }
}

// 전체 팀 비우기 (초기화 용)
export function clearAllTeams() {
  try {
    localStorage.removeItem(TEAMS_KEY);
  } catch {}
}

// ───────── 샘플 데이터 (개발용) ─────────
// 기본적으로 아무 것도 생성하지 않음.
// .env.local 등에 VITE_SEED=true 일 때 "한 번만" 샘플 생성.
export function ensureMockTeams() {
  if (
    !(
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_SEED === "true"
    )
  ) {
    return;
  }
  const teams = getTeams();
  if (teams.length) return;

  const me = getCurrentUser();
  const sample = {
    id: crypto.randomUUID(),
    name: "스포틀리 FC",
    intro: "즐겁게 뛰는 팀입니다!",
    region: "서울",
    logoUrl: "",
    leaderId: me.id,
    members: [
      { id: me.id, name: me.name || "사용자" },
      { id: "m2", name: "지은" },
      { id: "m3", name: "호준" },
    ],
  };
  writeTeams([sample]);
}

// ───────── CRUD ─────────
// REPLACE: createTeam 전체를 아래로 교체하세요
export function createTeam(payload) {
  const {
    name,
    intro = "",
    region = "",
    logoUrl = "",
    leaderId,
    members = [],
  } = payload || {};

  const me = getCurrentUser();                         // 현재 사용자
  const lid = leaderId || me.id;                       // 리더가 없으면 나
  const baseMembers = Array.isArray(members) ? [...members] : [];

  // 리더가 멤버 목록에 없으면 반드시 포함
  if (!baseMembers.some((m) => m?.id === lid)) {
    const leaderName =
      (baseMembers.find((m) => m?.id === lid)?.name) || me.name || "사용자";
    baseMembers.unshift({ id: lid, name: leaderName });
  }

  const id = crypto.randomUUID();
  const team = {
    id,
    name: name || "새 팀",
    intro,
    region,
    logoUrl,
    leaderId: lid,
    members: baseMembers,
  };

  const arr = getTeams();
  writeTeams([team, ...arr]);                          // 맨 앞으로 추가
  return team;
}


export function getTeamById(id) {
  return getTeams().find((t) => t.id === id) || null;
}

export function updateTeamFields(id, partial) {
  const arr = getTeams();
  const idx = arr.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  arr[idx] = { ...arr[idx], ...partial };
  writeTeams(arr);
  return arr[idx];
}

export function deleteTeam(id) {
  const arr = getTeams().filter((t) => t.id !== id);
  writeTeams(arr);
}

// ───────── 멤버/권한 ─────────
export function isLeader(teamId, userId) {
  const t = getTeamById(teamId);
  return !!(t && t.leaderId === userId);
}

export function getLeader(teamId) {
  const t = getTeamById(teamId);
  if (!t) return null;
  return t.members.find((m) => m.id === t.leaderId) || null;
}

export function getMembersWithoutLeader(teamId) {
  const t = getTeamById(teamId);
  if (!t) return [];
  return t.members.filter((m) => m.id !== t.leaderId);
}

export function promoteToLeader(teamId, memberId) {
  const t = getTeamById(teamId);
  if (!t) return;
  if (!t.members.some((m) => m.id === memberId)) return;
  updateTeamFields(teamId, { leaderId: memberId });
}

export function removeMember(teamId, memberId) {
  const t = getTeamById(teamId);
  if (!t) return;
  const left = t.members.filter((m) => m.id !== memberId);
  updateTeamFields(teamId, { members: left });
}

// ───────── 가입 유틸 ─────────
export function isMember(teamId, userId) {
  const t = getTeamById(teamId);
  if (!t) return false;
  return Array.isArray(t.members) && t.members.some(m => m.id === userId);
}

export function addMember(teamId, member) {
  const t = getTeamById(teamId);
  if (!t) return null;
  const exists = t.members?.some(m => m.id === member.id);
  if (exists) return t;
  const next = updateTeamFields(teamId, { members: [...(t.members || []), { id: member.id, name: member.name || "사용자" }] });
  return next;
}

