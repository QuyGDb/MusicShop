import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginForm, loginSchema } from '@/features/auth';

export function LoginForm() {
  const {
    form,
    isSubmitting,
    serverError,
    handleGoogleSuccess
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{
              onChange: loginSchema.shape.email,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-neutral-800 border-neutral-700"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: loginSchema.shape.password,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>Password</Label>
                  <Button type="button" variant="link" className="p-0 h-auto text-xs text-neutral-400">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-neutral-800 border-neutral-700"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

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
              console.error('Google login was unsuccessful');
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
