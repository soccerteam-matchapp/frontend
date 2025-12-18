// src/components/MatchModal.js

import React from 'react';
import '../index.css';

export default function MatchModal({ data, onClose, onAction }) {
  const teamName = data.action.split('과 매칭을 잡을까요?')[0]; // 예시: action에서 팀명 파싱

  const handleAccept = () => {
    console.log('매칭 수락 (API 호출)');
    // onAction 호출: 읽음 처리와 닫기를 동시에 수행
    onAction();
    // 서버 API 호출 로직 추가
  };

  const handleReject = () => {
    console.log('매칭 거절 (API 호출)');
    //onAction 호출: 읽음 처리와 닫기를 동시에 수행
    onAction();
    // 서버 API 호출 로직 추가
  };

  return (
    <div className="modal-container match-modal">
      <p className="modal-type-label">매칭 수락/거절</p>
      <div className="modal-content-area match-area">
        <h3 className="modal-info-title">매칭 정보</h3>
        <p className="modal-main-text team-name-text">{teamName}</p>
        <p className="modal-question">매칭을 수락할까요?</p>
      </div>
      <div className="modal-actions">
        <button className="btn-reject" onClick={handleReject}>
          {' '}
          거절{' '}
        </button>{' '}
        {/*  handleReject 연결 */}
        <button className="btn-accept" onClick={handleAccept}>
          {' '}
          수락{' '}
        </button>{' '}
        {/*  handleAccept 연결 */}
      </div>
    </div>
  );
}