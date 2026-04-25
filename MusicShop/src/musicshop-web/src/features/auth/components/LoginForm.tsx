import { Button, Input, Label } from '@/shared/components';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginForm } from '@/features/auth';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    handleGoogleSuccess
  } = useLoginForm();

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
        <p className="text-neutral-400">Enter your credentials to access your account</p>
      </div>

      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors duration-500" />

        <form
          onSubmit={handleSubmit}
          className="space-y-5 relative z-10"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</Label>
              <Button type="button" variant="link" className="p-0 h-auto text-xs text-neutral-400">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <div className="p-3 text-sm bg-red-900/20 border border-red-900/50 text-red-400 rounded-md">
              {serverError}
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-8 z-10 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-neutral-700 to-neutral-700"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 whitespace-nowrap">
            Or continue with
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-neutral-700 to-neutral-700"></div>
        </div>

        <div className="flex justify-center w-full relative z-10">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error('Google login was unsuccessful');
            }}
            theme="filled_black"
            shape="pill"
            width="384"
            text="signin_with"
          />
        </div>
      </div>

      <p className="text-center text-sm text-neutral-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

