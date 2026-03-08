import { motion } from 'framer-motion';
import { Stethoscope, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const doctors = [
  { id: 1, name: 'Dr. James Wilson', specialization: 'Cardiologist', status: 'Available', patients: 5, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: 'Dr. Sarah Miller', specialization: 'Dentist', status: 'In Consultation', patients: 3, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: 'Dr. Robert Lee', specialization: 'Neurologist', status: 'Available', patients: 7, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: 'Dr. Lisa Park', specialization: 'General Physician', status: 'Available', patients: 4, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964e05a?w=100&h=100&fit=crop&crop=face' },
];

const DoctorPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Doctor Management</h1>
        <p className="text-muted-foreground mt-1">View doctor availability and manage consultations</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {doctors.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="healthcare-card">
            <div className="flex items-start gap-4">
              <img src={doc.image} alt={doc.name} className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    doc.status === 'Available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {doc.status === 'Available' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {doc.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Stethoscope className="h-4 w-4" />
                    {doc.patients} patients today
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPage;
