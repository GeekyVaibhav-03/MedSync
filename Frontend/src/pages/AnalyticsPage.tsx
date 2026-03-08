import { motion } from 'framer-motion';
import ChartCard from '@/components/ChartCard';
import StatCard from '@/components/StatCard';
import { Users, TrendingUp, Activity, Calendar } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', patients: 420, revenue: 52 },
  { month: 'Feb', patients: 380, revenue: 48 },
  { month: 'Mar', patients: 510, revenue: 64 },
  { month: 'Apr', patients: 470, revenue: 58 },
  { month: 'May', patients: 620, revenue: 78 },
  { month: 'Jun', patients: 580, revenue: 72 },
];

const departmentData = [
  { name: 'Cardiology', value: 30, color: 'hsl(160, 84%, 39%)' },
  { name: 'Neurology', value: 22, color: 'hsl(210, 80%, 55%)' },
  { name: 'Dentistry', value: 28, color: 'hsl(38, 92%, 50%)' },
  { name: 'OPD', value: 20, color: 'hsl(280, 60%, 55%)' },
];

const dailyVisits = [
  { day: 'Mon', visits: 45 }, { day: 'Tue', visits: 52 },
  { day: 'Wed', visits: 49 }, { day: 'Thu', visits: 63 },
  { day: 'Fri', visits: 58 }, { day: 'Sat', visits: 35 },
  { day: 'Sun', visits: 20 },
];

const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights into hospital operations</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <StatCard icon={Users} value="3,842" label="Total Patients" trend="+18%" color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={TrendingUp} value="$372K" label="Revenue" trend="+8.2%" color="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={Activity} value="94.2%" label="Satisfaction" color="info" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={Calendar} value="12 min" label="Avg Wait Time" trend="-3 min" color="warning" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Patient Trends" subtitle="Monthly patient flow analysis">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
              <XAxis dataKey="month" fontSize={12} stroke="hsl(160, 10%, 45%)" />
              <YAxis fontSize={12} stroke="hsl(160, 10%, 45%)" />
              <Tooltip />
              <Area type="monotone" dataKey="patients" stroke="hsl(160, 84%, 39%)" fill="url(#grad1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Distribution" subtitle="Patient distribution by department">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={12}>
                {departmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Visits" subtitle="Patient visits this week">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyVisits}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(160, 10%, 45%)" />
              <YAxis fontSize={12} stroke="hsl(160, 10%, 45%)" />
              <Tooltip />
              <Bar dataKey="visits" fill="hsl(160, 84%, 39%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Trends" subtitle="Monthly revenue in thousands">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" />
              <XAxis dataKey="month" fontSize={12} stroke="hsl(160, 10%, 45%)" />
              <YAxis fontSize={12} stroke="hsl(160, 10%, 45%)" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(210, 80%, 55%)" strokeWidth={2} dot={{ fill: 'hsl(210, 80%, 55%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
