import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Keycloak from 'keycloak-js';
import {
  Users, Star, Calendar, CheckCircle2, ChevronRight,
  User, Mail, Phone, MapPin, FileText,
  ArrowLeft, Loader2, Shield, LogOut, Heart,
} from 'lucide-react';
import { clientsApi } from '../../api/clients.api';
import apiClient from '../../api/client';

// ── Keycloak instance (check-sso — does NOT force redirect) ─────────────────
const kc = new Keycloak({
  url: 'https://keycloak.virtuagrid.com/',
  realm: 'chess',
  clientId: 'chess-frontend',
});

// ── Types ─────────────────────────────────────────────────────────────────────
type FormData = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
};

type Step = 'hero' | 'signup' | 'form' | 'success';

// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: Users,    title: 'Family Dashboard',    desc: "Monitor all your children's progress from one place." },
  { icon: Calendar, title: 'Class Scheduling',    desc: 'View upcoming classes and join sessions with one click.' },
  { icon: Star,     title: 'Expert Coaches',      desc: 'FIDE-rated coaches dedicated to your child\'s growth.' },
  { icon: Shield,   title: 'Safe & Structured',   desc: 'A trusted environment with curriculum-backed learning.' },
];

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ['Create Account', 'Your Profile', 'Done!'];
const StepDots: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-2 justify-center mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center gap-1">
          <div
            style={
              i === current
                ? { backgroundColor: '#FFF200', color: '#0F0F0F' }
                : i < current
                ? { backgroundColor: '#4ADE80', color: '#0F0F0F' }
                : {}
            }
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < current ? '' : i === current ? '' : 'bg-white/10 text-white/40'}`}
          >
            {i < current ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          <span
            style={i === current ? { color: '#FFF200' } : {}}
            className={`text-[10px] whitespace-nowrap ${i !== current ? 'text-white/40' : ''}`}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-px mt-[-12px] ${i < current ? 'bg-green-400' : 'bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export const ClientOnboarding: React.FC = () => {
  const [step, setStep]               = useState<Step>('hero');
  const [kcReady, setKcReady]         = useState(false);
  const [isAuth, setIsAuth]           = useState(false);
  const [kcUser, setKcUser]           = useState<{ name: string; email: string } | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const kcInit = useRef(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  // Init Keycloak silently
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
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

            // Check if client profile already exists.
            // 200  → already onboarded, redirect to dashboard.
            // 404  → authenticated with CLIENT role but no profile yet → show form.
            // 403  → no CLIENT role yet (brand-new KC user) → show form so they can
            //         submit their profile; admin will assign the role after approval.
            // Any other error → still show form (best-effort, don't block the user).
            clientsApi.meDashboard()
              .then(() => {
                window.location.href = '/client';
              })
              .catch((err) => {
                const status = err.response?.status;
                if (status === 404 || status === 403 || !status) {
                  setStep('form');
                  reset({ name: tp.name ?? '', email: tp.email ?? '' });
                } else {
                  setStep('form');
                  reset({ name: tp.name ?? '', email: tp.email ?? '' });
                }
              });
          } else {
            setStep('form');
            reset({ name: tp.name ?? '', email: tp.email ?? '' });
          }
        }
      })
      .catch(() => setKcReady(true));
  }, [reset]);

  useEffect(() => {
    if (!isAuth) return;
    kc.onTokenExpired = () => kc.updateToken(70).catch(() => {});
  }, [isAuth]);

  const goSignUp = () => kc.register({ redirectUri: window.location.href });
  const goLogin  = () => kc.login({ redirectUri: window.location.href });
  const goLogout = () => {
    delete (apiClient.defaults.headers.common as Record<string, unknown>)['Authorization'];
    kc.logout({ redirectUri: `${window.location.origin}/client-apply` });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await clientsApi.create({
        ...data,
        keycloak_user_id: kc.subject ?? undefined,
      } as any);
      setStep('success');
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: '#0F0F0F', color: '#F5F5F5' }}>

      {/* ── Hero ── */}
      {step === 'hero' && (
        <>
          {/* Nav */}
          <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">♟</span> Expertisor Chess
            </div>
            <button
              onClick={goLogin}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Already a member? Sign in →
            </button>
          </nav>

          {/* Hero content */}
          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border"
                style={{ backgroundColor: 'rgba(255,242,0,0.08)', borderColor: 'rgba(255,242,0,0.2)', color: '#FFF200' }}
              >
                <Heart size={14} /> Enroll Your Child Today
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
                Give Your Child<br />
                <span style={{ color: '#FFF200' }}>A Chess Future.</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                Register as a parent or guardian to enroll your children, track their progress, and manage their chess journey — all in one place.
              </p>
              <button
                onClick={() => setStep('signup')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                style={{ backgroundColor: '#FFF200', color: '#0F0F0F', boxShadow: '0 0 24px rgba(255,242,0,0.2)' }}
              >
                Get Started <ChevronRight size={20} />
              </button>
            </div>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl p-6 border transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,242,0,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(255,242,0,0.1)' }}
                  >
                    <Icon size={20} style={{ color: '#FFF200' }} />
                  </div>
                  <h3 className="font-bold mb-1 text-white">{title}</h3>
                  <p className="text-sm text-white/50">{desc}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div
              className="mt-16 rounded-2xl p-8 border"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <CheckCircle2 size={20} style={{ color: '#FFF200' }} /> How it works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Create Account', desc: 'Sign up with a free account. Takes less than a minute.' },
                  { step: '02', title: 'Complete Profile', desc: 'Tell us about yourself — name, contact info, and preferences.' },
                  { step: '03', title: 'Enroll Students', desc: 'Add your children and let our admin assign them to the right class.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <div className="text-3xl font-extrabold" style={{ color: 'rgba(255,242,0,0.25)' }}>{item.step}</div>
                    <div>
                      <p className="font-bold text-sm text-white">{item.title}</p>
                      <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Sign Up step ── */}
      {step === 'signup' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full">
            <button
              onClick={() => setStep('hero')}
              className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <StepDots current={0} />

            <div
              className="rounded-2xl p-8 text-center border"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(255,242,0,0.1)' }}
              >
                <User size={28} style={{ color: '#FFF200' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">Create your account</h2>
              <p className="text-white/50 text-sm mb-8">
                First, create a free Expertisor account. You'll use this to log in and manage your children.
              </p>

              <button
                onClick={goSignUp}
                className="w-full py-3 rounded-xl font-bold transition-all mb-3 hover:opacity-90"
                style={{ backgroundColor: '#FFF200', color: '#0F0F0F' }}
              >
                Create Account
              </button>
              <button
                onClick={goLogin}
                className="w-full py-3 rounded-xl text-white/70 hover:bg-white/10 transition-all text-sm border"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
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
          <div className="max-w-xl w-full">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 font-bold text-lg text-white">
                <span className="text-2xl">♟</span> Expertisor Chess
              </div>
              {kcUser && (
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center gap-2 text-sm text-white/60 px-3 py-1.5 rounded-full border"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: '#FFF200', color: '#0F0F0F' }}
                    >
                      {kcUser.name.charAt(0).toUpperCase()}
                    </div>
                    {kcUser.name || kcUser.email}
                  </div>
                  <button
                    onClick={goLogout}
                    type="button"
                    className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>

            <StepDots current={1} />

            <div
              className="rounded-2xl p-8 border"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <h2 className="text-2xl font-bold mb-1 text-white">Your Parent Profile</h2>
              <p className="text-white/50 text-sm mb-8">
                Complete your profile so we can set up your family's chess account.
              </p>

              {submitError && (
                <div className="mb-6 px-4 py-3 rounded-xl text-red-400 text-sm border"
                  style={{ backgroundColor: 'rgba(231,0,11,0.08)', borderColor: 'rgba(231,0,11,0.2)' }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Personal info */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <User size={12} /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name *" icon={<User size={14} />} error={errors.name?.message}>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Viswanathan Anand"
                        className={inputCls(!!errors.name)}
                      />
                    </Field>
                    <Field label="Email *" icon={<Mail size={14} />} error={errors.email?.message}>
                      <input
                        {...register('email', { required: 'Email is required' })}
                        type="email"
                        placeholder="anand@chess.com"
                        className={inputCls(!!errors.email)}
                      />
                    </Field>
                    <Field label="Phone" icon={<Phone size={14} />}>
                      <input
                        {...register('phone')}
                        placeholder="+91 98765 43210"
                        className={inputCls(false)}
                      />
                    </Field>
                    <Field label="City / Address" icon={<MapPin size={14} />}>
                      <input
                        {...register('address')}
                        placeholder="Chennai, India"
                        className={inputCls(false)}
                      />
                    </Field>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText size={12} /> Additional Notes (optional)
                  </h3>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Any preferences, learning goals, or information you'd like us to know…"
                    className={`${inputCls(false)} w-full resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90"
                  style={{ backgroundColor: '#FFF200', color: '#0F0F0F' }}
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> Creating Profile…</>
                    : <><CheckCircle2 size={18} /> Complete Registration</>}
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

            <div
              className="rounded-2xl p-10 border"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* Success icon */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border"
                style={{ backgroundColor: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)' }}
              >
                <CheckCircle2 size={40} style={{ color: '#4ADE80' }} />
              </div>

              <h2 className="text-2xl font-bold mb-3 text-white">Profile Submitted!</h2>
              <p className="text-white/60 mb-8">
                Thank you for registering! Our admin team will review your profile and activate your account within{' '}
                <strong className="text-white">1 business day</strong>.
              </p>

              {/* Info bullets */}
              <div
                className="rounded-xl p-4 text-left text-sm space-y-2 mb-8 border"
                style={{ backgroundColor: 'rgba(255,242,0,0.06)', borderColor: 'rgba(255,242,0,0.15)' }}
              >
                <p className="flex items-center gap-2" style={{ color: '#FFF200' }}>
                  <Mail size={14} /> You'll receive an email once your account is activated
                </p>
                <p className="flex items-center gap-2" style={{ color: '#FFF200' }}>
                  <CheckCircle2 size={14} /> After activation, log in to access your dashboard
                </p>
                <p className="flex items-center gap-2" style={{ color: '#FFF200' }}>
                  <Users size={14} /> Then enroll your children from the Students section
                </p>
              </div>

              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm border text-white/70 hover:bg-white/10 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
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
  `w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors border
  ${hasError
    ? 'border-red-500/50 bg-red-500/5 focus:border-red-400'
    : 'border-white/10 bg-white/5 focus:border-[#FFF200]/50'
  }`;

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
