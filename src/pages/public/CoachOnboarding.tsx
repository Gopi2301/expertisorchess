import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Keycloak from 'keycloak-js';
import {
  Trophy, Star, Clock, CheckCircle2, ChevronRight,
  User, Mail, Phone, Award, BookOpen, DollarSign,
  ArrowLeft, Loader2, Shield, LogOut,
} from 'lucide-react';
import { coachesApi } from '../../api/coaches.api';
import apiClient from '../../api/client';

// ── Keycloak instance (check-sso — does NOT force redirect) ─────────────────
const kc = new Keycloak({
  url: 'https://keycloak.virtuagrid.com/',
  realm: 'chess',
  clientId: 'chess-frontend',
});

// ── Types ─────────────────────────────────────────────────────────────────────
type FormData = {
  name: string; email: string; phone?: string;
  fide_rating?: number; rapid_rating?: number; blitz_rating?: number;
  experience_years?: number; bio?: string; hourly_rate?: number;
  current_syllabus?: string;
};

type Step = 'hero' | 'signup' | 'form' | 'success';

// ── Benefits list ─────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: Trophy,   title: 'Competitive Pay',    desc: 'Set your own hourly rate and get paid on time, every time.' },
  { icon: Star,     title: 'Flexible Schedule',  desc: 'Teach when it suits you — morning, evening, weekends.' },
  { icon: BookOpen, title: 'Structured Curriculum', desc: 'Access our proven syllabus and class resources.' },
  { icon: Shield,   title: 'Admin Support',      desc: 'We handle payments, scheduling and parent communication.' },
];

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ['Create Account', 'Your Profile', 'Review'];
const StepDots: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-2 justify-center mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${i < current ? 'bg-green-500 text-white' : i === current ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>
            {i < current ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          <span className={`text-[10px] whitespace-nowrap ${i === current ? 'text-amber-400' : 'text-white/40'}`}>{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-px mt-[-12px] ${i < current ? 'bg-green-500' : 'bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export const CoachOnboarding: React.FC = () => {
  const [step, setStep]           = useState<Step>('hero');
  const [kcReady, setKcReady]     = useState(false);
  const [isAuth, setIsAuth]       = useState(false);
  const [kcUser, setKcUser]       = useState<{ name: string; email: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const kcInit = useRef(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  // Init keycloak silently (check-sso) — never forces redirect
  useEffect(() => {
    if (kcInit.current) return;
    kcInit.current = true;

    kc.init({ onLoad: 'check-sso', checkLoginIframe: false, pkceMethod: 'S256' })
      .then((authenticated) => {
        setKcReady(true);
        setIsAuth(authenticated);
        if (authenticated && kc.tokenParsed) {
          const tp = kc.tokenParsed as any;
          setKcUser({ name: tp.name ?? tp.preferred_username ?? '', email: tp.email ?? '' });

          if (kc.token) {
            // Set the bearer token on apiClient so coachesApi.me() is authenticated
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
            
            coachesApi.me()
              .then((res) => {
                const coach = res.data;
                if (coach) {
                  if (coach.status === 'ACTIVE') {
                    // Coach is already approved — redirect to main dashboard
                    window.location.href = '/admin';
                  } else if (coach.status === 'PENDING') {
                    // Application is pending review — show success screen
                    setStep('success');
                  } else if (coach.status === 'REJECTED') {
                    // Application rejected
                    setSubmitError('Your coach application was previously rejected. Please contact support.');
                    setStep('hero');
                  } else {
                    // Suspended / Inactive
                    setSubmitError(`Your account is currently ${coach.status.toLowerCase()}. Please contact support.`);
                    setStep('hero');
                  }
                }
              })
              .catch((err) => {
                // If 404, the coach has not completed their onboarding profile yet
                if (err.response?.status === 404) {
                  setStep('form');
                  reset({ name: tp.name ?? '', email: tp.email ?? '' });
                } else {
                  setSubmitError('Failed to load profile. Please try again.');
                  setStep('form');
                }
              });
          } else {
            setStep('form');
            reset({ name: tp.name ?? '', email: tp.email ?? '' });
          }
        }
      })
      .catch(() => setKcReady(true)); // graceful fail
  }, [reset]);

  // Auto-refresh token
  useEffect(() => {
    if (!isAuth) return;
    kc.onTokenExpired = () => kc.updateToken(70).catch(() => {});
  }, [isAuth]);

  // Set token on the shared axios client for form submission
  const getToken = () => isAuth ? kc.token ?? undefined : undefined;

  const goSignUp = () => {
    kc.register({ redirectUri: window.location.href });
  };
  const goLogin = () => {
    kc.login({ redirectUri: window.location.href });
  };
  const goLogout = () => {
    kc.logout({ redirectUri: window.location.href });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await coachesApi.create({
        ...data,
        keycloak_user_id: kc.subject ?? undefined,
        hourly_rate: data.hourly_rate,
        fide_rating: data.fide_rating ? Number(data.fide_rating) : undefined,
        rapid_rating: data.rapid_rating ? Number(data.rapid_rating) : undefined,
        blitz_rating: data.blitz_rating ? Number(data.blitz_rating) : undefined,
        experience_years: data.experience_years ? Number(data.experience_years) : undefined,
        current_syllabus: data.current_syllabus,
      });
      setStep('success');
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* ── Hero ── */}
      {step === 'hero' && (
        <>
          {/* Nav */}
          <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">♟</span> Expertisor Chess
            </div>
            <button onClick={goLogin}
              className="text-sm text-white/60 hover:text-white transition-colors">
              Already a member? Sign in →
            </button>
          </nav>

          {/* Hero content */}
          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm mb-6">
                <Star size={14} /> Now accepting coach applications
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Teach Chess.<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Shape Champions.
                </span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                Join our growing community of chess coaches. Set your schedule, grow your students, and focus on what you love — teaching.
              </p>
              <button
                onClick={() => setStep('signup')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 text-black font-bold text-lg hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-400/20"
              >
                Apply as a Coach <ChevronRight size={20} />
              </button>
            </div>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-amber-400/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-amber-400" />
                  </div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-white/50">{desc}</p>
                </div>
              ))}
            </div>

            {/* Eligibility */}
            <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award size={20} className="text-amber-400" /> What we look for
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'FIDE rated or equivalent playing experience',
                  'Minimum 1 year of coaching or teaching experience',
                  'Strong communication and patience',
                  'Reliable internet and device for online sessions',
                  'Commitment to at least 4 classes/month',
                  'Background in competitive chess preferred',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* ── Sign Up step ── */}
      {step === 'signup' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full">
            <button onClick={() => setStep('hero')}
              className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>

            <StepDots current={0} />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create your account</h2>
              <p className="text-white/50 text-sm mb-8">
                First, create a free Expertisor account. You'll use it to log in and manage your classes.
              </p>

              <button
                onClick={goSignUp}
                className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all mb-3"
              >
                Create Account
              </button>
              <button
                onClick={goLogin}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all text-sm"
              >
                Already have an account? Log in
              </button>

              {!kcReady && (
                <p className="text-white/30 text-xs mt-4 flex items-center justify-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Connecting to auth server…
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Profile form ── */}
      {step === 'form' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="text-2xl">♟</span> Expertisor Chess
              </div>
              {kcUser && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black text-xs font-bold">
                      {kcUser.name.charAt(0).toUpperCase()}
                    </div>
                    {kcUser.name || kcUser.email}
                  </div>
                  <button onClick={goLogout} type="button" className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>

            <StepDots current={1} />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-1">Your Coach Profile</h2>
              <p className="text-white/50 text-sm mb-8">
                Tell us about yourself. Our admin team will review this within 2 business days.
              </p>

              {submitError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal info */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <User size={12} /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name *" icon={<User size={14} />} error={errors.name?.message}>
                      <input {...register('name', { required: 'Name is required' })}
                        placeholder="Magnus Carlsen"
                        className={inputCls(!!errors.name)} />
                    </Field>
                    <Field label="Email *" icon={<Mail size={14} />} error={errors.email?.message}>
                      <input {...register('email', { required: 'Email is required' })} type="email"
                        placeholder="magnus@chess.com"
                        className={inputCls(!!errors.email)} />
                    </Field>
                    <Field label="Phone" icon={<Phone size={14} />}>
                      <input {...register('phone')} placeholder="+91 98765 43210"
                        className={inputCls(false)} />
                    </Field>
                    <Field label="Hourly Rate (₹)" icon={<DollarSign size={14} />}>
                      <input {...register('hourly_rate', { valueAsNumber: true })} type="number"
                        placeholder="500"
                        className={inputCls(false)} />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Current Handling Syllabus" icon={<BookOpen size={14} />}>
                        <input {...register('current_syllabus')}
                          placeholder="e.g. Beginner to Intermediate / Endgame Masterclass"
                          className={inputCls(false)} />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Chess credentials */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Trophy size={12} /> Chess Credentials
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="FIDE Rating">
                      <input {...register('fide_rating', { valueAsNumber: true })} type="number"
                        placeholder="2400" className={inputCls(false)} />
                    </Field>
                    <Field label="Rapid Rating">
                      <input {...register('rapid_rating', { valueAsNumber: true })} type="number"
                        placeholder="2500" className={inputCls(false)} />
                    </Field>
                    <Field label="Blitz Rating">
                      <input {...register('blitz_rating', { valueAsNumber: true })} type="number"
                        placeholder="2600" className={inputCls(false)} />
                    </Field>
                    <Field label="Exp. (years)">
                      <input {...register('experience_years', { valueAsNumber: true })} type="number"
                        placeholder="5" className={inputCls(false)} />
                    </Field>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen size={12} /> About You
                  </h3>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    placeholder="Tell us about your chess journey, coaching style, and what makes you a great coach…"
                    className={`${inputCls(false)} w-full resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-amber-400 text-black font-bold text-lg hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> Submitting…</>
                    : <><CheckCircle2 size={18} /> Submit Application</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Success ── */}
      {step === 'success' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <StepDots current={2} />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-10">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Application Submitted!</h2>
              <p className="text-white/60 mb-8">
                Thank you for applying. Our team will review your profile and get back to you within <strong className="text-white">2 business days</strong>.
              </p>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 text-left text-sm text-amber-300 space-y-2 mb-8">
                <p className="flex items-center gap-2"><Clock size={14} /> Review usually takes 1–2 business days</p>
                <p className="flex items-center gap-2"><Mail size={14} /> We'll email you with our decision</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={14} /> Once approved, you'll get full access</p>
              </div>
              <a href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all text-sm">
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
  `w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-colors
  ${hasError ? 'border-red-500/50' : 'border-white/10'}`;

const Field: React.FC<{
  label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode;
}> = ({ label, icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-white/50 flex items-center gap-1.5">
      {icon} {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
