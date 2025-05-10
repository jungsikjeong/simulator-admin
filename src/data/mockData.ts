// 가상의 사용자 데이터
export const mockUsers = [
  {
    id: 1,
    name: '김철수',
    lastLogin: '2023-11-01',
    visits: 12,
    avgTimeSpent: '5분 32초',
  },
  {
    id: 2,
    name: '이영희',
    lastLogin: '2023-11-02',
    visits: 8,
    avgTimeSpent: '3분 45초',
  },
  {
    id: 3,
    name: '박지민',
    lastLogin: '2023-11-03',
    visits: 15,
    avgTimeSpent: '7분 12초',
  },
  {
    id: 4,
    name: '최수진',
    lastLogin: '2023-11-01',
    visits: 20,
    avgTimeSpent: '10분 05초',
  },
  {
    id: 5,
    name: '정민준',
    lastLogin: '2023-11-02',
    visits: 5,
    avgTimeSpent: '2분 30초',
  },
  {
    id: 6,
    name: '강서연',
    lastLogin: '2023-11-03',
    visits: 18,
    avgTimeSpent: '8분 45초',
  },
  {
    id: 7,
    name: '윤도현',
    lastLogin: '2023-11-01',
    visits: 9,
    avgTimeSpent: '4분 20초',
  },
  {
    id: 8,
    name: '한지원',
    lastLogin: '2023-11-02',
    visits: 14,
    avgTimeSpent: '6분 55초',
  },
  {
    id: 9,
    name: '송민서',
    lastLogin: '2023-11-03',
    visits: 7,
    avgTimeSpent: '3분 15초',
  },
  {
    id: 10,
    name: '임서준',
    lastLogin: '2023-11-01',
    visits: 22,
    avgTimeSpent: '11분 40초',
  },
];

// 가상의 일별 사용자 데이터
export const dailyUserData = [
  { date: '2023-11-01T00:00:00.000Z', users: 120 },
  { date: '2023-11-02T00:00:00.000Z', users: 145 },
  { date: '2023-11-03T00:00:00.000Z', users: 132 },
  { date: '2023-11-04T00:00:00.000Z', users: 167 },
  { date: '2023-11-05T00:00:00.000Z', users: 189 },
  { date: '2023-11-06T00:00:00.000Z', users: 201 },
  { date: '2023-11-07T00:00:00.000Z', users: 176 },
  { date: '2023-11-08T00:00:00.000Z', users: 154 },
  { date: '2023-11-09T00:00:00.000Z', users: 142 },
  { date: '2023-11-10T00:00:00.000Z', users: 163 },
  { date: '2023-11-11T00:00:00.000Z', users: 185 },
  { date: '2023-11-12T00:00:00.000Z', users: 197 },
  { date: '2023-11-13T00:00:00.000Z', users: 210 },
  { date: '2023-11-14T00:00:00.000Z', users: 178 },
];

// 가상의 주간 사용자 데이터
export const weeklyUserData = [
  {
    week: '11월 1주',
    users: 850,
    startDate: '2023-11-01T00:00:00.000Z',
    endDate: '2023-11-07T23:59:59.999Z',
  },
  {
    week: '11월 2주',
    users: 920,
    startDate: '2023-11-08T00:00:00.000Z',
    endDate: '2023-11-14T23:59:59.999Z',
  },
  {
    week: '11월 3주',
    users: 880,
    startDate: '2023-11-15T00:00:00.000Z',
    endDate: '2023-11-21T23:59:59.999Z',
  },
  {
    week: '11월 4주',
    users: 950,
    startDate: '2023-11-22T00:00:00.000Z',
    endDate: '2023-11-28T23:59:59.999Z',
  },
  {
    week: '11월 5주',
    users: 780,
    startDate: '2023-11-29T00:00:00.000Z',
    endDate: '2023-11-30T23:59:59.999Z',
  },
];

// 확장된 일별 데이터 생성 (달력 표시용)
export const extendedDailyData: Record<string, number> = {};

// 최근 3개월 데이터 생성
const generateExtendedData = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 현재 월부터 3개월 전까지의 데이터 생성
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    let year = currentYear;
    let month = currentMonth - monthOffset;

    if (month < 0) {
      month += 12;
      year -= 1;
    }

    // 해당 월의 일수 계산
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 해당 월의 모든 날짜에 대한 데이터 생성
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];

      // 주말에는 사용자 수가 적게, 평일에는 많게 설정
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseCount = isWeekend ? 50 : 150;
      const randomVariation = Math.floor(Math.random() * 50) - 25; // -25 ~ 25 사이의 변동

      extendedDailyData[dateStr] = Math.max(0, baseCount + randomVariation);
    }
  }

  // 기존 dailyUserData의 값으로 덮어쓰기
  dailyUserData.forEach((day) => {
    const dateStr = day.date.split('T')[0];
    extendedDailyData[dateStr] = day.users;
  });
};

// 확장 데이터 생성 실행
generateExtendedData();
