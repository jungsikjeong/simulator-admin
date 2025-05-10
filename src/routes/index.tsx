import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { DailyUsersTab } from '../components/DailyUsersTab'
import { WeeklyUsersTab } from '../components/WeeklyUsersTab'
import { UsersInfoTab } from '../components/UsersInfoTab'
import {
  dailyUserData,
  extendedDailyData,
  mockUsers,
  weeklyUserData,
} from '@/data/mockData'
import { checkAdminAuth } from '@/utils/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { isAdmin, isLoggedIn } = await checkAdminAuth()

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/signin',
        search: {
          redirect: '/',
        },
      })
    }

    if (!isAdmin) {
      console.log('관리자 권한이 없습니다.')
      throw redirect({
        to: '/',
      })
    }
  },

  component: App,
})

function App() {
  const [activeTab, setActiveTab] = useState('daily')

  const exportToExcel = () => {
    // 사용자 데이터 준비
    const userData = mockUsers.map((user) => ({
      '사용자 ID': user.id,
      이름: user.name,
      '마지막 로그인': user.lastLogin,
      '방문 횟수': user.visits,
      '평균 사용 시간': user.avgTimeSpent,
    }))

    // 일별 데이터 준비
    const dailyData = dailyUserData.map((day) => ({
      날짜: day.date,
      '사용자 수': day.users,
    }))

    // 주간 데이터 준비
    const weeklyData = weeklyUserData.map((week) => ({
      주차: week.week,
      '사용자 수': week.users,
    }))

    // 워크북 생성
    const wb = XLSX.utils.book_new()

    // 워크시트 생성 및 추가
    const userSheet = XLSX.utils.json_to_sheet(userData)
    XLSX.utils.book_append_sheet(wb, userSheet, '사용자 데이터')

    const dailySheet = XLSX.utils.json_to_sheet(dailyData)
    XLSX.utils.book_append_sheet(wb, dailySheet, '일별 사용자 수')

    const weeklySheet = XLSX.utils.json_to_sheet(weeklyData)
    XLSX.utils.book_append_sheet(wb, weeklySheet, '주간 사용자 수')

    // 파일 다운로드
    XLSX.writeFile(wb, '사용자_통계_데이터.xlsx')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">어드민 대시보드</h1>
          <Button
            onClick={exportToExcel}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            엑셀 다운로드
          </Button>
        </div>

        <Tabs
          defaultValue="daily"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="daily">일별 사용자 수</TabsTrigger>
            <TabsTrigger value="weekly">주간 사용자 수</TabsTrigger>
            <TabsTrigger value="users">사용자 정보</TabsTrigger>
          </TabsList>

          <DailyUsersTab
            dailyUserData={dailyUserData}
            extendedDailyData={extendedDailyData}
          />

          <WeeklyUsersTab
            weeklyUserData={weeklyUserData}
            extendedDailyData={extendedDailyData}
          />

          <UsersInfoTab mockUsers={mockUsers} />
        </Tabs>

        <div className="mt-6">
          <Button variant="link" asChild>
            <a href="/">메인 페이지로 돌아가기</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
