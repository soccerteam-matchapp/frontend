import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Notifications from './pages/Notification'
import MatchListPage from './pages/MatchListPage'
import MatchCreatePage from './pages/MatchCreatePage'
import TeamPage from './pages/TeamPage'
import TeamNewPage from './pages/TeamNewPage'
import TeamJoinPage from './pages/TeamJoinPage'
import TeamJoinDetailPage from './pages/TeamJoinDetailPage'
import TeamManagePage from './pages/TeamManagePage'
import BottomTab from './components/BottomTab'

function App() {
  const location = useLocation()

  // 바텀탭 숨길 페이지
  const hideBottomTab =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/notifications' ||
    location.pathname.startsWith('/matches/new') ||
    location.pathname.startsWith('/teams/new')

  return (
    <>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 인증 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 알림 */}
        <Route path="/notifications" element={<Notifications />} />

        {/* 매칭 */}
        <Route path="/matches" element={<MatchListPage />} />
        <Route path="/matches/new" element={<MatchCreatePage />} />

        {/* 팀 */}
        <Route path="/teams" element={<TeamPage />} />
        <Route path="/teams/new" element={<TeamNewPage />} />
        <Route path="/teams/join" element={<TeamJoinPage />} />
        <Route path="/teams/join/:id" element={<TeamJoinDetailPage />} />
        <Route path="/teams/manage/:id" element={<TeamManagePage />} />
      </Routes>

      {!hideBottomTab && <BottomTab />}
    </>
  )
}

export default App
