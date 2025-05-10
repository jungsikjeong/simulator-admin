import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const loginRouteSearch = z.object({
  redirect: z.string().optional().catch(undefined),
});
export const Route = createFileRoute('/auth/signin/')({
  validateSearch: loginRouteSearch,
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  rememberEmail: z.boolean().default(false),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
      rememberEmail: !!localStorage.getItem('rememberedEmail'),
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError('');

    try {
      if (values.rememberEmail) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      navigate({ to: redirectTo || '/' });
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('로그인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-lg sm:text-2xl font-semibold flex items-center justify-between'>
            <Button
              variant='ghost'
              size='sm'
              className='p-0'
              onClick={() => navigate({ to: '/' })}
            >
              <ArrowLeftIcon className='w-4 h-4' />
              <span className='sr-only'>뒤로가기</span>
            </Button>
            <div className='flex-1 text-center'>계정에 로그인하세요</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='이메일 주소를 입력하세요'
                        type='email'
                        autoComplete='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='비밀번호를 입력하세요'
                        type='password'
                        autoComplete='current-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='rememberEmail'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <div className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <label
                          htmlFor='rememberEmail'
                          className='text-sm font-medium text-gray-700'
                        >
                          이메일 저장하기
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {error && (
                <div className='text-sm text-red-500 text-center'>{error}</div>
              )}

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
