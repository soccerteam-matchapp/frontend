// src/services/matchStore.js

const STORAGE_KEY = 'sportly_matches_v1'
const USER_KEY = 'sportly_current_user_v1'

// 지금 기기(브라우저)에 임시로 저장되는 유저 id
function getCurrentUserId() {
  // 나중에 로그인 붙으면 여기만 서버값으로 바꾸면 됨
  let id = localStorage.getItem(USER_KEY)
  if (!id) {
    id = 'local-user-' + Math.random().toString(16).slice(2)
    localStorage.setItem(USER_KEY, id)
  }
  return id
}

export function isMine(match) {
  if (!match) return false
  const me = getCurrentUserId()
  return match.ownerId === me
}

export function getMatches() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function saveMatches(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// 매칭 추가
export function addMatch(match) {
  const me = getCurrentUserId()
  const list = getMatches()
  const newMatch = {
    id: 'm_' + Date.now(),
    ownerId: me,
    ...match,
  }
  list.unshift(newMatch)
  saveMatches(list)
  return newMatch
}

// 매칭 삭제
export function deleteMatch(matchId) {
  const me = getCurrentUserId()
  const list = getMatches()
  const filtered = list.filter((m) => {
    // 내가 만든 것만 지울 수 있게
    if (m.id === matchId) {
      return m.ownerId !== me
    }
    return true
  })
  saveMatches(filtered)
  return true
}

// 나중에 로그인 붙이면 여기 export 해서 쓸 수 있음
export function getCurrentUser() {
  const id = getCurrentUserId()
  return { id }
}
