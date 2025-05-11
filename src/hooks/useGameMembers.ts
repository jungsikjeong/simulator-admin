import { supabase } from '@/lib/supabase'
import type { Tables } from '@/supabase/database.types'
import { useQuery } from '@tanstack/react-query'

export function useGameMembers(
  queryKey: string,
  tableName: string,
  limit: number = 4,
) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data as Tables<'members'>[]
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
  })
}
