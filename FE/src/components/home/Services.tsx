import {motion} from 'motion/react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {SERVICES} from '@/src/data/content';
import {SectionLabel} from '@/src/components/SectionLabel';
import {Container} from '@/src/components/layout/Container';
import {Section} from '@/src/components/layout/Section';
import {KineticText} from '@/src/components/motion/KineticText';
import {cn} from '@/src/lib/utils';
import {useLayoutEffect, useRef} from 'react';
import {useScrollTypeLink} from '@/src/motion/useScrollTypeLink';
import {ensureGsap} from '@/src/motion/gsap';
import {useReducedMotion} from '@/src/motion/useReducedMotion';

export function Services() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollTypeLink(headingRef);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading || reducedMotion) return;

    const {gsap} = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=420',
          scrub: true,
          pin: heading,
          pinSpacing: true,
        },
      })
        .to(heading, {y: -60, opacity: 0.25, ease: 'none'}, 0)
        .to(heading, {scale: 0.92, ease: 'none'}, 0);
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <Section ref={sectionRef as any} className="bg-background overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-14">
          <div className="max-w-2xl">
            <SectionLabel number="02" text="Services" />
            <h2
              ref={headingRef}
              className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none"
            >
              <KineticText as="span" className="block">
                What we do
              </KineticText>
              <KineticText as="span" className="block text-white/20" delay={0.05}>
                for your brand
              </KineticText>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-foreground/60 font-medium leading-relaxed">
              Strategy, story, and craft—built to stop the scroll and grow your audience with consistency.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-80px'}}
              transition={{delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
              className={cn(
                'group relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden',
                'hover:border-accent/20 transition-colors duration-500',
              )}
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between gap-6 mb-7">
                  <div className="text-accent text-xs font-bold uppercase tracking-[0.3em]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="h-px flex-1 bg-white/10 group-hover:bg-accent/20 transition-colors" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-tighter mb-4">
                  {s.title}
                </h3>
                <p className="text-foreground/60 font-medium leading-relaxed mb-8">
                  {s.shortDesc}
                </p>

                <Link
                  to={`/services/${s.slug}`}
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-foreground/80 hover:text-foreground transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-background group-hover:border-accent/30 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  View details
                </Link>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent/10 blur-[80px]" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

