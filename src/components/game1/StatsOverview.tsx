import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { QUERY_KEYS, TABLE_NAMES } from '@/constants'
import { useGameMembers } from '@/hooks/useGameMembers'
import { useGetDailySignups } from '@/hooks/useGetDailySignups'
import { useGetWeeklySignups } from '@/hooks/useGetWeeklySignups'
import { getColorClass, getPrefix } from '@/utils/colorClass'
import { getTodayStats } from '@/utils/getTodayStats'
import { getWeeklyStats } from '@/utils/getWeeklyStats'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.locale('ko')

interface WeeklySignup {
  week_start: string
  count: number
}

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

  const [chartData, setChartData] = useState([])

  const { data: dailySignups } = useGetDailySignups(
    QUERY_KEYS.GET_DAILY_SIGNUPS,
    TABLE_NAMES.MEMBERS,
  )

  const { data: weeklySignups } = useGetWeeklySignups(
    QUERY_KEYS.GET_WEEKLY_SIGNUPS,
    TABLE_NAMES.MEMBERS,
  )

  const { data: gameMembers } = useGameMembers(
    QUERY_KEYS.GAME1_STATS,
    TABLE_NAMES.MEMBERS,
    null,
    4,
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

      // 차트 데이터 가공
      const chartData = weeklySignups
        .map((item: WeeklySignup) => ({
          name: `${new Date(item.week_start).getMonth() + 1}월 ${Math.ceil(new Date(item.week_start).getDate() / 7)}주`,
          사용자수: item.count,
        }))
        .slice(-6) // 최근 6주 데이터만 사용

      setChartData(chartData)
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
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 25,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="사용자수"
                  fill="var(--chart-2)"
                  name="신규 사용자"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
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
                {gameMembers?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {dayjs(member.created_at).fromNow()}
                      </div>
                    </TableCell>
                    {(() => {
                      switch (member.status) {
                        case 'completed':
                          return (
                            <TableCell className="text-right">
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                                엔딩 완료
                              </span>
                            </TableCell>
                          )
                        case 'in_progress':
                          return (
                            <TableCell className="text-right">
                              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                                진행 중
                              </span>
                            </TableCell>
                          )
                        case 'pending':
                          return (
                            <TableCell className="text-right">
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                대기중
                              </span>
                            </TableCell>
                          )
                        default:
                          return (
                            <TableCell className="text-right">
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                상태 미정
                              </span>
                            </TableCell>
                          )
                      }
                    })()}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
