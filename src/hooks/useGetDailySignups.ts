import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

export function useGetDailySignups(queryKey: Array<string>, rpcQuery: string, tableName: string) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(rpcQuery, {
        tablename: tableName,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
  })
}
