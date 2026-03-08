import { motion } from 'framer-motion';
import { Pill, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';

const prescriptions = [
  { id: 1, patient: 'John Doe', medicine: 'Aspirin 100mg', qty: 30, status: 'dispensed' },
  { id: 2, patient: 'Jane Smith', medicine: 'Amoxicillin 500mg', qty: 21, status: 'pending' },
  { id: 3, patient: 'Bob Wilson', medicine: 'Metformin 850mg', qty: 60, status: 'dispensed' },
  { id: 4, patient: 'Alice Brown', medicine: 'Ibuprofen 400mg', qty: 15, status: 'pending' },
  { id: 5, patient: 'David Kim', medicine: 'Omeprazole 20mg', qty: 28, status: 'dispensed' },
];

const PharmacyPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy</h1>
          <p className="text-muted-foreground mt-1">Manage prescriptions and medicine dispensing</p>
        </div>
        <Button className="rounded-xl gap-2">
          <Package className="h-4 w-4" /> Issue Medicine
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard icon={Pill} value="342" label="Total Prescriptions" color="primary" />
        <StatCard icon={CheckCircle} value="298" label="Dispensed" color="success" />
        <StatCard icon={AlertTriangle} value="12" label="Low Stock Items" color="warning" />
      </div>

      <div className="healthcare-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{p.patient}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.medicine}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.qty}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      p.status === 'dispensed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" className="rounded-lg text-xs">
                      {p.status === 'pending' ? 'Dispense' : 'View'}
                    </Button>
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

export default PharmacyPage;
