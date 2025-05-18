import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { QUERY_KEYS, TABLE_NAMES } from '@/constants'
import { useGameMembers } from '@/hooks/useGameMembers'
import React, { useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

interface WeeklyStats {
  week: string
  displayWeek: string
  weekStart: string
  users: number
  completed: number
}

export function WeeklyStats() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: gameMembers } = useGameMembers(
    [...QUERY_KEYS.game2Stats.all()],
    TABLE_NAMES.MEMBERS_2,
    90, // 약 3개월 데이터
    null,
  )

  const weeklyData = React.useMemo(() => {
    if (!gameMembers) return []

    const groupedByWeek: Record<string, WeeklyStats> = gameMembers.reduce(
      (acc, member) => {
        const date = dayjs(member.created_at)
        const year = date.year()
        const month = date.month() + 1

        const firstDayOfMonth = dayjs(new Date(year, month - 1, 1))
        const lastDayOfMonth = firstDayOfMonth.endOf('month')

        const weekInMonth = Math.ceil(date.date() / 7)

        const weekKey = `${year}-${month}-${weekInMonth}`
        const displayWeek = `${month}월 ${weekInMonth}주차`

        const targetDay = (weekInMonth - 1) * 7 + 1
        const weekStartDay =
          targetDay <= lastDayOfMonth.date()
            ? targetDay
            : firstDayOfMonth.date()

        const weekStart = dayjs(new Date(year, month - 1, weekStartDay))

        if (!acc[weekKey]) {
          acc[weekKey] = {
            week: weekKey,
            displayWeek: displayWeek,
            weekStart: weekStart.format('YYYY-MM-DD'),
            users: 0,
            completed: 0,
          }
        }

        acc[weekKey].users++
        if (member.status === 'completed') acc[weekKey].completed++

        return acc
      },
      {} as Record<string, WeeklyStats>,
    )

    return Object.values(groupedByWeek).sort(
      (a, b) => dayjs(a.weekStart).unix() - dayjs(b.weekStart).unix(),
    )
  }, [gameMembers])

  const chartData = weeklyData.slice(-12)

  const totalPages = Math.ceil(weeklyData.length / itemsPerPage)
  const currentData = weeklyData
    .slice()
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>주간 사용자 통계</CardTitle>
          <CardDescription>최근 12주 동안의 주간 사용자 데이터</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
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
                dataKey="displayWeek"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--chart-1, #4f46e5)"
                name="사용자 수"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--chart-3, #16a34a)"
                name="엔딩 완료"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>주간 상세 데이터</CardTitle>
          <div className="text-sm text-muted-foreground">
            총 {weeklyData.length}주 데이터
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주차</TableHead>
                <TableHead>사용자 수</TableHead>
                <TableHead>엔딩 완료</TableHead>
                <TableHead>완료율</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((week) => (
                  <TableRow key={week.week}>
                    <TableCell>{week.displayWeek}</TableCell>
                    <TableCell>{week.users.toLocaleString()} 명</TableCell>
                    <TableCell>{week.completed.toLocaleString()} 명</TableCell>
                    <TableCell>
                      {week.users > 0
                        ? `${Math.round((week.completed / week.users) * 100)}%`
                        : '0%'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-muted-foreground">
                        아직 데이터가 없습니다.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        사용자가 활동하면 여기에 통계가 표시됩니다.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
