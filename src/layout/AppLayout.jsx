import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  // 심플한 앱 셸. 여기서 공통 스타일/컨테이너만 유지.
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        justifyContent: 'center',
        background: '#f6f7f9',
      }}
    >
      {/* iPhone 393px 캔버스 */}
      <div
        style={{
          width: 393,
          background: '#fff',
          boxShadow:
            '0 10px 30px rgba(0,0,0,.06), 0 1px 0 rgba(0,0,0,.04) inset',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}
