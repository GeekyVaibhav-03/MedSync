import { motion } from 'framer-motion';

interface DoctorCardProps {
  name: string;
  specialization: string;
  imageUrl: string;
}

const DoctorCard = ({ name, specialization, imageUrl }: DoctorCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="healthcare-card text-center group"
    >
      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-secondary">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
      <h4 className="font-semibold text-foreground">{name}</h4>
      <p className="text-sm text-muted-foreground mt-1">{specialization}</p>
    </motion.div>
  );
};

export default DoctorCard;
