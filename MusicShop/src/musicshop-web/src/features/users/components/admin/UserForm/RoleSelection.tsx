import { User as UserIcon, Shield } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Control, useWatch } from 'react-hook-form';

interface RoleSelectionProps {
  control: Control<{ role: 'Customer' | 'Admin'; status: 'Active' | 'Locked' }>;
  onSetRole: (role: 'Customer' | 'Admin') => void;
}

export function RoleSelection({ control, onSetRole }: any) {

  const role = useWatch({
    control,
    name: 'role',
  });

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-subtle">Privilege Level</label>
      <div className="space-y-3">
        <div 
          onClick={() => onSetRole('Customer')}
          className={cn(
            "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
            role === 'Customer' ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
          )}
        >
          <div className={cn("p-2 rounded-lg", role === 'Customer' ? "bg-primary text-white" : "bg-muted text-subtle")}>
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Customer</p>
            <p className="text-[10px] text-muted-foreground">Standard store access</p>
          </div>
          {role === 'Customer' && <div className="h-2 w-2 rounded-full bg-primary" />}
        </div>

        <div 
          onClick={() => onSetRole('Admin')}
          className={cn(
            "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
            role === 'Admin' ? "border-amber-500 bg-amber-50" : "border-border hover:border-amber-300"
          )}
        >
          <div className={cn("p-2 rounded-lg", role === 'Admin' ? "bg-amber-500 text-white" : "bg-muted text-subtle")}>
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Administrator</p>
            <p className="text-[10px] text-muted-foreground">Full back-office permissions</p>
          </div>
          {role === 'Admin' && <div className="h-2 w-2 rounded-full bg-amber-500" />}
        </div>
      </div>
    </div>
  );
}

