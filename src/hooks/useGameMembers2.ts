import { supabase } from '@/lib/supabase'
import type { Tables } from '@/supabase/database.types'
import { useQuery } from '@tanstack/react-query'
import type { DateRange } from 'react-day-picker'

export function useGameMembers2(
  queryKey: Array<string>,
  tableName: string,
  days: number | null = null,
  limit: number | null = null,
  page: number = 0,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, page],
    enabled,
    queryFn: async () => {
      const thirtyDaysAgo = new Date()

      if (days !== null) {
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days)
      }

      let query = supabase
        .from(tableName)
        .select(
          `
          *,
          member_actions_2(action_type, created_at)
        `,
          { count: 'exact' },
        )
        .order('created_at', { ascending: false })

      if (limit !== null) {
        query = query.limit(limit)
      } else {
        query = query.range(page * 1000, (page + 1) * 1000 - 1)
      }

      if (days !== null) {
        query = query.gte('created_at', thirtyDaysAgo.toISOString())
      }

      const { data, error, count } = await query

      if (error) {
        throw new Error(error.message)
      }

      return { data, count } as {
        data: Array<Tables<'members'>>
        count: number
      }
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
  })
}

export function useGameMembersByDateRange(
  queryKey: Array<string>,
  tableName: string,
  dateRange?: DateRange | undefined,
  limit: number | null = null,
) {
  return useQuery({
    queryKey: [
      ...queryKey,
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (limit !== null) {
        query = query.limit(limit)
      }

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString())
      }

      if (dateRange?.to) {
        // to 날짜의 끝까지 포함하기 위해 다음날 0시로 설정
        const nextDay = new Date(dateRange.to)
        nextDay.setDate(nextDay.getDate() + 1)
        nextDay.setHours(0, 0, 0, 0)
        query = query.lt('created_at', nextDay.toISOString())
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data as Array<Tables<'members'>>
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
  })
}
