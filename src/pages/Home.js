import React, { useState } from 'react';
import Header from '../components/Header';
import MainMatchCard from '../components/MainMatchCard';
import MatchCard from '../components/MatchCard';
import '../index.css';

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
    '반 페르시',
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
  },
  {
    id: 2,
    date: '11월 14일 15:00',
    location: '잠실 보조구장',
    teamA: team1.name,
    membersA: team1.members,
    teamB: team3.name,
    membersB: team3.members,
  },
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

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  //매치 수
  const totalMatches = mainMatchesData.length;
  const currentMatch = mainMatchesData[currentIndex];
  //비활성화 조건 계산
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalMatches - 1;

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
      <Header />

      <main className="home-main">
        <MainMatchCard
          matchData={currentMatch}
          currentIndex={currentIndex}
          totalMatches={totalMatches}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* --- 진행 중인 매치 섹션 --- */}
        <h2 className="section-title">진행 중인 매치</h2>
        <div className="match-list">
          {subMatchesData.map((match) => (
            <MatchCard key={match.id} matchId={match.id} matchData={match} />
          ))}
        </div>
      </main>
    </div>
  );
}
