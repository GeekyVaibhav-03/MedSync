import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="healthcare-card group cursor-pointer"
    >
      <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default ServiceCard;
