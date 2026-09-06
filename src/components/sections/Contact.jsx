import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  AtSign,
  User,
  MessageSquare,
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { profile } from '../../data/profile';

/* ── EmailJS config ──────────────────────────────────────────────
   Add these to a `.env` file (Vite exposes only `VITE_*` vars):
     VITE_EMAILJS_SERVICE_ID=service_xxx
     VITE_EMAILJS_TEMPLATE_ID=template_xxx
     VITE_EMAILJS_PUBLIC_KEY=xxxxxxx
   When the keys are missing the form gracefully falls back to
   opening the visitor's email client pre-filled with a mailto link.
 ──────────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};
const emailjsReady = Boolean(
  EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBMIT_COOLDOWN_MS = 5000;

const initialForm = { name: '', email: '', subject: '', message: '' };

/* Client-side validation — returns a map of field → error message */
function validate(form, t = {}) {
  const errors = {};
  if (form.name.trim().length < 2) {
    errors.name = t.name || 'Please enter your name (at least 2 characters).';
  }
  if (!form.email.trim()) {
    errors.email = t.email || 'Please enter your email address.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = t.emailInvalid || "That email address doesn't look right.";
  }
  if (form.subject.trim() && form.subject.trim().length < 3) {
    errors.subject = t.subject || 'Subject is too short — use at least 3 characters (or leave it blank).';
  }
  if (form.message.trim().length < 10) {
    errors.message = t.message || 'Tell me a little more — at least 10 characters.';
  }
  return errors;
}

function Field({ label, icon, error, children }) {
  return (
    <label className="block text-left">
      {label && (
        <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      )}
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-[12px] text-[#ef4444]" role="alert">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}
    </label>
  );
}

const inputBase =
  'w-full rounded-xl border bg-surface-light/60 px-4 py-3 text-sm text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-2 transition-colors';
const inputNormal = 'border-foreground/[0.12] focus:border-accent/60 focus:ring-accent/20';
const inputError = 'border-[#ef4444]/60 focus:border-[#ef4444]/70 focus:ring-[#ef4444]/20';

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [statusMsg, setStatusMsg] = useState('');
  const submittingRef = useRef(false);
  const lastSubmitRef = useRef(0);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  /* Clear the previous status when the user starts typing again */
  useEffect(() => {
    if (status === 'error') setStatus('idle');
  }, [form.name, form.email, form.subject, form.message, status]);

  /* Auto-dismiss success state after a few seconds */
  useEffect(() => {
    if (status !== 'success') return undefined;
    const t = setTimeout(() => setStatus('idle'), 8000);
    return () => clearTimeout(t);
  }, [status]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      /* Hard duplicate-prevention guards */
      const now = Date.now();
      if (submittingRef.current) return;
      if (now - lastSubmitRef.current < SUBMIT_COOLDOWN_MS) return;

      /* Validate */
      const errs = validate(form);
      setErrors(errs);
      const firstError = Object.values(errs).find(Boolean);
      if (firstError) {
        setStatus('error');
        setStatusMsg(firstError);
        return;
      }

      submittingRef.current = true;
      lastSubmitRef.current = now;
      setStatus('loading');
      setStatusMsg('Sending your message…');

      const templateParams = {
        from_name: form.name.trim(),
        reply_to: form.email.trim(),
        subject: form.subject.trim() || `Portfolio inquiry from ${form.name.trim()}`,
        message: form.message.trim(),
      };

      try {
        if (emailjsReady) {
          await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            { publicKey: EMAILJS_CONFIG.publicKey }
          );
        } else {
          /* Graceful offline fallback — open the visitor's mail client pre-filled */
          const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
            templateParams.subject
          )}&body=${encodeURIComponent(
            `${templateParams.message}\n\n— ${templateParams.from_name} (${templateParams.reply_to})`
          )}`;
          window.location.href = mailtoHref;
        }

        setForm(initialForm);
        setErrors({});
        setStatus('success');
        setStatusMsg(
          emailjsReady
            ? `Thanks ${form.name.trim().split(' ')[0]} — your message is on its way. I'll get back to you at ${form.email.trim()} soon.`
            : 'Your email client has been opened with your message ready to send.'
        );
      } catch (err) {
        console.error('Contact form submission failed:', err);
        setStatus('error');
        setStatusMsg(
          `Something went wrong sending your message. Please try again, or email ${profile.email} directly.`
        );
      } finally {
        submittingRef.current = false;
      }
    },
    [form]
  );

  const busy = status === 'loading';

  return (
    <section id="contact" className="py-24 lg:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — pitch + direct contact */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Let's Build
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[var(--accent-bright)] to-accent">
                Something Great.
              </span>
            </h2>

            <p className="mt-6 text-muted text-base sm:text-lg max-w-lg">
              Have an idea, project, or opportunity? Drop a message through the form or email me
              directly — I usually reply within 24 hours.
            </p>

            <div className="mt-8 space-y-3 text-sm text-muted">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-3 text-foreground hover:text-accent transition-colors"
              >
                <span className="w-9 h-9 shrink-0 rounded-full bg-surface border border-foreground/[0.1] flex items-center justify-center text-accent transition-colors group-hover:border-accent/40">
                  <Mail size={16} />
                </span>
                {profile.email}
              </a>
              {profile.location && (
                <span className="inline-flex items-center gap-3 text-muted">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-surface border border-foreground/[0.1] flex items-center justify-center text-accent/70">
                    <AtSign size={16} />
                  </span>
                  Based in {profile.location} · working remotely worldwide
                </span>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 glow-accent"
              >
                <Mail size={18} />
                Email Me
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right — the form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative rounded-2xl border border-foreground/[0.08] bg-surface/60 backdrop-blur-md p-6 sm:p-8 shadow-2xl"
          >
            {/* status banner */}
            {status !== 'idle' && (
              <div
                role={status === 'error' ? 'alert' : 'status'}
                aria-live="polite"
                className={`mb-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] font-medium ${
                  status === 'success'
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : status === 'error'
                      ? 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]'
                      : 'border-foreground/[0.1] bg-surface-light/60 text-muted'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <Loader2 size={16} className={`mt-0.5 shrink-0 ${status === 'loading' ? 'animate-spin' : ''}`} />
                )}
                <span>{statusMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name *" error={errors.name}>
                  <div className="relative">
                    <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60" />
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      disabled={busy}
                      className={`${inputBase} ${inputNormal} ${errors.name ? inputError : ''} pl-10 disabled:opacity-60`}
                    />
                  </div>
                </Field>
                <Field label="Email *" error={errors.email}>
                  <div className="relative">
                    <AtSign size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={busy}
                      className={`${inputBase} ${inputNormal} ${errors.email ? inputError : ''} pl-10 disabled:opacity-60`}
                    />
                  </div>
                </Field>
              </div>

              <Field label="Subject (optional)" error={errors.subject}>
                <div className="relative">
                  <MessageSquare size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60" />
                  <input
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    disabled={busy}
                    className={`${inputBase} ${inputNormal} ${errors.subject ? inputError : ''} pl-10 disabled:opacity-60`}
                  />
                </div>
              </Field>

              <Field label="Message *" error={errors.message}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about your project, timeline, and budget…"
                  disabled={busy}
                  className={`${inputBase} ${inputNormal} ${errors.message ? inputError : ''} resize-none disabled:opacity-60`}
                />
              </Field>

              <button
                type="submit"
                disabled={busy}
                data-cursor
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-accent/90 transition-all duration-300 glow-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-muted/70">
                {emailjsReady
                  ? 'Delivered securely via EmailJS.'
                  : 'Relay via your email client — no data stored on this site.'}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
