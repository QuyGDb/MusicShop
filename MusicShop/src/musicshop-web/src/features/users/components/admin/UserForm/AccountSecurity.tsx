import { Unlock, Lock, CreditCard, History } from 'lucide-react';
import { Button } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { Control, useWatch } from 'react-hook-form';

interface AccountSecurityProps {
  control: Control<{ role: 'Customer' | 'Admin'; status: 'Active' | 'Locked' }>;
  onToggleStatus: () => void;
  totalSpent: number;
}

export function AccountSecurity({ control, onToggleStatus, totalSpent }: any) {

  const status = useWatch({
    control,
    name: 'status',
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-subtle">Security Controls</label>
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            {status === 'Active' ? <Unlock className="h-5 w-5 text-emerald-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            <div>
              <p className="text-sm font-bold text-foreground">Account Status</p>
              <p className="text-[10px] text-muted-foreground">Current: <span className="font-bold">{status}</span></p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("rounded-xl text-xs", status === 'Active' ? "border-red-200 text-red-500 hover:bg-red-50" : "border-emerald-200 text-emerald-500 hover:bg-emerald-50")}
            onClick={onToggleStatus}
          >
            {status === 'Active' ? 'Lock Account' : 'Unlock Account'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-subtle">Quick Stats</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/10 rounded-xl flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[10px] text-subtle leading-none">Spent</p>
              <p className="text-xs font-black">${totalSpent.toFixed(0)}</p>
            </div>
          </div>
          <div className="p-3 bg-muted/10 rounded-xl flex items-center gap-3">
            <History className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[10px] text-subtle leading-none">Visits</p>
              <p className="text-xs font-black">24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

