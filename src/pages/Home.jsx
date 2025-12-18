import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MainMatchCard from '../components/MainMatchCard';
import MatchCard from '../components/MatchCard';
import '../index.css';
//import { getNotificationStatusApi } from '../api/notification'; //알림 상태를 체크하는 API 함수

const team1 = {
  name: '혜태 타이거즈',
  members: [
    '김태연',
    '정혜원',
    '페르난데스',
    '마운트',
    '쿠냐',
    '음뵈모',
    '더 리흐트',
    '요로',
    '카세미루',
    '매과이어',
    '라멘스',
  ],
};
const team2 = {
  name: '팀 AFK',
  members: [
    '차재우',
    '이상진',
    '홀란드',
    '판더벤',
    '라야',
    '살라',
    '비르츠',
    '사카',
    '라이스',
    '쿠쿠레야',
    '이삭',
  ],
};
const team3 = {
  name: '팀 위너즈',
  members: [
    '메시',
    '호날두',
    '반데사르',
    '루니',
    '벨링엄',
    '반 다이크',
    '카이세도',
    '발레바',
    '박지성',
    '손흥민',
    '김민재',
  ],
};
//테스트 구현을 위한 더미 데이터
const mainMatchesData = [
  {
    id: 1,
    date: '11월 13일 12:00',
    location: '본교 대운동장',
    teamA: team1.name,
    membersA: team1.members,
    teamB: team2.name,
    membersB: team2.members,
  }, // 2. (팀 1 vs 팀 3) 매치
  {
    id: 2,
    date: '11월 14일 15:00',
    location: '잠실 보조구장',
    teamA: team1.name,
    membersA: team1.members,
    teamB: team3.name,
    membersB: team3.members,
  }, // 3. (팀 2 vs 팀 3) 매치
  {
    id: 3,
    date: '11월 15일 18:00',
    location: '올림픽 경기장',
    teamA: team2.name,
    membersA: team2.members,
    teamB: team3.name,
    membersB: team3.members,
  },
];

export default function Home({ hasUnread }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNewNotification, setIsNewNotification] = useState(true); /* //임시 상태
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        // getNotificationStatusApi 함수는 src/api/notification 파일에 구현 필요
        const response = await getNotificationStatusApi(); 
        setIsNewNotification(response.data.hasUnread); // 서버 응답 구조에 맞게 수정 필요
      } catch (error) {
        console.error("알림 상태를 가져오는데 실패했습니다:", error);
      }
    };
  
    fetchNotificationStatus();
    // 1분마다 갱신 
    const intervalId = setInterval(fetchNotificationStatus, 60000); 
    return () => clearInterval(intervalId);
  }, []);
  */ //

  // 서버 연결 후 주석 제거 예정.
  //매치 수
  const totalMatches = mainMatchesData.length;
  const currentMatch = mainMatchesData[currentIndex];
  //비활성화 조건 계산
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalMatches - 1;
  const hasMatches = totalMatches > 0;

  //다음/이전 매치로 이동하는 함수
  const handleNext = () => {
    // 다음 인덱스로 이동 (마지막이면 처음으로)
    setCurrentIndex((prev) => (prev + 1) % totalMatches);
  };

  const handlePrev = () => {
    // 이전 인덱스로 이동 (처음이면 마지막으로)
    setCurrentIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
  };

  //서브 매치 카드에 필요한 더미 데이터
  const subMatchesData = [
    { id: 101, date: '6월 9일 12:00', location: '잠실 A구장', count: '4 / 11' },
    { id: 102, date: '6월 9일 12:00', location: '잠실 A구장', count: '4 / 11' },
    { id: 103, date: '6월 9일 12:00', location: '잠실 A구장', count: '4 / 11' },
    { id: 104, date: '6월 9일 12:00', location: '잠실 B구장', count: '7 / 11' },
  ];
  return (
    <div className="home-container">
      <Header hasUnread={hasUnread} />

      <main className="home-main">
        {hasMatches ? (
          <MainMatchCard
            matchData={currentMatch}
            currentIndex={currentIndex}
            totalMatches={totalMatches}
            onNext={handleNext}
            onPrev={handlePrev}
            isPrevDisabled={isFirst}
            isNextDisabled={isLast}
          />
        ) : (
          <div className="no-matches-message-wrapper">
            <div className="no-matches-message">
              <h2>예정된 매치가 없어요!</h2>
              <p>매치에 참여해보세요</p>
            </div>
          </div>
        )}

        {/* --- 진행 중인 매치 섹션 --- */}
        <div style={{ flexGrow: 1 }}></div>
        {/* --- 진행 중인 매치 섹션 --- */}
<div className="sub-match-section">

  {/* pill 형태 타이틀 */}
  <div className="section-pill">진행 중인 매치</div>

  {/* 가로 스크롤 */}
  <div className="match-scroll">
    {subMatchesData.map((match) => (
      <MatchCard
        key={match.id}
        matchId={match.id}
        matchData={match}
      />
    ))}
  </div>
</div>

      </main>
    </div>
  );
}