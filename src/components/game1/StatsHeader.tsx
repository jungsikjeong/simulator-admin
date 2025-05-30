import { QUERY_KEYS, TABLE_NAMES } from '@/constants'
import { useGameMembersByDateRange } from '@/hooks/useGameMembers'
import React from 'react'
import type { DateRange } from 'react-day-picker'
import { DateRangePicker } from './DateRangePicker'
import { ExcelDownloadButton } from './ExcelDownloadButton'
import dayjs from 'dayjs'
import { getStatusText } from '@/utils/getStatusText'

interface Action {
  action_type: string
  created_at: string
}

interface Member {
  created_at: string
  id: string
  name: string
  status: 'in_progress' | 'completed' | 'pending'
  member_actions?: Array<Action>
}

interface StatsHeaderProps {
  title: string
  filename?: string
}

export function StatsHeader({ title, filename }: StatsHeaderProps) {
  const today = dayjs()
  const thirtyDaysAgo = today.subtract(30, 'day')

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: thirtyDaysAgo.toDate(),
    to: today.toDate(),
  })

  const { data: filteredMembers } = useGameMembersByDateRange(
    [...QUERY_KEYS.game1Stats.all()],
    TABLE_NAMES.MEMBERS,
    dateRange,
  ) as { data: Array<Member> | undefined }

  const getDataForExport = () => {
    if (!filteredMembers) return []

    return filteredMembers.map((member) => {
      // member_actions에서 share, retry 카운트 집계
      let shareCount = 0
      let retryCount = 0
      if (Array.isArray(member.member_actions)) {
        member.member_actions.forEach(action => {
          if (action.action_type === 'share') shareCount++
          if (action.action_type === 'retry') retryCount++
        })
      }
      return {
        '사용자 ID': member.name,
        가입일: dayjs(member.created_at).format('YYYY-MM-DD'),
        상태: getStatusText(member.status),
        '공유하기 횟수': shareCount,
        '다시하기 횟수': retryCount,
      }
    })
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <ExcelDownloadButton
          title="게임1 엑셀 다운"
          dateRange={dateRange}
          getDataForExport={getDataForExport}
          filename={filename}
        />
      </div>
    </div>
  )
}
