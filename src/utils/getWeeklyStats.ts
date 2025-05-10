import dayjs from 'dayjs'

interface WeeklySignup {
  week_start: string // 'YYYY-MM-DD'
  count: number
}

interface WeeklyStatsResult {
  currentWeek: string
  lastWeek: string
  currentCount: number
  lastCount: number
  increaseRate: number
}

export function getWeeklyStats(data: WeeklySignup[]): WeeklyStatsResult {
  if (data.length === 0) {
    return {
      currentWeek: '',
      lastWeek: '',
      currentCount: 0,
      lastCount: 0,
      increaseRate: 0,
    }
  }

  // 주차 배열을 최신 날짜 기준으로 정렬 (혹시 정렬 안 되어 있을 경우 대비)
  const sortedData = [...data].sort(
    (a, b) => dayjs(a.week_start).unix() - dayjs(b.week_start).unix(),
  )

  const lastEntry = sortedData[sortedData.length - 1] // 최신 주
  const prevEntry = sortedData[sortedData.length - 2] // 이전 주

  const currentCount = lastEntry?.count ?? 0
  const lastCount = prevEntry?.count ?? 0

  let increaseRate = 0
  if (lastCount === 0) {
    increaseRate = currentCount > 0 ? 100 : 0 // 이전주 0명이면 → 100% 증가로 표시
  } else {
    increaseRate = ((currentCount - lastCount) / lastCount) * 100
  }

  return {
    currentWeek: lastEntry.week_start,
    lastWeek: prevEntry?.week_start ?? '',
    currentCount,
    lastCount,
    increaseRate,
  }
}
