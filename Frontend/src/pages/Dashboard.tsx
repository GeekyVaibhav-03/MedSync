import { motion } from 'framer-motion';
import { Users, Ticket, Stethoscope, TrendingUp, Activity, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import TokenCard from '@/components/TokenCard';
import ChartCard from '@/components/ChartCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const patientData = [
  { month: 'Jan', patients: 120 }, { month: 'Feb', patients: 180 },
  { month: 'Mar', patients: 240 }, { month: 'Apr', patients: 200 },
  { month: 'May', patients: 310 }, { month: 'Jun', patients: 280 },
];

const departmentData = [
  { department: 'Cardiology', count: 85 }, { department: 'Neurology', count: 65 },
  { department: 'Dentistry', count: 95 }, { department: 'OPD', count: 120 },
];

const recentTokens = [
  { tokenNumber: 101, patientName: 'John Doe', department: 'Cardiology', status: 'in-progress' as const, time: '10:30 AM' },
  { tokenNumber: 102, patientName: 'Jane Smith', department: 'Neurology', status: 'waiting' as const, time: '10:45 AM' },
  { tokenNumber: 103, patientName: 'Bob Wilson', department: 'OPD', status: 'waiting' as const, time: '11:00 AM' },
  { tokenNumber: 100, patientName: 'Alice Brown', department: 'Dentistry', status: 'completed' as const, time: '10:15 AM' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your hospital overview.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
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

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Patient Trends" subtitle="Monthly patient visits">
          <ResponsiveContainer width="100%" height={250}>
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

        <ChartCard title="Department Stats" subtitle="Patients by department">
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Token Queue</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Live updates
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
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

export default Dashboard;
