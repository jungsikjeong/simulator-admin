import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FileSpreadsheetIcon } from 'lucide-react'

export function UserDetails() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>사용자 상세 정보</CardTitle>
            <CardDescription>
              모든 사용자의 상세 정보 및 진행 상태
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <FileSpreadsheetIcon className="h-4 w-4" />
            엑셀 다운로드
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자 ID</TableHead>
                <TableHead>최근 접속일</TableHead>
                <TableHead>진행 상태</TableHead>
                <TableHead>플레이 시간</TableHead>
                <TableHead>진행률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>user_12345</TableCell>
                <TableCell>2023-02-09 14:25</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    엔딩 완료
                  </span>
                </TableCell>
                <TableCell>45분 12초</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>user_12346</TableCell>
                <TableCell>2023-02-09 13:42</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                    진행 중
                  </span>
                </TableCell>
                <TableCell>32분 05초</TableCell>
                <TableCell>67%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>user_12347</TableCell>
                <TableCell>2023-02-09 12:18</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                    중도 이탈
                  </span>
                </TableCell>
                <TableCell>8분 45초</TableCell>
                <TableCell>23%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>user_12348</TableCell>
                <TableCell>2023-02-09 11:37</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    엔딩 완료
                  </span>
                </TableCell>
                <TableCell>51분 32초</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>user_12349</TableCell>
                <TableCell>2023-02-09 10:58</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                    중도 이탈
                  </span>
                </TableCell>
                <TableCell>12분 17초</TableCell>
                <TableCell>35%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
