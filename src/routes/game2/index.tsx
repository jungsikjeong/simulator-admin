import { Game2Stats } from '@/components/game2'
import { checkAdminAuth } from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

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
