import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useActionMember = ({ queryKey, tableName }: { queryKey: Array<string>, tableName: string }) => {
    return useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')

            if (error) {
                throw new Error(error.message)
            }
            return data
        }
    })
}