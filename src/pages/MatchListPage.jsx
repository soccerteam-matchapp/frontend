// src/pages/MatchListPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMatches,
  isMine,
  deleteMatch,
} from '../services/matchStore.js'

function formatKoreanDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}
function makeVsText(playerCount) {
  if (!playerCount) return '매칭'
  const p = String(playerCount).trim()
  return p ? `${p} vs ${p}` : '매칭'
}

export default function MatchListPage() {
  const [matches, setMatches] = useState([])
  const [mineOnly, setMineOnly] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [confirmDeleteFor, setConfirmDeleteFor] = useState(null)

  const load = () => setMatches(getMatches())
  useEffect(() => { load() }, [])

  const visible = mineOnly ? matches.filter(isMine) : matches
  const has = visible.length > 0

  return (
    <div className="app-root">
      <div className="safe-top" />

      <main className="match-screen">
        <div className="match-filterbar">
          <div className="match-filterbar-box" />
          <div className="match-filter-check" onClick={() => setMineOnly(v=>!v)}>
            내가 올린 매칭만 보기
            <div className={mineOnly ? 'match-filter-check-box' : 'match-filter-check-box is-off'}>
              {mineOnly ? '✓' : ''}
            </div>
          </div>
        </div>

        {!has ? (
          <div className="match-empty">등록된 매칭이 없습니다.</div>
        ) : (
          <div className="match-list">
            {visible.map((m, i) => {
              const ticket = i % 2 === 0 ? '#FFE563' : '#FFD555'
              const vs = makeVsText(m.playerCount)
              const date = m.matchDate ? formatKoreanDate(m.matchDate) : ''
              const time = m.matchTime || ''
              const dt = [date, time].filter(Boolean).join(' ')
              const place = m.place || ''

              return (
                <article key={m.id} className="match-card">
                  <div className="match-card__team">
                    <div className="match-card__logo">
                      {(m.teamName && m.teamName[0]?.toUpperCase()) || 'A'}
                    </div>
                    <div className="match-card__teamname">{m.teamName || '팀명'}</div>
                  </div>

                  <div className="match-card__ticket" style={{ '--ticket-color': ticket }}>
                    <div className="match-card__title">{vs}</div>
                    <div className="match-card__datetime">{dt}</div>
                    <div className="match-card__place">{place}</div>
                  </div>

                  <div className="match-card__actions">
                    <div className="match-card__actions-inner">
                      <button className="match-card__qbtn" onClick={() => setSelectedMatch(m)}>?</button>
                      <button className="match-card__detail" onClick={() => setSelectedMatch(m)}>자세히 보기</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {/* ✅ Link 사용: 전체 새로고침 방지 */}
      <Link to="/matches/new" className="match-fab">+</Link>

      <nav className="bottom-frame">
        <div className="bottom-inner">
          <Link to="/matches" className="bottom-tab bottom-tab--active">
            <span className="bottom-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="14" y1="5" x2="14" y2="21" stroke="currentColor" strokeWidth="2"/>
                <circle cx="14" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
                <rect x="6.8" y="9" width="3.7" height="8" stroke="currentColor" strokeWidth="1.4" rx="0.8"/>
                <rect x="17.5" y="9" width="3.7" height="8" stroke="currentColor" strokeWidth="1.4" rx="0.8"/>
              </svg>
            </span>
            <span className="bottom-label">매칭</span>
          </Link>

          <Link to="/home" className="bottom-tab">
            <span className="bottom-icon">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 11.5L13 4L22 11.5V21H15.5V15H10.5V21H4V11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="bottom-label">홈</span>
          </Link>

          <Link to="/teams" className="bottom-tab">
            <span className="bottom-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="11" r="3" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5.5 20C5.8 17.5 7.5 16 10 16C12.5 16 14.2 17.5 14.5 20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="18" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M19.5 18.5H21.5M20.5 17.5V19.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="bottom-label">팀</span>
          </Link>
        </div>
      </nav>

      {selectedMatch && (
        <div className="match-modal-backdrop" onClick={() => setSelectedMatch(null)}>
          <MatchDetailCard
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onRequestDelete={(m) => setConfirmDeleteFor(m)}
          />
        </div>
      )}

      {confirmDeleteFor && (
        <div className="match-modal-backdrop" onClick={() => setConfirmDeleteFor(null)}>
          <div className="match-confirm-modal" onClick={(e)=>e.stopPropagation()}>
            <p className="match-confirm-text">매칭을 취소하시겠습니까?</p>
            <div className="match-confirm-actions">
              <button className="match-confirm-no" onClick={() => setConfirmDeleteFor(null)}>아니요</button>
              <button
                className="match-confirm-yes"
                onClick={() => {
                  deleteMatch(confirmDeleteFor.id)
                  load()
                  setConfirmDeleteFor(null)
                  setSelectedMatch(null)
                }}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MatchDetailCard({ match, onClose, onRequestDelete }) {
  const mine = isMine(match)
  const vs = makeVsText(match.playerCount)
  const date = match.matchDate ? formatKoreanDate(match.matchDate) : ''
  const time = match.matchTime || ''
  const dt = [date, time].filter(Boolean).join(' ')
  const place = match.place || ''
  const img = match.teamImageUrl || match.teamImage || ''

  return (
    <div className={`match-modal-card ${mine ? 'mine' : 'other'}`} onClick={(e)=>e.stopPropagation()}>
      <button className="match-modal-closebtn" onClick={onClose}>×</button>

      <div className={`match-modal-avatar ${img ? 'has-image':''}`}>
        {img ? <img src={img} alt="팀 로고"/> : (match.teamName?.[0]?.toUpperCase() || 'A')}
      </div>

      <div className="match-modal-teamname">{match.teamName || '팀명'}</div>

      <div className="match-modal-maininfo">
        <div className="match-modal-vs">{vs}</div>
        <div className="match-modal-datetime">{dt || '날짜 미입력'}</div>
        <div className="match-modal-place">{place || '장소 미입력'}</div>
      </div>

      {!mine && (
        <div className="match-modal-fields">
          <div className="match-modal-field-title">날짜</div>
          <div className="match-modal-field-value">{dt || '미입력'}</div>
          <div className="match-modal-field-title">장소</div>
          <div className="match-modal-field-value">{place || '미입력'}</div>
          <div className="match-modal-field-title">몇 대 몇</div>
          <div className="match-modal-field-value">{vs}</div>
        </div>
      )}

      <div className="match-modal-bottom-row">
        <div className="match-modal-bottom-cell">
          <div className="match-modal-bottom-label">팀 실력</div>
          <div className="match-modal-bottom-value">{match.skill?.trim() || '-'}</div>
        </div>
        <div className="match-modal-bottom-cell">
          <div className="match-modal-bottom-label">구장 비용</div>
          <div className="match-modal-bottom-value">
            {String(match.fieldCost || '').trim() ? `${match.fieldCost}원` : '-'}
          </div>
        </div>
        <div className="match-modal-bottom-cell">
          <div className="match-modal-bottom-label">선출 인원 수</div>
          <div className="match-modal-bottom-value">
            {String(match.proCount || '').trim() || '-'}
          </div>
        </div>
      </div>

      {!mine ? (
        <button className="match-modal-action" onClick={onClose}>매칭 신청하기</button>
      ) : (
        <button className="match-modal-action cancel" onClick={() => onRequestDelete(match)}>매칭 취소하기</button>
      )}
    </div>
  )
}
