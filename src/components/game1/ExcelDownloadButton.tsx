import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ExcelDownloadButtonProps {
  dateRange: DateRange | undefined
  getDataForExport: () => any[]
  filename?: string
  className?: string
  title: string
}

export function ExcelDownloadButton({
  dateRange,
  getDataForExport,
  filename = 'game1-stats',
  title,
  className,
}: ExcelDownloadButtonProps) {
  const handleDownload = () => {
    const data = getDataForExport()

    if (!data || data.length === 0) {
      alert('다운로드할 데이터가 없습니다.')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '데이터')

    // 파일명에 날짜 범위 추가
    let finalFilename = filename
    if (dateRange?.from) {
      const fromDate = format(dateRange.from, 'yyyyMMdd')
      const toDate = dateRange.to ? format(dateRange.to, 'yyyyMMdd') : fromDate
      finalFilename += `_${fromDate}-${toDate}`
    }

    XLSX.writeFile(workbook, `${finalFilename}.xlsx`)
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className={cn('gap-1', className)}
      onClick={handleDownload}
    >
      <DownloadIcon className="h-4 w-4" />
      {title}
    </Button>
  )
}
