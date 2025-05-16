import { useQuery } from '@tanstack/react-query'
import type { Tables } from '@/supabase/database.types'
import { supabase } from '@/lib/supabase'

export function useGameMembers(
  queryKey: Array<string>,
  tableName: string,
  days: number | null = null,
  limit: number | null = null,
) {
  return useQuery({
    queryKey: queryKey,
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

      return data as Array<Tables<'members'>>
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
  })
}
