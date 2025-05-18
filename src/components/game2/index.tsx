import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QUERY_KEYS } from '@/constants'
import { DailyStats } from './DailyStats'
import { StatsHeader } from './StatsHeader'
import { StatsOverview } from './StatsOverview'
import { UserDetails } from './UserDetails'
import { WeeklyStats } from './WeeklyStats'

export function Game2Stats() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const subscription = supabase
      .channel('game2-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'member_2' },
        () => {
          // 데이터가 변경되면 쿼리 무효화
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.game2Stats.all()],
          })
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  return (
    <div className="flex-1 p-6">
      <StatsHeader title="게임2 통계" filename="game2-stats" />

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
