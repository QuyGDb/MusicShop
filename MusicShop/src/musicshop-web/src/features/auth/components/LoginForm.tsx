'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../schemas/loginSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setApiError(null);
    const result = await authService.login(data);

    if (result.success && result.data) {
      setAuth(result.data.user, result.data.accessToken);
      router.push('/');
    } else {
      setApiError(result.error?.message || 'Đăng nhập thất bại');
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Logic cho Bước 5 sẽ ở đây
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center text-neutral-400">
          Nhập thông tin của bạn để truy cập tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-neutral-800 border-neutral-700"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Button variant="link" className="p-0 h-auto text-xs text-neutral-400">
                Quên mật khẩu?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              className="bg-neutral-800 border-neutral-700"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          {apiError && (
            <div className="p-3 text-sm bg-red-900/20 border border-red-900/50 text-red-400 rounded-md">
              {apiError}
            </div>
          )}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-900 px-2 text-neutral-400">Hoặc tiếp tục với</span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full border-neutral-700 hover:bg-neutral-800"
          onClick={handleGoogleLogin}
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-neutral-400">
        Chưa có tài khoản?{' '}
        <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300">
          Đăng ký ngay
        </Button>
      </CardFooter>
    </Card>
  );
}
