import { Link } from 'react-router-dom';
import { Button, Input, Label, Alert, AlertDescription, AlertTitle } from '@/shared/components';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { useRegisterForm, registerSchema } from '@/features/auth';

export function RegisterForm() {
  const {
    form,
    isSubmitting,
    serverError,
  } = useRegisterForm();

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600/10 p-3 rounded-2xl">
            <UserPlus className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-neutral-400">Join MusicShop and start your collection</p>
      </div>

      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors duration-500" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5 relative z-10"
        >
          {serverError && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Field
            name="fullName"
            validators={{
              onChange: registerSchema.shape.fullName,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-neutral-300">Full Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${field.state.meta.errors.length > 0 ? 'border-red-500/50' : ''}`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: registerSchema.shape.email,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-neutral-300">Email Address</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${field.state.meta.errors.length > 0 ? 'border-red-500/50' : ''}`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: registerSchema.shape.password,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-neutral-300">Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${field.state.meta.errors.length > 0 ? 'border-red-500/50' : ''}`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue('password')) {
                  return 'Passwords do not match';
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-neutral-300">Confirm Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${field.state.meta.errors.length > 0 ? 'border-red-500/50' : ''}`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}


