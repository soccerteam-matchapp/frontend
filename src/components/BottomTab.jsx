// src/components/BottomTab.jsx
import { NavLink } from 'react-router-dom'

export default function BottomTab() {
  return (
    <nav
      className="bottom-frame"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bottom-inner">
        <Tab to="/matches" label="매칭" icon={<StadiumIcon />} />
        <Tab to="/" label="홈" icon={<HomeIcon />} />
        <Tab to="/teams" label="팀" icon={<TeamIcon />} />
      </div>
    </nav>
  )
}

function Tab({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive ? 'bottom-tab bottom-tab--active' : 'bottom-tab'
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

/* 아이콘들 */

function StadiumIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h16" />
      <path d="M4 10v6a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-6" />
      <path d="M9 14h6" />
      <path d="M9 6l3 2 3-2" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 11v7h4v-4h4v4h4v-7" />
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <path d="M3 18c.5-2 2.5-3 5-3s4.5 1 5 3" />
      <path d="M14 14.5c2.5 0 4.5 1 5 3" />
      <path d="M18 5.5v3" />
      <path d="M19.5 7h-3" />
    </svg>
  )
}
