import { motion } from 'motion/react';
import { ServiceDetail } from '../components/services/ServiceDetail';

export const ServiceDetailPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground min-h-screen overflow-hidden"
    >
      <ServiceDetail />
    </motion.main>
  );
};
