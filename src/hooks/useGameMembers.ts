import { supabase } from '@/lib/supabase'
import type { Tables } from '@/supabase/database.types'
import { useQuery } from '@tanstack/react-query'

export function useGameMembers(
  queryKey: string,
  tableName: string,
  days: number | null = null,
  limit: number | null = null,
) {
  return useQuery({
    queryKey: [queryKey, days],
    queryFn: async () => {
      const thirtyDaysAgo = new Date()

      if (days !== null) {
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days)
      }

      let query = supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (limit !== null) {
        query = query.limit(limit)
      }

      if (days !== null) {
        query = query.gte('created_at', thirtyDaysAgo.toISOString())
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data as Tables<'members'>[]
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
  })
}
