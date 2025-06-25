import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { QUERY_KEYS, TABLE_NAMES } from '@/constants'
import { useGameMembers } from '@/hooks/useGameMembers'
import { getStatusText } from '@/utils/getStatusText'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'

type Member = {
  id: string
  name: string
  created_at: string
  status: 'in_progress' | 'completed' | 'pending' | 'abandoned'
}

type SortDirection = 'asc' | 'desc'

export function UserDetails() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const { data: gameMembers } = useGameMembers(
    [...QUERY_KEYS.game1Stats.all()],
    TABLE_NAMES.MEMBERS,
    null,
    null,
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // sm breakpoint
        setItemsPerPage(3)
      } else if (window.innerWidth < 1024) {
        // lg breakpoint
        setItemsPerPage(4)
      } else {
        setItemsPerPage(5)
      }
    }

    handleResize()

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 필터링 및 정렬된 데이터 계산
  const filteredAndSortedData = () => {
    if (!gameMembers) return []

    // 필터링
    let filteredData = [...gameMembers.data]
    if (statusFilter) {
      filteredData = filteredData.filter(
        (member) => member.status === statusFilter,
      )
    }

    // 정렬 (항상 created_at을 기준으로)
    filteredData.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
    })

    return filteredData
  }

  const processedData = filteredAndSortedData()

  // 페이지네이션 계산
  const totalItems = processedData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  // 현재 페이지에 표시할 아이템들
  const currentItems = processedData.slice(startIndex, endIndex)

  // 필터 또는 정렬 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, sortDirection])

  // 이전 페이지로 이동
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  // 다음 페이지로 이동
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // 특정 페이지로 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700'
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700'
      case 'pending':
        return 'bg-blue-50 text-blue-700'
      case 'abandoned':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'yyyy-MM-dd HH:mm')
    } catch (e) {
      return dateString
    }
  }

  const renderPaginationNumbers = () => {
    if (totalPages <= 5) {
      // 5페이지 이하면 모든 페이지 번호 표시
      return Array.from({ length: totalPages }).map((_, i) => (
        <PaginationItem key={i + 1}>
          <PaginationLink
            onClick={() => goToPage(i + 1)}
            isActive={currentPage === i + 1}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))
    }

    // 5페이지 초과인 경우 현재 페이지 주변과 처음/마지막 페이지 표시
    const items = []

    // 이전 버튼 다음 페이지
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink
          onClick={() => goToPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // 현재 페이지가 4보다 크면 처음과 현재 페이지 사이에 생략 부호 추가
    if (currentPage > 4) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // 현재 페이지 주변 페이지
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // 현재 페이지가 totalPages-3보다 작으면 현재 페이지와 마지막 페이지 사이에 생략 부호 추가
    if (currentPage < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // 마지막 페이지
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            onClick={() => goToPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  // 정렬 방향 전환
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>사용자 상세 정보</CardTitle>
            <CardDescription>
              모든 사용자의 상세 정보 및 진행 상태 (총 {gameMembers?.count}명)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            필터
          </Button>
        </CardHeader>

        {showFilters && (
          <div className="px-6 pb-2 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="text-sm font-medium mb-1 block">
                진행 상태
              </label>
              <Select
                value={statusFilter || 'all'}
                onValueChange={(value) =>
                  setStatusFilter(value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="모든 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="in_progress">진행 중</SelectItem>
                  <SelectItem value="completed">엔딩 완료</SelectItem>
                  <SelectItem value="pending">대기 중</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="text-sm font-medium mb-1 block">
                정렬 방향
              </label>
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
                onClick={toggleSortDirection}
              >
                최근 접속일 {sortDirection === 'desc' ? '내림차순' : '오름차순'}
                {sortDirection === 'desc' ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">사용자 ID</TableHead>
                  <TableHead className="w-1/3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={toggleSortDirection}
                    >
                      최근 접속일
                      {sortDirection === 'desc' ? (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-1/3">진행 상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((member: Member) => (
                    <TableRow key={member.id}>
                      <TableCell className="break-all font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(member.created_at)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(member.status)}`}
                        >
                          {getStatusText(member.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      {statusFilter
                        ? '해당 상태의 사용자가 없습니다'
                        : '데이터가 없습니다'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-y-0 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={goToPreviousPage}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    >
                      Previous
                    </PaginationPrevious>
                  </PaginationItem>

                  {renderPaginationNumbers()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={goToNextPage}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    >
                      Next
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
