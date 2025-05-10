import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Link, useRouterState } from '@tanstack/react-router'
import { BarChartIcon, UsersIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createRootRoute({
  component: () => {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Link to="/" className="text-xl">
                짐빔 게임 관리자
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center">
                <div className="relative">
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      <img
                        className="aspect-square h-full w-full"
                        src="https://avatars.githubusercontent.com/u/124599?v=4"
                        alt="관리자"
                      />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
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
          <Outlet />
        </div>
      </div>
    )
  },
})
