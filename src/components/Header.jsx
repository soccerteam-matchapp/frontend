import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import '../index.css';

export default function Header({ hasUnread }) {
  const navigate = useNavigate();

  return (
    <header className="home-header">
      <h1 className="header-brand">
        <span className="dark">S</span>portly
      </h1>

      <button
        className="notification-button"
        onClick={() => navigate('/notifications')}
        aria-label="알림"
      >
        <FiBell className="bell-icon" />

        {hasUnread && <span className="notification-badge" />}
      </button>
    </header>
  );
}
