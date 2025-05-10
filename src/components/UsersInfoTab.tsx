import { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search } from 'lucide-react';

interface User {
  id: number;
  name: string;
  lastLogin: string;
  visits: number;
  avgTimeSpent: string;
}

interface UsersInfoTabProps {
  mockUsers: User[];
}

export function UsersInfoTab({ mockUsers }: UsersInfoTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // 검색어에 따라 사용자 필터링
  useEffect(() => {
    const filtered = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, mockUsers]);

  // 정렬 함수
  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  // 정렬 방향 표시 함수
  const getSortDirection = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <TabsContent value='users'>
      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
            <div>
              <CardTitle>사용자 정보</CardTitle>
              <CardDescription>
                등록된 사용자 목록과 활동 정보입니다.
              </CardDescription>
            </div>
            <div className='relative w-full md:w-64'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='사용자 검색...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => requestSort('id')}
                  >
                    사용자 ID {getSortDirection('id')}
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => requestSort('name')}
                  >
                    이름 {getSortDirection('name')}
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => requestSort('lastLogin')}
                  >
                    마지막 로그인 {getSortDirection('lastLogin')}
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => requestSort('visits')}
                  >
                    방문 횟수 {getSortDirection('visits')}
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => requestSort('avgTimeSpent')}
                  >
                    평균 사용 시간 {getSortDirection('avgTimeSpent')}
                  </TableHead>
                  <TableHead className='w-[50px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.visits}</TableCell>
                      <TableCell>{user.avgTimeSpent}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <span className='sr-only'>메뉴 열기</span>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>작업</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>상세 정보 보기</DropdownMenuItem>
                            <DropdownMenuItem>활동 기록 보기</DropdownMenuItem>
                            <DropdownMenuItem>메시지 보내기</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-600'>
                              계정 비활성화
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              총 {filteredUsers.length}명의 사용자
            </div>
            <div className='flex items-center space-x-2'>
              <Button variant='outline' size='sm' disabled>
                이전
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='bg-primary text-primary-foreground'
              >
                1
              </Button>
              <Button variant='outline' size='sm'>
                2
              </Button>
              <Button variant='outline' size='sm'>
                3
              </Button>
              <Button variant='outline' size='sm'>
                다음
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
