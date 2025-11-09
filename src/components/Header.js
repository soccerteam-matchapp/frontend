import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
export default function Header() {
  const navigate = useNavigate();
  const goToNotifications = () => {
    navigate('/notifications');
  };
  const isNewNotification = true; //서버 연결 전 임시상태
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      <h2 className="brand">
        <span>S</span>
        <span className="dark">p</span>
        <span>o</span>
        <span className="dark">r</span>
        <span>t</span>
        <span className="dark">l</span>
        <span>y</span>
      </h2>
      <button
        className="notification-button"
        onClick={goToNotifications}
        aria-label="알림 페이지로 이동"
      >
        <FontAwesomeIcon icon={faBell} size="lg" />
        {isNewNotification && <div className="notification-badge" />}{' '}
        {/*알림이 있을 때만 뱃지 렌더링*/}
      </button>
    </header>
  );
}
