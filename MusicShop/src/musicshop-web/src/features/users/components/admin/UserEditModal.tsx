import { X, User as UserIcon } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { UserProfile } from '../../types';

// New specialized components and hooks
import { useUserForm } from '../../hooks/useUserForm';
import { UserProfileHeader } from './UserForm/UserProfileHeader';
import { RoleSelection } from './UserForm/RoleSelection';
import { AccountSecurity } from './UserForm/AccountSecurity';

interface UserEditModalProps {
  user: UserProfile;
  onClose: () => void;
}

export function UserEditModal({ user, onClose }: UserEditModalProps) {
  const { 
    handleSubmit, 
    control, 
    isSubmitting, 
    toggleStatus, 
    setRole 
  } = useUserForm({
    initialValues: {
      role: user.role,
      status: user.status,
    },
    onSuccess: onClose,
  });

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
            <UserProfileHeader user={user} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
               <RoleSelection control={control} onSetRole={setRole} />
               <AccountSecurity 
                 control={control} 
                 onToggleStatus={toggleStatus} 
                 totalSpent={user.totalSpent} 
               />
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
               <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={onClose}>Discard Changes</Button>
               <Button 
                 className="flex-[2] h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20" 
                 onClick={handleSubmit} 
                 disabled={isSubmitting}
               >
                 {isSubmitting ? "Syncing Identity..." : "Apply Account Updates"}
               </Button>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}

