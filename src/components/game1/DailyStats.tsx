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

export function DailyStats() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>일별 사용자 통계</CardTitle>
          <CardDescription>최근 30일 동안의 일별 사용자 데이터</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full bg-muted/25 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">일별 사용자 차트</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>일별 상세 데이터</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>방문자 수</TableHead>
                <TableHead>신규 사용자</TableHead>
                <TableHead>엔딩 완료</TableHead>
                <TableHead>중도 이탈</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-02-09</TableCell>
                <TableCell>1,235</TableCell>
                <TableCell>357</TableCell>
                <TableCell>823</TableCell>
                <TableCell>412</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-02-08</TableCell>
                <TableCell>1,187</TableCell>
                <TableCell>301</TableCell>
                <TableCell>796</TableCell>
                <TableCell>391</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-02-07</TableCell>
                <TableCell>1,254</TableCell>
                <TableCell>328</TableCell>
                <TableCell>845</TableCell>
                <TableCell>409</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-02-06</TableCell>
                <TableCell>1,198</TableCell>
                <TableCell>315</TableCell>
                <TableCell>812</TableCell>
                <TableCell>386</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
