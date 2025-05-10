import 'react-day-picker/style.css';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WeeklyUsersTabProps {
  weeklyUserData: {
    week: string;
    users: number;
    startDate: string;
    endDate: string;
  }[];
  extendedDailyData: Record<string, number>;
}

export function WeeklyUsersTab({
  weeklyUserData,
  extendedDailyData,
}: WeeklyUsersTabProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  // 월 선택 기능 추가
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // 월 목록 생성 (현재 월부터 12개월 전까지)
  const months = useMemo(() => {
    const result = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    for (let i = 0; i < 12; i++) {
      let year = currentYear;
      let month = currentMonth - i;

      if (month < 0) {
        month += 12;
        year -= 1;
      }

      const monthStr = String(month + 1).padStart(2, '0');
      const value = `${year}-${monthStr}`;
      const label = `${year}년 ${monthStr}월`;

      result.push({ value, label });
    }

    return result;
  }, []);

  // 월 변경 핸들러
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    const [year, month] = value.split('-').map(Number);

    // 해당 월의 첫날과 마지막 날 계산
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    setDateRange({ from: firstDay, to: lastDay });
  };

  // 날짜 표시 형식 변환 함수
  const formatDisplayDate = (isoString: string) => {
    try {
      // ISO 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
      const dateStr = isoString.split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day); // 월은 0부터 시작하므로 -1

      return format(date, 'yyyy-MM-dd', { locale: ko });
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return isoString; // 오류 발생 시 원본 문자열 반환
    }
  };

  // 선택된 날짜 범위의 데이터 가져오기
  const getDateRangeData = () => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const result = [];
    const currentDate = new Date(dateRange.from);

    while (currentDate <= dateRange.to) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        users: extendedDailyData[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  return (
    <TabsContent value='weekly'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <div>
              <CardTitle>주간 사용자 수</CardTitle>
              <CardDescription>주간 사용자 방문 통계입니다.</CardDescription>
            </div>
            <Button
              variant='outline'
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? '차트 보기' : '달력 보기'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCalendar ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardContent className='pt-6'>
                  <DayPicker
                    mode='range'
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={ko}
                    className='border rounded-md p-3 '
                    footer={
                      <div className='text-sm text-center mt-2'>
                        {dateRange?.from && dateRange?.to ? (
                          <>
                            {format(dateRange.from, 'PPP', { locale: ko })} ~{' '}
                            {format(dateRange.to, 'PPP', { locale: ko })}
                          </>
                        ) : (
                          '날짜 범위를 선택하세요'
                        )}
                      </div>
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>선택 기간 데이터</CardTitle>
                  <div className='flex items-center gap-4'>
                    <Select
                      value={selectedMonth}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='월 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={index} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className='h-64'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                          data={getDateRangeData()}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='date' />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type='monotone'
                            dataKey='users'
                            stroke='#3B82F6'
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className='mt-4 overflow-y-auto max-h-64'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>날짜</TableHead>
                            <TableHead>사용자 수</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getDateRangeData().map((day, index) => (
                            <TableRow key={index}>
                              <TableCell>{day.date}</TableCell>
                              <TableCell>{day.users}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={weeklyUserData.map((item) => ({
                      week: item.week,
                      users: item.users,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='week' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='users' fill='#3B82F6' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-6'>
                <h3 className='text-lg font-medium mb-3'>상세 데이터</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주차</TableHead>
                      <TableHead>시작일</TableHead>
                      <TableHead>종료일</TableHead>
                      <TableHead>사용자 수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyUserData.map((week, index) => (
                      <TableRow key={index}>
                        <TableCell>{week.week}</TableCell>
                        <TableCell>
                          {formatDisplayDate(week.startDate)}
                        </TableCell>
                        <TableCell>{formatDisplayDate(week.endDate)}</TableCell>
                        <TableCell>{week.users}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
