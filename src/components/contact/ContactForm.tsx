import { motion } from "motion/react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { MagneticButton } from "../MagneticButton";
import { Send, CheckCircle } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [focused, setFocused] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    projectInfo: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post("/contacts", formData);

      if (response.data.success) {
        setSubmitted(true);

        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          subject: "",
          projectInfo: "",
        });

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-accent text-background rounded-3xl p-16 text-center shadow-[0_0_30px_rgba(196,239,23,0.3)]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-background/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-background" />
            </motion.div>

            <h3 className="text-2xl font-bold font-display mb-3 uppercase tracking-tighter">
              Thank You!
            </h3>

            <p className="text-background/60 font-medium">
              We'll get back to you within 4 hours.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <h3 className="text-2xl font-bold font-display uppercase mb-8 text-white tracking-tighter">
            Send us a message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FULL NAME */}
              <div className="relative">
                <motion.label
                  className={`absolute left-4 transition-all duration-300 text-sm font-bold uppercase tracking-widest pointer-events-none ${
                    focused === "name"
                      ? "top-1 text-[10px] text-accent"
                      : "top-4 text-foreground/30"
                  }`}
                >
                  Full Name
                </motion.label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={(e) =>
                    !e.target.value && setFocused(null)
                  }
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-3 text-sm font-bold text-white focus:outline-none focus:border-accent transition-all shadow-sm"
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <motion.label
                  className={`absolute left-4 transition-all duration-300 text-sm font-bold uppercase tracking-widest pointer-events-none ${
                    focused === "email"
                      ? "top-1 text-[10px] text-accent"
                      : "top-4 text-foreground/30"
                  }`}
                >
                  Email Address
                </motion.label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={(e) =>
                    !e.target.value && setFocused(null)
                  }
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-3 text-sm font-bold text-white focus:outline-none focus:border-accent transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PHONE */}
              <div className="relative">
                <motion.label
                  className={`absolute left-4 transition-all duration-300 text-sm font-bold uppercase tracking-widest pointer-events-none ${
                    focused === "phone"
                      ? "top-1 text-[10px] text-accent"
                      : "top-4 text-foreground/30"
                  }`}
                >
                  Phone Number
                </motion.label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => setFocused("phone")}
                  onBlur={(e) =>
                    !e.target.value && setFocused(null)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-3 text-sm font-bold text-white focus:outline-none focus:border-accent transition-all shadow-sm"
                />
              </div>

              {/* SUBJECT */}
              <div className="relative">
                <motion.label
                  className={`absolute left-4 transition-all duration-300 text-sm font-bold uppercase tracking-widest pointer-events-none ${
                    focused === "subject"
                      ? "top-1 text-[10px] text-accent"
                      : "top-4 text-foreground/30"
                  }`}
                >
                  Subject
                </motion.label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocused("subject")}
                  onBlur={(e) =>
                    !e.target.value && setFocused(null)
                  }
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-3 text-sm font-bold text-white focus:outline-none focus:border-accent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <motion.label
                className={`absolute left-4 transition-all duration-300 text-sm font-bold uppercase tracking-widest pointer-events-none ${
                  focused === "message"
                    ? "top-1 text-[10px] text-accent"
                    : "top-4 text-foreground/30"
                }`}
              >
                Tell us about your project
              </motion.label>

              <textarea
                rows={5}
                name="projectInfo"
                value={formData.projectInfo}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={(e) =>
                  !e.target.value && setFocused(null)
                }
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-3 text-sm font-bold text-white focus:outline-none focus:border-accent transition-all shadow-sm resize-none"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm font-medium">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <MagneticButton
              disabled={loading}
              className="w-full bg-accent text-background font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:shadow-[0_0_30px_rgba(196,239,23,0.4)] transition-all flex items-center justify-center gap-3 text-sm shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />

              {loading ? "Sending..." : "Submit Inquiry"}
            </MagneticButton>
          </form>
        </motion.div>
      </div>
    </section>
  );
};