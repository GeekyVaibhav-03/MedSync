import { motion } from 'framer-motion';
import { Users, Ticket, Stethoscope, TrendingUp, Activity, Clock, UserPlus, FileText, Settings, BarChart3 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import TokenCard from '@/components/TokenCard';
import ChartCard from '@/components/ChartCard';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const patientData = [
  { month: 'Jan', patients: 120 }, { month: 'Feb', patients: 180 },
  { month: 'Mar', patients: 240 }, { month: 'Apr', patients: 200 },
  { month: 'May', patients: 310 }, { month: 'Jun', patients: 280 },
];

const departmentData = [
  { department: 'Cardiology', count: 85 }, { department: 'Neurology', count: 65 },
  { department: 'Dentistry', count: 95 }, { department: 'OPD', count: 120 },
];

const roleData = [
  { name: 'Doctors', value: 24, color: '#0ea5e9' },
  { name: 'Lab Staff', value: 12, color: '#f59e0b' },
  { name: 'Pharmacy', value: 8, color: '#22c55e' },
  { name: 'Admin', value: 4, color: '#16a34a' },
];

const recentTokens = [
  { tokenNumber: 101, patientName: 'John Doe', department: 'Cardiology', status: 'in-progress' as const, time: '10:30 AM' },
  { tokenNumber: 102, patientName: 'Jane Smith', department: 'Neurology', status: 'waiting' as const, time: '10:45 AM' },
  { tokenNumber: 103, patientName: 'Bob Wilson', department: 'OPD', status: 'waiting' as const, time: '11:00 AM' },
  { tokenNumber: 100, patientName: 'Alice Brown', department: 'Dentistry', status: 'completed' as const, time: '10:15 AM' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Complete hospital overview and management controls</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" /> Reports
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard icon={Users} value="1,247" label="Total Patients" trend="+12% from last month" color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={Ticket} value="48" label="Active Tokens" trend="8 in queue" color="info" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={Stethoscope} value="24" label="Doctors Online" color="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={TrendingUp} value="95%" label="Success Rate" color="warning" />
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Patient Trends" subtitle="Monthly patient visits">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={patientData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
                <XAxis dataKey="month" fontSize={12} stroke="hsl(160, 10%, 45%)" />
                <YAxis fontSize={12} stroke="hsl(160, 10%, 45%)" />
                <Tooltip />
                <Area type="monotone" dataKey="patients" stroke="hsl(160, 84%, 39%)" fillOpacity={1} fill="url(#colorPatients)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Staff Distribution" subtitle="By role">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {roleData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Department Stats */}
      <ChartCard title="Department Statistics" subtitle="Today's patient distribution">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
            <XAxis dataKey="department" fontSize={12} stroke="hsl(160, 10%, 45%)" />
            <YAxis fontSize={12} stroke="hsl(160, 10%, 45%)" />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(160, 84%, 39%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Token Queue */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Live Token Queue</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Live updates
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentTokens.map((token) => (
            <TokenCard key={token.tokenNumber} {...token} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
