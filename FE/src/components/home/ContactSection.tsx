import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { COMPANY, TEAM_MEMBERS } from "@/src/data/content";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { TextHoverEffect } from "@/src/components/ui/text-hover-effect";
import axiosInstance from "@/src/lib/axiosInstance";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const form = e.currentTarget;

      const formData = {
        fullName: (form.elements.namedItem("name") as HTMLInputElement).value,

        email: (form.elements.namedItem("email") as HTMLInputElement).value,

        subject: "Website Contact Form",

        projectInfo: (form.elements.namedItem("message") as HTMLTextAreaElement)
          .value,
      };

      const response = await axiosInstance.post("/contacts", formData);

      if (response.data.success) {
        setSubmitted(true);

        form.reset();

        window.setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };
  const primary = TEAM_MEMBERS[0];

  return (
    <Section className="bg-background overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0D0D0D] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  Response time: 4 hours
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold font-display text-white mb-10 tracking-tighter uppercase leading-none">
                Tell details <br /> about your project
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-10"
                >
                  <CheckCircle className="w-16 h-16 text-accent mb-4" />
                  <p className="text-white font-bold text-lg">Message Sent!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20 font-medium"
                      required
                      name="name"
                      autoComplete="name"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20 font-medium"
                      required
                      name="email"
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative group">
                    <textarea
                      placeholder="Your message"
                      rows={3}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20 font-medium resize-none"
                      required
                      name="message"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-background font-bold text-sm">
                        {primary.name
                          .split(" ")
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm leading-tight">
                          {primary.name}
                        </span>
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                          {primary.role}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-accent hover:text-background transition-all group"
                    >
                      <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-background">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                      {loading ? "Sending..." : "Send Message"}{" "}
                    </button>
                  </div>
                </form>
              )}
              {error && (
                <p className="text-red-400 text-sm font-medium">{error}</p>
              )}

              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                  Or reach us directly
                </p>
                <div className="space-y-2 text-sm text-white/70 font-medium">
                  <div>{COMPANY.email}</div>
                  <div>{COMPANY.phones.join(" · ")}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column — Interactive Text Hover Effect */}
          <motion.div
            className="lg:col-span-7 hidden lg:flex items-center justify-center min-h-[500px]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-full flex flex-col items-center justify-center -space-y-4 md:-space-y-8">
              <div className="w-full flex items-center justify-center">
                <TextHoverEffect text="POINT5" automatic />
              </div>
              <div className="w-full flex items-center justify-center">
                <TextHoverEffect text="MEDIA" automatic />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
