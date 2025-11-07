// src/components/JoinModal.js

import React from 'react';
import '../index.css';

export default function JoinModal({ data, onClose, onAction }) {
  // data.action에서 필요한 정보 추출 (OOO님, 팀명)
  const userName = 'OOO'; // 실제 데이터 구조에서 파싱 필요
  const teamName = '[팀명]'; // 실제 데이터 구조에서 파싱 필요
  const handleAccept = () => {
    console.log('가입 수락 (API 호출)');
    // API 호출 성공 후:
    onAction(); // 읽음 처리 및 모달 닫기 실행
  };

  const handleReject = () => {
    console.log('가입 거절');
    onClose();
    // 서버 API 호출 로직 추가 (e.g., rejectJoinApi(data.id))
  };

  return (
    <div className="modal-container join-modal">
      <p className="modal-type-label">가입 수락/거절 모달</p>
      <div className="modal-content-area">
        <p className="modal-main-text team-name-text">{teamName}</p>
        <p className="modal-main-text user-name-text">{userName}님</p>
        <p className="modal-question">가입을 승인할까요?</p>
      </div>
      <div className="modal-actions">
        <button className="btn-reject" onClick={handleReject}>
          거절
        </button>
        <button className="btn-accept" onClick={handleAccept}>
          수락
        </button>
      </div>
    </div>
  );
}
