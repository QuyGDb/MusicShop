import React, { useState } from 'react';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const RegisterForm: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // Controlled component states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullName || fullName.length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    const result = await authService.register({ email, password, fullName });

    if (result.success && result.data) {
      setAuth(result.data.user, result.data.accessToken);
      navigate('/');
    } else {
      setServerError(result.error?.message || 'An unexpected error occurred during registration.');
    }
    setIsSubmitting(false);
  };

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
        
        <form onSubmit={onSubmit} className="space-y-5 relative z-10">
          {serverError && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-neutral-300">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.fullName ? 'border-red-500/50' : ''}`}
            />
            {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-neutral-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
          </div>

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
};
