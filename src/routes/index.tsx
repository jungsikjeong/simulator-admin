import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { checkAdminAuth } from '@/utils/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChartIcon, UsersIcon } from 'lucide-react'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { isAdmin, isLoggedIn } = await checkAdminAuth()

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/signin',
        search: {
          redirect: '/',
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

  component: App,
})

function App() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">관리자 대시보드</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:bg-muted/20 transition-colors">
          <Link to="/game1" className="block p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>게임1 통계</CardTitle>
              <CardDescription>
                게임1의 사용자 현황 및 통계를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-32 bg-muted/25 rounded-md flex items-center justify-center">
                <BarChartIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/20 transition-colors">
          <Link to="/game2" className="block p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>게임2 통계</CardTitle>
              <CardDescription>
                게임2의 사용자 현황 및 통계를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-32 bg-muted/25 rounded-md flex items-center justify-center">
                <UsersIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
