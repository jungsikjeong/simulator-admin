import { createFileRoute, redirect } from '@tanstack/react-router'
import { checkAdminAuth } from '@/utils/auth'
import { Game1Stats } from '@/components/game1'

export const Route = createFileRoute('/game1/')({
  beforeLoad: async () => {
    const { isAdmin, isLoggedIn } = await checkAdminAuth()

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/signin',
        search: {
          redirect: '/game1',
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

  component: Game1Stats,
})
