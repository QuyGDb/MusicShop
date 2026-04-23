import { TrendingUp, Users, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight, Package, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

export function AdminDashboard() {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: '$12,458.00', 
      change: '+12.5%', 
      isPositive: true, 
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Total Orders', 
      value: '1,284', 
      change: '+18.2%', 
      isPositive: true, 
      icon: ShoppingBag,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      label: 'New Customers', 
      value: '154', 
      change: '-2.4%', 
      isPositive: false, 
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.24%', 
      change: '+4.1%', 
      isPositive: true, 
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ];

  const recentOrders = [
    { id: '#ORD-7234', customer: 'Sarah Johnson', date: '2 mins ago', amount: '$124.99', status: 'Completed' },
    { id: '#ORD-7233', customer: 'Michael Chen', date: '15 mins ago', amount: '$45.00', status: 'Pending' },
    { id: '#ORD-7232', customer: 'Emma Williams', date: '1 hour ago', amount: '$89.95', status: 'Completed' },
    { id: '#ORD-7231', customer: 'James Brown', date: '3 hours ago', amount: '$210.00', status: 'Processing' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard Oversight</h1>
        <p className="text-muted-foreground">Welcome to your administration command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-surface border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all group overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                  stat.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}>
                  {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors origin-left">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-surface border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-muted/30 border-b border-border">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
            <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider">View All</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.customer}</td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight",
                          order.status === 'Completed' ? "bg-emerald-100 text-emerald-700" :
                          order.status === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-subtle font-medium text-right">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="p-6 border-b border-border bg-muted/30">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>In Stock</span>
                  <span className="text-foreground">84%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Low Stock</span>
                  <span className="text-foreground">12%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Out of Stock</span>
                  <span className="text-foreground">4%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '4%' }} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-muted-foreground">Database is healthy</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Sync completed 12m ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
