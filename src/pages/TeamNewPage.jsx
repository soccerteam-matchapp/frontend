// src/pages/TeamNewPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, createTeam } from '../services/teamStore.js'
import '../styles/team.css'

/* 모달 (team.css의 .tm-confirm-* 스타일 사용) */
function ConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="tm-confirm-backdrop" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="tm-confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="tm-confirm-text">
          팀을 생성할까요?
          <br />
          생성한 팀은 추후 정보를 수정할 수 없어요.
        </div>
        <div className="tm-confirm-actions">
          <button className="tm-confirm-no" onClick={onCancel}>취소</button>
          <button className="tm-confirm-yes" onClick={onConfirm}>생성</button>
        </div>
      </div>
    </div>
  );
}

export default function TeamNewPage() {
  const nav = useNavigate()
  const me = getCurrentUser()

  const [logoUrl, setLogoUrl] = useState('')
  const [name, setName] = useState('')
  const [intro, setIntro] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)   // 모달 상태

  const isValid = !!(name.trim() && intro.trim() && region.trim())

  //  하나라도 비었으면 빨간 에러가 자동 표시되고 버튼은 비활성화
  useEffect(() => {
    if (!name.trim()) return setError('팀명 형식이 일치하지 않습니다.')
    if (!intro.trim()) return setError('팀 소개 형식이 일치하지 않습니다.')
    if (!region.trim()) return setError('활동 지역 형식이 일치하지 않습니다.')
    setError('')
  }, [name, intro, region])

  const onPickLogo = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setLogoUrl(reader.result)
    reader.readAsDataURL(f)
  }

  // 기존 생성 로직(변경 없음)
  const onSubmit = () => {
    if (!name.trim()) return setError('팀명 형식이 일치하지 않습니다.')
    if (!intro.trim()) return setError('팀 소개 형식이 일치하지 않습니다.')
    if (!region.trim()) return setError('활동 지역 형식이 일치하지 않습니다.')
    setError('')
    createTeam({ name: name.trim(), intro: intro.trim(), region: region.trim(), logoUrl, leader: me })
    nav('/teams', { replace: true })
  }

  return (
    <div className="app-root create-root">
      <div className="safe-top" />

      <header className="tn-header">
        <button className="tn-back" onClick={() => nav(-1)} aria-label="뒤로">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="tn-title">팀 만들기</h1>
        <div className="tn-right-spacer" />
      </header>

      <main className="tn-body">
        <div className="tn-section-title">팀 로고</div>

        <label className="tn-avatar">
          {logoUrl ? <img src={logoUrl} alt="팀 로고" /> : <span className="tn-avatar-initial">A</span>}
          <input className="tn-avatar-input" type="file" accept="image/*" onChange={onPickLogo} />
        </label>

        <div className="tn-form">
          <div className="tn-field">
            <div className="tn-label"><span>팀명</span> <span className="req">*</span></div>
            <input className="tn-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="" />
          </div>

          <div className="tn-field">
            <div className="tn-label"><span>팀 소개</span> <span className="req">*</span></div>
            <input className="tn-input" value={intro} onChange={(e)=>setIntro(e.target.value)} placeholder="" />
          </div>

          <div className="tn-field">
            <div className="tn-label"><span>활동 지역</span> <span className="req">*</span></div>
            <input className="tn-input" value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="" />
          </div>
        </div>

        {/* ↓ 버튼과 오류를 묶어서 아래로 내리고, 가운데 정렬 */}
        <div className="tn-cta">
          <div className="tn-error-slot">
            {error && <div className="tn-error-text">{error}</div>}
          </div>

          <button
            type="button"
            className={`tn-submit ${!isValid ? 'is-disabled' : ''}`}
            disabled={!isValid}
            onClick={() => { if (isValid) setConfirmOpen(true) }}  // ✅ 활성화 상태에서만 모달 오픈
          >
            <span className="tn-submit-label">생성하기</span>
          </button>
        </div>
      </main>

      {/* 모달: '생성'을 눌러야 실제 onSubmit 실행 */}
      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); onSubmit(); }}
      />
    </div>
  )
}
