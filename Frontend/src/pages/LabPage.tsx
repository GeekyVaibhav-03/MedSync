import { motion } from 'framer-motion';
import { FlaskConical, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';

const labReports = [
  { id: 1, patient: 'John Doe', test: 'Blood Test (CBC)', status: 'completed', date: '2026-03-07' },
  { id: 2, patient: 'Jane Smith', test: 'MRI Brain Scan', status: 'pending', date: '2026-03-07' },
  { id: 3, patient: 'Bob Wilson', test: 'X-Ray Chest', status: 'in-progress', date: '2026-03-07' },
  { id: 4, patient: 'Alice Brown', test: 'Urine Analysis', status: 'completed', date: '2026-03-06' },
  { id: 5, patient: 'David Kim', test: 'ECG', status: 'pending', date: '2026-03-07' },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    completed: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    'in-progress': 'bg-info/10 text-info',
  };
  return styles[status] || '';
};

const LabPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Management</h1>
          <p className="text-muted-foreground mt-1">Manage lab tests and reports</p>
        </div>
        <Button className="rounded-xl gap-2">
          <FileText className="h-4 w-4" /> New Lab Report
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard icon={FlaskConical} value="156" label="Total Tests" color="primary" />
        <StatCard icon={CheckCircle} value="120" label="Completed" color="success" />
        <StatCard icon={Clock} value="36" label="Pending" color="warning" />
      </div>

      <div className="healthcare-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Test</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {labReports.map((report, i) => (
                <motion.tr key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{report.patient}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{report.test}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{report.date}</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" className="rounded-lg text-xs">View</Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
