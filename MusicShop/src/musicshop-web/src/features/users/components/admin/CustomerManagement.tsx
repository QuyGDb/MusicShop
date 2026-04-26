import { Users, Search, Filter, Edit2, Trash2, Shield, User as UserIcon, Clock, DollarSign, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { UserEditModal } from './UserEditModal';
import { useCustomerManagement } from '../../hooks/useCustomerManagement';
import { UserRole, UserStatus } from '../../types';

/**
 * Presentational component for community and CRM management.
 * Logic is delegated to useCustomerManagement hook.
 */
export function CustomerManagement() {
  const {
    users,
    stats,
    selectedUser,
    deletingUserId,
    actions
  } = useCustomerManagement();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Community & CRM</h1>
        <p className="text-muted-foreground">Manage user identities, access levels, and customer relationships.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface border-border">
          <CardContent className="p-6 flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
             </div>
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-subtle">Total Members</p>
                <p className="text-2xl font-black text-foreground">{stats.total}</p>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardContent className="p-6 flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-emerald-50">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
             </div>
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-subtle">Active Customers</p>
                <p className="text-2xl font-black text-foreground">{stats.active}</p>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardContent className="p-6 flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-amber-50">
                <Shield className="h-6 w-6 text-amber-500" />
             </div>
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-subtle">Administrators</p>
                <p className="text-2xl font-black text-foreground">{stats.admins}</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..."
            className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
        <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* User Table */}
      <Card className="bg-surface border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Member</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Role</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle px-8">Last Login</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Total Spent</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Status</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors group relative">
                  <td className="p-5">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                           {user.avatarUrl ? (
                             <img src={user.avatarUrl} className="h-full w-full rounded-full object-cover" />
                           ) : (
                             <UserIcon className="h-5 w-5 text-primary" />
                           )}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="font-bold text-foreground truncate">{user.name}</span>
                           <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-5">
                     <div className={cn(
                       "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                       user.role === UserRole.Admin ? "bg-primary/20 text-primary border-primary/20" : "bg-muted text-subtle border-border"
                     )}>
                        {user.role === UserRole.Admin && <Shield className="h-3 w-3" />}
                        {user.role}
                     </div>
                  </td>
                  <td className="p-5 px-8">
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {user.lastLogin}
                     </div>
                  </td>
                  <td className="p-5">
                     <div className="flex items-center gap-1 font-bold text-foreground">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        {user.totalSpent.toFixed(2)}
                     </div>
                  </td>
                  <td className="p-5 text-sm">
                    {user.status === UserStatus.Active ? (
                       <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                       </span>
                    ) : (
                       <span className="flex items-center gap-1.5 text-red-500 font-bold">
                          < ShieldAlert className="h-3.5 w-3.5" />
                          Locked
                       </span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                     <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl"
                          onClick={() => actions.openEdit(user)}
                        >
                           <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-muted-foreground hover:text-red-500 rounded-xl"
                          onClick={() => actions.confirmDelete(user.id)}
                        >
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </td>

                  {/* Inline Delete Confirmation */}
                  {deletingUserId === user.id && (
                    <div className="absolute inset-0 bg-red-600/95 backdrop-blur-sm z-10 flex items-center justify-between px-8 animate-in fade-in slide-in-from-right-4">
                       <div className="flex items-center gap-4 text-white">
                          <Trash2 className="h-6 w-6" />
                          <div>
                            <p className="font-black uppercase tracking-widest text-sm">Permanent Deletion</p>
                            <p className="text-xs text-white/80">Are you absolutely sure you want to delete <span className="font-bold underline">{user.name}</span>?</p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <Button 
                            variant="ghost" 
                            className="text-white hover:bg-white/10"
                            onClick={actions.cancelDelete}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-white text-red-600 hover:bg-red-50 font-bold"
                            onClick={() => actions.executeDelete(user.id)}
                          >
                            Yes, Delete Forever
                          </Button>
                       </div>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {selectedUser && (
        <UserEditModal 
          user={selectedUser} 
          onClose={actions.closeEdit} 
        />
      )}
    </div>
  );
}
