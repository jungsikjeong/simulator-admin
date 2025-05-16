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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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

interface DailyStats {
  date: string
  users: number
  completed: number
}

export function DailyStats() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: gameMembers } = useGameMembers(
    [...QUERY_KEYS.game1Stats.all()],
    TABLE_NAMES.MEMBERS,
    30,
    null,
  )

  const dailyData = React.useMemo(() => {
    if (!gameMembers) return []

    const groupedByDate: Record<string, DailyStats> = gameMembers.reduce(
      (acc, member) => {
        const date = new Date(member.created_at).toISOString().split('T')[0]

        if (!acc[date]) {
          acc[date] = {
            date,
            users: 0,
            completed: 0,
          }
        }

        acc[date].users++
        if (member.status === 'completed') acc[date].completed++

        return acc
      },
      {} as Record<string, DailyStats>,
    )

    return Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        ...item,
        date: `${new Date(item.date).getMonth() + 1}/${new Date(item.date).getDate()}`,
      }))
  }, [gameMembers])

  // 차트에 표시할 데이터 (최근 30일)
  const chartData = dailyData.slice(-30)

  const totalPages = Math.ceil(dailyData.length / itemsPerPage)
  const currentData = dailyData
    .slice()
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>일별 사용자 통계</CardTitle>
          <CardDescription>최근 30일 동안의 일별 사용자 데이터</CardDescription>
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
                dataKey="date"
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
          <CardTitle>일별 상세 데이터</CardTitle>
          <div className="text-sm text-muted-foreground">
            총 {dailyData.length}일 데이터
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>사용자 수</TableHead>
                <TableHead>엔딩 완료</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>{day.date}</TableCell>
                    <TableCell>{day.users.toLocaleString()}</TableCell>
                    <TableCell>{day.completed.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
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
