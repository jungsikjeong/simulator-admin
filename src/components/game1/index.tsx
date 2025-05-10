import { useGameStats } from '@/hooks/useGameStats'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, DownloadIcon } from 'lucide-react'

import { QUERY_KEYS, TABLE_NAMES } from '@/constants'
import { DailyStats } from './DailyStats'
import { StatsOverview } from './StatsOverview'
import { UserDetails } from './UserDetails'
import { WeeklyStats } from './WeeklyStats'

export function Game1Stats() {
  const queryClient = useQueryClient()
  const {
    data: gameStats,
    isLoading,
    error,
  } = useGameStats(QUERY_KEYS.GAME1_STATS, TABLE_NAMES.MEMBERS)

  useEffect(() => {
    const subscription = supabase
      .channel('game1-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        () => {
          // 데이터가 변경되면 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ['game1-stats'] })
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  if (isLoading) return <div className="flex-1 p-6">로딩 중...</div>
  if (error) return <div className="flex-1 p-6">오류 발생: {error.message}</div>

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">게임1 통계</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>2023.01.20 - 2023.02.09</span>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <DownloadIcon className="h-4 w-4" />
            엑셀 다운로드
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="cursor-pointer">
          <TabsTrigger value="overview" className="cursor-pointer">
            개요
          </TabsTrigger>
          <TabsTrigger value="daily" className="cursor-pointer">
            일별 통계
          </TabsTrigger>
          <TabsTrigger value="weekly" className="cursor-pointer">
            주간 통계
          </TabsTrigger>
          <TabsTrigger value="users" className="cursor-pointer">
            사용자 상세
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsOverview />
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <DailyStats />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <WeeklyStats />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserDetails />
        </TabsContent>
      </Tabs>
    </div>
  )
}
