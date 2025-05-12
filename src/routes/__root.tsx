import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { BarChartIcon, UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createRootRoute({
  component: () => {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user || null)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      return () => subscription.unsubscribe()
    }, [])

    return (
      <div className="flex min-h-screen flex-col ">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Link to="/" className="text-xl">
                짐빔 게임 관리자
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {user && (
            <aside className="w-64 border-r bg-muted/40">
              <nav className="grid gap-1 p-2 text-sm font-medium">
                <Button
                  variant="ghost"
                  className={cn(
                    'justify-start gap-2',
                    currentPath === '/game1'
                      ? 'bg-muted text-primary font-medium'
                      : 'text-muted-foreground',
                  )}
                  asChild
                >
                  <Link to="/game1">
                    <BarChartIcon className="h-4 w-4" />
                    게임1 통계
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'justify-start gap-2',
                    currentPath === '/game2'
                      ? 'bg-muted text-primary font-medium'
                      : 'text-muted-foreground',
                  )}
                  asChild
                >
                  <Link to="/game2">
                    <UsersIcon className="h-4 w-4" />
                    게임2 통계
                  </Link>
                </Button>
              </nav>
            </aside>
          )}
          <Outlet />
        </div>
      </div>
    )
  },
})
