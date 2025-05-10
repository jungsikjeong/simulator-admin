import dayjs from 'dayjs'

interface DailySignup {
  day: string // 'YYYY-MM-DD'
  count: number
}

interface TodayStatsResult {
  today: string
  yesterday: string
  todayCount: number
  yesterdayCount: number
  increaseRate: number
}

export function getTodayStats(data: DailySignup[]): TodayStatsResult {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  const todayData = data.find((row) => row.day === today)
  const yesterdayData = data.find((row) => row.day === yesterday)

  const todayCount = todayData ? todayData.count : 0
  const yesterdayCount = yesterdayData ? yesterdayData.count : 0

  let increaseRate = 0
  if (yesterdayCount === 0) {
    increaseRate = todayCount > 0 ? 100 : 0 // 어제 0명일 땐 100% 증가 처리
  } else {
    increaseRate = ((todayCount - yesterdayCount) / yesterdayCount) * 100
  }

  return {
    today,
    yesterday,
    todayCount,
    yesterdayCount,
    increaseRate,
  }
}
