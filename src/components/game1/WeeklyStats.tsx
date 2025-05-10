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

export function WeeklyStats() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>주간 사용자 통계</CardTitle>
          <CardDescription>최근 12주 동안의 주간 사용자 데이터</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full bg-muted/25 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">주간 사용자 차트</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주간 상세 데이터</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주차</TableHead>
                <TableHead>총 방문자</TableHead>
                <TableHead>신규 사용자</TableHead>
                <TableHead>엔딩 완료율</TableHead>
                <TableHead>중도 이탈율</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023년 6주차</TableCell>
                <TableCell>8,764</TableCell>
                <TableCell>2,451</TableCell>
                <TableCell>67.8%</TableCell>
                <TableCell>32.2%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023년 5주차</TableCell>
                <TableCell>8,453</TableCell>
                <TableCell>2,387</TableCell>
                <TableCell>65.2%</TableCell>
                <TableCell>34.8%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023년 4주차</TableCell>
                <TableCell>8,865</TableCell>
                <TableCell>2,512</TableCell>
                <TableCell>64.1%</TableCell>
                <TableCell>35.9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023년 3주차</TableCell>
                <TableCell>8,621</TableCell>
                <TableCell>2,435</TableCell>
                <TableCell>63.4%</TableCell>
                <TableCell>36.6%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
