import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Heart,
  HeartPulse,
  Brain,
  Smile,
  Users,
  Award,
  ShieldCheck,
  ClipboardList,
  Ticket,
  Stethoscope,
  FlaskConical,
  BarChart3,
  Star,
  ArrowRight,
} from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import DoctorCard from '@/components/DoctorCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stats = [
  { icon: Users, value: '12K+', label: 'Happy Patients' },
  { icon: Award, value: '95%', label: 'Healing Success' },
  { icon: ShieldCheck, value: '24/7', label: 'Medical Support' },
];

const services = [
  { icon: HeartPulse, title: 'Cardiology', description: 'Expert heart care with advanced diagnostics, monitoring, and treatment for all cardiovascular conditions.' },
  { icon: Smile, title: 'Dentistry', description: 'Complete dental care from routine checkups to advanced cosmetic and restorative procedures.' },
  { icon: Brain, title: 'Neurology', description: 'Comprehensive neurological evaluation and treatment for brain and nervous system disorders.' },
];

const workflowSteps = [
  { icon: ClipboardList, title: 'Patient Registration', desc: 'Quick digital registration with minimal paperwork' },
  { icon: Ticket, title: 'Token Generated', desc: 'Instant token with estimated wait time' },
  { icon: Stethoscope, title: 'Doctor Diagnosis', desc: 'Consultation with specialized doctors' },
  { icon: FlaskConical, title: 'Lab & Pharmacy', desc: 'Seamless lab tests and medicine dispensing' },
  { icon: BarChart3, title: 'Analytics Insights', desc: 'Data-driven insights for better outcomes' },
];

const testimonials = [
  { name: 'Sarah Johnson', review: 'The token system reduced my wait time from hours to minutes. Absolutely wonderful experience!', role: 'Patient' },
  { name: 'Michael Chen', review: 'Best hospital management system I have ever seen. Very efficient and professional.', role: 'Patient' },
  { name: 'Emily Davis', review: 'The digital workflow makes everything so smooth. Highly recommend MediFlow!', role: 'Patient' },
];

const doctors = [
  { name: 'Dr. James Wilson', specialization: 'Cardiologist', imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face' },
  { name: 'Dr. Sarah Miller', specialization: 'Dentist', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face' },
  { name: 'Dr. Robert Lee', specialization: 'Neurologist', imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face' },
  { name: 'Dr. Lisa Park', specialization: 'General Physician', imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964e05a?w=200&h=200&fit=crop&crop=face' },
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section id="home" className="gradient-hero overflow-hidden">
        <div className="container-section section-padding">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Heart className="h-4 w-4" /> #1 Hospital Management System
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Empowering Lives{' '}
                <span className="text-primary">Through Health</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                A modern token-driven hospital management system that streamlines patient care, reduces wait times, and delivers actionable analytics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="rounded-xl px-8 gap-2">
                    Book Appointment <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="rounded-xl px-8">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative rounded-3xl overflow-hidden glow-shadow">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=500&fit=crop"
                  alt="Healthcare professionals"
                  className="w-full h-auto rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 rounded-2xl bg-card p-4 shadow-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">12K+</p>
                    <p className="text-xs text-muted-foreground">Patients Served</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container-section py-16">
          <div className="grid sm:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="mx-auto mb-4 inline-flex rounded-2xl bg-primary/10 p-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-background" id="services">
        <div className="container-section section-padding">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">Comprehensive Healthcare Solutions</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">We provide world-class medical services across multiple specializations.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div key={service.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-muted">
        <div className="container-section section-padding">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">Token-Driven Workflow</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">From registration to insights — a seamless digital journey.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {workflowSteps.map((step, i) => (
              <motion.div key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-primary-foreground">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
                <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background">
        <div className="container-section section-padding">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">What Our Patients Say</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="healthcare-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="bg-muted" id="doctors">
        <div className="container-section section-padding">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">Meet Our Doctors</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {doctors.map((doc, i) => (
              <motion.div key={doc.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                <DoctorCard {...doc} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-95" />
        <div className="container-section section-padding relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of patients and healthcare providers using MediFlow for smarter, faster, and better hospital management.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="rounded-xl px-8 gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
