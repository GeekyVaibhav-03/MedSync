import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';

interface TokenCardProps {
  tokenNumber: number;
  patientName: string;
  department: string;
  status: 'waiting' | 'in-progress' | 'completed';
  time: string;
}

const statusStyles = {
  waiting: 'bg-warning/10 text-warning',
  'in-progress': 'bg-info/10 text-info',
  completed: 'bg-success/10 text-success',
};

const TokenCard = ({ tokenNumber, patientName, department, status, time }: TokenCardProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="healthcare-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-primary">#{tokenNumber}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
          {status.replace('-', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground mb-1">
        <User className="h-4 w-4 text-muted-foreground" />
        {patientName}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{department}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {time}
      </div>
    </motion.div>
  );
};

export default TokenCard;
