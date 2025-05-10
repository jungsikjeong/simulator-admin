import { createFileRoute, redirect } from '@tanstack/react-router'
import { checkAdminAuth } from '@/utils/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CalendarIcon, DownloadIcon, FileSpreadsheetIcon } from 'lucide-react'

export const Route = createFileRoute('/game2/')({
  beforeLoad: async () => {
    const { isAdmin, isLoggedIn } = await checkAdminAuth()

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/signin',
        search: {
          redirect: '/game2',
        },
      })
    }

    if (!isAdmin) {
      console.log('관리자 권한이 없습니다.')
      throw redirect({
        to: '/auth/signin',
      })
    }
  },

  component: Game2Stats,
})

function Game2Stats() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>게임2</CardTitle>
          <CardDescription>게임2는 준비중입니다.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
