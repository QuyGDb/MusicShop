import { 
  X, 
  Shield, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Lock, 
  Unlock,
  ShieldCheck,
  CreditCard,
  History
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { UserProfile, UserRole, UserStatus } from '@/pages/admin/CustomerManagementPage';
import { useState } from 'react';

interface UserEditModalProps {
  user: UserProfile;
  onClose: () => void;
}

export default function UserEditModal({ user, onClose }: UserEditModalProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
       <Card className="w-full max-w-2xl bg-surface border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
         <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-3">
               <div className="bg-primary/10 p-2 rounded-xl">
                  <UserIcon className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold text-foreground">Manage Account</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">ID: {user.id}</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-6 w-6" />
            </Button>
         </CardHeader>

         <CardContent className="p-8 space-y-10">
            {/* Header / Profile Summary */}
            <div className="flex items-center gap-6">
               <div className="h-20 w-20 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center relative overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-10 w-10 text-primary/40" />
                  )}
                  <div className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-surface" />
               </div>
               <div className="flex-1">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{user.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-1">
                     <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                     </span>
                     <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Joined {user.joinDate}
                     </span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
               {/* Role Management */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-subtle">Privilege Level</label>
                  <div className="space-y-3">
                     <div 
                        onClick={() => setRole('Customer')}
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
                        onClick={() => setRole('Admin')}
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

               {/* Account Security */}
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
                          onClick={() => setStatus(status === 'Active' ? 'Locked' : 'Active')}
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
                             <p className="text-xs font-black">${user.totalSpent.toFixed(0)}</p>
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
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
               <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={onClose}>Discard Changes</Button>
               <Button className="flex-[2] h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20" onClick={handleSave} disabled={isSaving}>
                 {isSaving ? "Syncing Identity..." : "Apply Account Updates"}
               </Button>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}
