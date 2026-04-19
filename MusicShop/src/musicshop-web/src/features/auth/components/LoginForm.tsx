import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginForm } from '@/features/auth';

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    serverError,
    errors,
    onSubmit,
    handleGoogleSuccess,
    setServerError
  } = useLoginForm();

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center text-neutral-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border-neutral-700"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button type="button" variant="link" className="p-0 h-auto text-xs text-neutral-400">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800 border-neutral-700"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          {serverError && (
            <div className="p-3 text-sm bg-red-900/20 border border-red-900/50 text-red-400 rounded-md">
              {serverError}
            </div>
          )}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setServerError('Google login was unsuccessful');
            }}
            theme="filled_black"
            shape="pill"
            width="384"
            text="signin_with"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-neutral-400">
        <p className="text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
