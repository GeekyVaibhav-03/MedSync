import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: string;
  color?: 'primary' | 'info' | 'warning' | 'success';
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
};

const StatCard = ({ icon: Icon, value, label, trend, color = 'primary' }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="healthcare-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-primary">{trend}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
