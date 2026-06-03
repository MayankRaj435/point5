import {AnimatePresence, motion} from 'motion/react';
import {Plus, X} from 'lucide-react';
import {useState} from 'react';
import {FAQS} from '@/src/data/content';
import {Container} from '@/src/components/layout/Container';
import {Section} from '@/src/components/layout/Section';
import {cn} from '@/src/lib/utils';
import {KineticText} from '@/src/components/motion/KineticText';
import {useRef} from 'react';
import {useScrollTypeLink} from '@/src/motion/useScrollTypeLink';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useScrollTypeLink(headingRef);

  return (
    <Section className="bg-background overflow-hidden">
      <Container>
        <div className="mb-12">
          <motion.div
            initial={{opacity: 0, y: 16}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xs mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            FAQS
          </motion.div>
          <h2
            ref={headingRef}
            className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none text-white mb-10"
          >
            <KineticText as="span" className="block">
              Learn more
            </KineticText>
            <KineticText as="span" className="block text-white/20" delay={0.05}>
              from FAQs
            </KineticText>
          </h2>

          <div className="flex border-b border-white/5 mb-12">
            <button
              type="button"
              className="px-6 py-4 text-accent border-b-2 border-accent text-sm font-bold uppercase tracking-widest"
            >
              General Ask
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: i * 0.08}}
              className={cn(
                'rounded-3xl border transition-all duration-500',
                openIndex === i
                  ? 'bg-[#0D0D0D] border-accent/20 shadow-2xl'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10',
              )}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/20 font-bold font-display text-xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base md:text-xl font-bold font-display text-white pr-4">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500',
                    openIndex === i ? 'bg-accent text-background rotate-45' : 'bg-white/5 text-white/40',
                  )}
                >
                  {openIndex === i ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
                    className="overflow-hidden"
                  >
                    <div className="px-8 md:px-24 pb-8">
                      <p className="text-foreground/60 text-sm md:text-base leading-relaxed font-medium italic">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

