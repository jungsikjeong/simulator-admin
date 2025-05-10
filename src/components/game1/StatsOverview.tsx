import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { QUERY_KEYS, TABLE_NAMES } from '@/constants'
import { useGetDailySignups } from '@/hooks/useGetDailySignups'
import { useGetWeeklySignups } from '@/hooks/useGetWeeklySignups'
import { getColorClass, getPrefix } from '@/utils/colorClass'
import { getTodayStats } from '@/utils/getTodayStats'
import { getWeeklyStats } from '@/utils/getWeeklyStats'
import { useEffect, useState } from 'react'

export function StatsOverview() {
  const [stats, setStats] = useState({
    today: '',
    yesterday: '',
    todayCount: 0,
    yesterdayCount: 0,
    increaseRate: 0,
  })

  const [weeklyStats, setWeeklyStats] = useState({
    currentWeek: '',
    lastWeek: '',
    currentCount: 0,
    lastCount: 0,
    increaseRate: 0,
  })

  const { data: dailySignups } = useGetDailySignups(
    QUERY_KEYS.GET_DAILY_SIGNUPS,
    TABLE_NAMES.MEMBERS,
  )

  const { data: weeklySignups } = useGetWeeklySignups(
    QUERY_KEYS.GET_WEEKLY_SIGNUPS,
    TABLE_NAMES.MEMBERS,
  )

  useEffect(() => {
    if (dailySignups) {
      const todayStats = getTodayStats(dailySignups)
      setStats(todayStats)
    }
  }, [dailySignups])

  useEffect(() => {
    if (weeklySignups) {
      const weekStats = getWeeklyStats(weeklySignups)
      setWeeklyStats(weekStats)
    }
  }, [weeklySignups])

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              일별 활성 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCount}명</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={getColorClass(stats.increaseRate)}>
                {getPrefix(stats.increaseRate)}
                {stats.increaseRate.toFixed(1)}%
              </span>{' '}
              어제 대비
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              주간 활성 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyStats.currentCount}명
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={getColorClass(weeklyStats.increaseRate)}>
                {getPrefix(weeklyStats.increaseRate)}
                {weeklyStats.increaseRate.toFixed(1)}%
              </span>{' '}
              지난주 대비
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>주간 사용자 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full bg-muted/25 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">주간 사용자 증감 차트</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>최근 이용자</CardTitle>
            <CardDescription>오늘 접속한 사용자 통계</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">김철수</div>
                    <div className="text-xs text-muted-foreground">
                      1시간 전
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      엔딩 완료
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">이영희</div>
                    <div className="text-xs text-muted-foreground">
                      2시간 전
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                      진행 중
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">박지민</div>
                    <div className="text-xs text-muted-foreground">
                      3시간 전
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                      중도 이탈
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">최준호</div>
                    <div className="text-xs text-muted-foreground">
                      4시간 전
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      엔딩 완료
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
