import { User as UserIcon, Mail, Calendar } from 'lucide-react';

interface UserProfileHeaderProps {
  user: {
    name: string;
    email: string;
    joinDate: string;
    avatarUrl?: string;
  };
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="h-20 w-20 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center relative overflow-hidden">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.name} />
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
  );
}
