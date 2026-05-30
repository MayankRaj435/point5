import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { SERVICES, PROCESS_STEPS } from "../../data/content";
import { PageHero } from "../PageHero";
import { SectionLabel } from "../SectionLabel";
import { TextReveal } from "../TextReveal";
import {
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Trophy,
  Shield,
  Rocket,
} from "lucide-react";
import { GridBackground } from "../ui/GridBackground";
import { BackgroundBeams } from "../ui/BackgroundBeams";
import { PortfolioShowcase } from "./PortfolioShowcase";

import { PageDetailing } from "../ui/PageDetailing";

export const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display mb-4 text-foreground uppercase tracking-tighter">
            Service Not Found
          </h1>
          <Link
            to="/services"
            className="text-accent font-bold uppercase tracking-widest hover:underline"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  // Split title for dual-tone effect: first word is white, rest is accent
  const titleParts = service.title.split(" ");
  const mainTitle = titleParts[0];
  const accentTitle = titleParts.slice(1).join(" ");

  return (
    <div className="bg-background text-foreground min-h-screen relative overflow-hidden">
      <PageDetailing />
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground className="opacity-[0.03]" />
        <BackgroundBeams className="opacity-10" />
      </div>

      <div className="relative z-10">
        <PageHero
          title={mainTitle}
          accentTitle={accentTitle}
          breadcrumb={service.title}
        />

        <section className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <div className="mb-20">
                  <SectionLabel number="01" text="Overview" />
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold font-display tracking-tighter mb-8 text-foreground uppercase leading-[0.9]"
                  >
                    <TextReveal>{service.title}</TextReveal>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-foreground/70 font-medium text-lg md:text-xl leading-relaxed mb-12 italic"
                  >
                    {service.fullDesc}
                  </motion.p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {[
                      { icon: Zap, label: "Fast Turnaround", val: "7-14 Days" },
                      {
                        icon: Trophy,
                        label: "Premium Quality",
                        val: "A+ Grade",
                      },
                      {
                        icon: Shield,
                        label: "Full Support",
                        val: "24/7 Access",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="glass p-6 rounded-2xl border-white/5 hover:border-accent/20 transition-all group"
                      >
                        <item.icon className="w-6 h-6 text-accent mb-4 group-hover:scale-110 transition-transform" />
                        <div className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">
                          {item.label}
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-foreground">
                          {item.val}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-20">
                  <SectionLabel number="02" text="Deliverables" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {service.features.map((feature, i) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-4 p-5 glass rounded-2xl hover:border-accent/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all">
                          <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-background transition-colors" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-foreground/60 group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Simplified Process */}
                <div className="mb-20">
                  <SectionLabel number="03" text="Execution Path" />
                  <div className="space-y-6 mt-8">
                    {PROCESS_STEPS.slice(0, 3).map((step, i) => (
                      <motion.div
                        key={step.num}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6 p-8 glass rounded-3xl group hover:border-accent/20 transition-all"
                      >
                        <div className="text-4xl font-display font-bold text-accent/20 group-hover:text-accent transition-colors">
                          {step.num}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold uppercase tracking-wider text-foreground mb-2">
                            {step.title}
                          </h4>
                          <p className="text-sm text-foreground/40 leading-relaxed italic">
                            {step.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Showcase */}
                <PortfolioShowcase
                  serviceType={service.serviceType}
                  sectionNumber="04"
                  sectionTitle="Featured Work"
                />

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-24 p-12 glass rounded-[3rem] border-accent/20 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Rocket className="w-12 h-12 text-accent mx-auto mb-6 group-hover:scale-125 transition-transform duration-500" />
                  <h3 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-tighter mb-6">
                    Ready to scale your brand?
                  </h3>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 bg-accent text-background px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(196,239,23,0.3)]"
                  >
                    Start Your Project
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>

              {/* Sidebar - Other Services */}
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-foreground/20" />
                    Other Expertise
                  </h3>
                  <div className="space-y-4">
                    {otherServices.map((s, i) => (
                      <motion.div
                        key={s.slug}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        <Link
                          to={`/services/${s.slug}`}
                          className="flex items-center justify-between p-6 glass rounded-2xl hover:border-accent/40 transition-all group"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 group-hover:text-accent transition-colors">
                            {s.title}
                          </span>
                          <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Help Card */}
                  <div className="mt-12 p-8 glass rounded-3xl bg-accent/5 border-accent/10">
                    <h4 className="text-lg font-bold uppercase tracking-tight mb-4">
                      Need Help Choosing?
                    </h4>
                    <p className="text-sm text-foreground/50 mb-6 italic">
                      Not sure which service fits your current stage? Schedule a
                      free discovery call.
                    </p>
                    <a
                      href="mailto:point5media2022@gmail.com"
                      className="text-accent font-bold uppercase text-xs tracking-widest hover:underline flex items-center gap-2"
                    >
                      Get Expert Advice <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
