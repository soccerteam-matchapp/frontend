import React, { useState, useEffect } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';

import JoinModal from '../components/JoinModal';
import MatchModal from '../components/MatchModal';

// 시간 계산 유틸리티 함수 정의
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  //예시 시간 (더미)
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;

  if (diffInSeconds < secondsInMinute) {
    return '방금 전';
  } else if (diffInSeconds < secondsInHour) {
    return `${Math.floor(diffInSeconds / secondsInMinute)}분 전`;
  } else if (diffInSeconds < secondsInDay) {
    return `${Math.floor(diffInSeconds / secondsInHour)}시간 전`;
  } else if (diffInSeconds < secondsInWeek) {
    return `${Math.floor(diffInSeconds / secondsInDay)}일 전`;
  } else {
    // 7일 이상 지난 경우, '월/일' 포맷으로 반환
    return `${past.getMonth() + 1}/${past.getDate()}`;
  }
};
//테스트용 더미 데이터셋
const dummyNotifications = [
  {
    id: 1,
    type: 'match_request',
    icon: '🚩',
    message: '매칭 요청이 왔어요!',
    action: 'GAIA와 매칭을 잡을까요?',
    modalType: 'match',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'join_approval',
    icon: 'A',
    message: '손흥민님의 AFK 가입을 승인할까요?',
    action: '',
    modalType: 'join',
    isRead: false,
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'captain_promotion',
    icon: 'C',
    message: '팀장으로 승격했어요!',
    action: 'AFK의 팀장이 됐어요!',
    isRead: false,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'match_success',
    icon: '💥',
    message: '매칭이 성사됐어요!',
    action: '',
    isRead: false,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
export default function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    // 이 부분에 setIsLoading(true) 후 API 호출 로직이 들어감.
    // 현재는 더미 데이터를 사용하므로 생략.
  }, []);

  // 뒤로 가기 핸들러
  const goBack = () => navigate(-1);

  //알림 상태를 읽음으로 변경하는 함수
  const markAsRead = (id) => {
    setNotifications((prevNotifs) =>
      prevNotifs.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  // 개별 알림 클릭 핸들러 (상세 페이지 이동 등)
  const handleNotificationClick = (notif) => {
    //결정형 알림 (모달 존재)
    if (notif.modalType) {
      setSelectedNotif(notif);
      setIsModalOpen(true);
    } else {
      //정보성 알림
      markAsRead(notif.id);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotif(null);
  };

  return (
    <div className="notification-screen">
      {/* 상단 헤더 */}
      <header className="notification-header">
        <button onClick={goBack} className="back-arrow">
          &lt;
        </button>
        <h1 className="header-title">알림</h1>
        {/* 우측 정렬을 위한 빈 공간 */}
        <div style={{ width: '20px' }}></div>
      </header>

      {/* 알림 목록 */}
      <div className="notification-list-container">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${
                notif.isRead ? 'read' : 'unread'
              }`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className={`notif-icon-circle type-${notif.type}`}>
                {notif.icon}
              </div>
              <div className="notif-content">
                <p className="notif-message">{notif.message}</p>
                <p className="notif-action">{notif.action}</p>
              </div>
              <span className="notif-time">
                {formatTimeAgo(notif.createdAt)}
              </span>{' '}
            </div>
          ))
        ) : (
          <div className="no-notifications-message">
                   <p>현재 도착한 알림이 없습니다.</p>           {' '}
          </div>
        )}
        {/*모달 조건부 렌더링 */}
        {isModalOpen && selectedNotif && (
          <>
            {/* 배경 오버레이 (CSS에서 처리) */}
            <div className="modal-backdrop" onClick={closeModal} />

            {/* 모달 타입에 따라 컴포넌트 렌더링 */}
            {selectedNotif.modalType === 'join' && (
              <JoinModal
                data={selectedNotif}
                onClose={closeModal}
                onAction={() => {
                  markAsRead(selectedNotif.id);
                  closeModal();
                }}
              />
            )}
            {selectedNotif.modalType === 'match' && (
              <MatchModal
                data={selectedNotif}
                onClose={closeModal}
                onAction={() => {
                  markAsRead(selectedNotif.id);
                  closeModal();
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
