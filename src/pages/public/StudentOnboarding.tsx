import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Keycloak from 'keycloak-js';
import {
  GraduationCap, Trophy, Star, BookOpen, CheckCircle2, ChevronRight,
  User, Mail, Phone, Target, ArrowLeft, Loader2, LogOut,
  Shield, Users, Heart,
} from 'lucide-react';
import { studentsApi } from '../../api/students.api';
import { clientsApi } from '../../api/clients.api';
import apiClient from '../../api/client';
import type { ChessLevel, StudentRelation } from '../../types';

// ── Keycloak instance ─────────────────────────────────────────────────────────
const kc = new Keycloak({
  url: 'https://keycloak.virtuagrid.com/',
  realm: 'chess',
  clientId: 'chess-frontend',
});

// ── Types ─────────────────────────────────────────────────────────────────────
type FormData = {
  name: string;
  age?: number;
  chess_level: ChessLevel;
  current_rating?: number;
  goals?: string;
  email?: string;
  phone?: string;
  relation_to_client: StudentRelation;
};

type Step = 'hero' | 'login' | 'form' | 'success' | 'claim' | 'claiming' | 'claimed';

const CHESS_LEVELS: { value: ChessLevel; label: string; desc: string; icon: string }[] = [
  { value: 'BEGINNER',     label: 'Beginner',     desc: 'New to chess, learning the basics',      icon: '♟' },
  { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'Knows strategies, building skills',       icon: '♜' },
  { value: 'ADVANCED',     label: 'Advanced',     desc: 'Tournament-ready, competitive play',      icon: '♛' },
  { value: 'EXPERT',       label: 'Expert',       desc: 'High-rated, aiming for title norms',      icon: '♔' },
];

const RELATIONS: { value: StudentRelation; label: string }[] = [
  { value: 'PARENT',   label: 'Parent' },
  { value: 'GUARDIAN', label: 'Guardian' },
  { value: 'SELF',     label: 'Self (adult learner)' },
  { value: 'OTHER',    label: 'Other' },
];

// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: Trophy,       title: 'FIDE-rated Coaches',    desc: 'Learn from titled players and experienced trainers.' },
  { icon: BookOpen,     title: 'Structured Curriculum',  desc: 'Proven syllabus from beginner to expert level.' },
  { icon: Star,         title: 'Progress Tracking',      desc: 'See your rating grow with every class you attend.' },
  { icon: Shield,       title: 'Safe Environment',       desc: 'Supervised, encouraging sessions for all ages.' },
];

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ['Sign In', 'Student Info', 'Done!'];
const StepDots: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-2 justify-center mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>
            {i < current ? <CheckCircle2 size={16} /> : i + 1}
          </div>
          <span className={`text-[10px] whitespace-nowrap ${i === current ? 'text-amber-400' : 'text-white/40'}`}>{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-px mt-[-12px] ${i < current ? 'bg-emerald-500' : 'bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export const StudentOnboarding: React.FC = () => {
  // Read invite token from query params
  const inviteToken = new URLSearchParams(window.location.search).get('token');

  const [step, setStep]               = useState<Step>(inviteToken ? 'claim' : 'hero');
  const [kcReady, setKcReady]         = useState(false);
  const [isAuth, setIsAuth]           = useState(false);
  const [kcUser, setKcUser]           = useState<{ name: string; email: string } | null>(null);
  const [clientId, setClientId]       = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ChessLevel>('BEGINNER');
  const kcInit = useRef(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { chess_level: 'BEGINNER', relation_to_client: 'PARENT' },
  });

  // Set chess_level in form when card is clicked
  const handleLevelSelect = (level: ChessLevel) => {
    setSelectedLevel(level);
    setValue('chess_level', level);
  };

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
          const roles: string[] = tp.realm_access?.roles ?? [];
          setKcUser({ name: tp.name ?? tp.preferred_username ?? '', email: tp.email ?? '' });

          if (kc.token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
          }

          // ── Invite claim flow ───────────────────────────────────────────────
          if (inviteToken) {
            setStep('claiming');
            studentsApi.claimInvite(inviteToken)
              .then(() => setStep('claimed'))
              .catch((e: any) => {
                const msg = e?.response?.data?.message ?? 'Failed to activate account. The link may have expired.';
                setSubmitError(msg);
                setStep('claim');
              });
            return;
          }

          // ── Normal parent enrollment flow ───────────────────────────────────
          // Must have CLIENT role
          if (!roles.includes('CLIENT')) {
            setSubmitError('Only registered parents/guardians (CLIENT role) can enroll students. Please complete the parent registration first.');
            setStep('login');
            return;
          }

          // Fetch the client's own profile to get their client_id
          clientsApi.meDashboard()
            .then((res) => {
              setClientId(res.data?.id ?? null);
              setStep('form');
            })
            .catch(() => {
              setSubmitError('Your parent profile was not found. Please complete the parent registration at /client-apply first.');
              setStep('login');
            });
        }
      })
      .catch(() => setKcReady(true));
  }, []);

  // Auto-refresh token
  useEffect(() => {
    if (!isAuth) return;
    kc.onTokenExpired = () => kc.updateToken(70).catch(() => {});
  }, [isAuth]);

  const goLogin  = () => kc.login({ redirectUri: window.location.href });
  const goLoginForClaim = () => kc.register({ redirectUri: window.location.href });
  const goLogout = () => {
    // Clear the injected auth header so no stale token lingers
    delete (apiClient.defaults.headers.common as Record<string, unknown>)['Authorization'];
    // Redirect to the landing page so Keycloak doesn't immediately
    // re-authenticate via check-sso
    kc.logout({ redirectUri: `${window.location.origin}/student-apply` });
  };

  const onSubmit = async (data: FormData) => {
    if (!clientId) {
      setSubmitError('Client profile not found. Please register as a parent first.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await studentsApi.create({
        ...data,
        client_id: clientId,
        age: data.age ? Number(data.age) : undefined,
        current_rating: data.current_rating ? Number(data.current_rating) : undefined,
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
    <div className="min-h-screen bg-[#080b14] text-white font-sans">

      {/* ── Hero ── */}
      {step === 'hero' && (
        <>
          {/* Nav */}
          <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">♟</span> Expertisor Chess
            </div>
            <div className="flex items-center gap-4">
              <a href="/client-apply" className="text-sm text-white/60 hover:text-white transition-colors">
                Register as Parent →
              </a>
              <button onClick={goLogin}
                className="text-sm text-white/60 hover:text-white transition-colors">
                Sign in
              </button>
            </div>
          </nav>

          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm mb-6">
                <GraduationCap size={14} /> Now enrolling students
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Start Your<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Chess Journey.
                </span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                Join hundreds of students learning chess with expert coaches. From beginner fundamentals to tournament-level strategy — we've got it all.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setStep('login')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 text-black font-bold text-lg hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-400/20"
                >
                  Enroll a Student <ChevronRight size={20} />
                </button>
                <a
                  href="/client-apply"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-bold text-lg hover:bg-white/10 transition-all"
                >
                  <Heart size={18} /> Register as Parent
                </a>
              </div>
            </div>

            {/* Benefits */}
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

            {/* Chess level ladder */}
            <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy size={20} className="text-amber-400" /> Our Level Ladder
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CHESS_LEVELS.map(({ value, label, desc, icon }) => (
                  <div key={value} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-3xl mb-2">{icon}</div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-xs text-white/40 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Login step ── */}
      {step === 'login' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full">
            <button onClick={() => setStep('hero')}
              className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>

            <StepDots current={0} />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={28} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Sign in as Parent</h2>
              <p className="text-white/50 text-sm mb-8">
                You must be a registered parent or guardian to enroll a student. Sign in with your parent account.
              </p>

              {submitError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left">
                  {submitError}
                  {submitError.includes('parent registration') && (
                    <a href="/client-apply" className="block mt-2 text-violet-400 hover:underline">
                      → Register as a parent here
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={goLogin}
                className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all mb-3"
              >
                Sign In
              </button>
              <a
                href="/client-apply"
                className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all text-sm"
              >
                Not a parent yet? Register here
              </a>

              {!kcReady && (
                <p className="text-white/30 text-xs mt-4 flex items-center justify-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Connecting to auth server…
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Student form ── */}
      {step === 'form' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 py-16">
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
              <h2 className="text-2xl font-bold mb-1">Enroll a Student</h2>
              <p className="text-white/50 text-sm mb-8">
                Fill in your child's details. Our admin team will assign them to the right class.
              </p>

              {submitError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic info */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <User size={12} /> Student Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name *" icon={<User size={14} />} error={errors.name?.message}>
                      <input {...register('name', { required: 'Name is required' })}
                        placeholder="Rameshbabu Praggnanandhaa"
                        className={inputCls(!!errors.name)} />
                    </Field>
                    <Field label="Age" icon={<Users size={14} />}>
                      <input {...register('age', { valueAsNumber: true })} type="number"
                        placeholder="12" min={3} max={99}
                        className={inputCls(false)} />
                    </Field>
                    <Field label="Email" icon={<Mail size={14} />}>
                      <input {...register('email')} type="email"
                        placeholder="student@example.com"
                        className={inputCls(false)} />
                    </Field>
                    <Field label="Phone" icon={<Phone size={14} />}>
                      <input {...register('phone')}
                        placeholder="+91 98765 43210"
                        className={inputCls(false)} />
                    </Field>
                  </div>
                </div>

                {/* Relationship */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Heart size={12} /> Your Relationship to Student
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {RELATIONS.map(rel => (
                      <label key={rel.value}
                        className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-amber-400/30 transition-all has-[:checked]:border-amber-400 has-[:checked]:bg-amber-400/10">
                        <input type="radio" {...register('relation_to_client')} value={rel.value}
                          className="accent-amber-400" />
                        <span className="text-sm">{rel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chess level */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Trophy size={12} /> Chess Level
                  </h3>
                  <input type="hidden" {...register('chess_level')} />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CHESS_LEVELS.map(lvl => (
                      <button
                        type="button"
                        key={lvl.value}
                        onClick={() => handleLevelSelect(lvl.value)}
                        className={`p-4 rounded-xl border text-center transition-all hover:scale-105 ${
                          selectedLevel === lvl.value
                            ? 'border-amber-400 bg-amber-400/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:border-amber-400/30'
                        }`}
                      >
                        <div className="text-2xl mb-1">{lvl.icon}</div>
                        <p className="font-bold text-xs">{lvl.label}</p>
                        <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{lvl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional details */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Star size={12} /> Chess Details (optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Current Rating (FIDE/Rapid)" icon={<Trophy size={14} />}>
                      <input {...register('current_rating', { valueAsNumber: true })} type="number"
                        placeholder="1200"
                        className={inputCls(false)} />
                    </Field>
                    <Field label="Learning Goals" icon={<Target size={14} />}>
                      <input {...register('goals')}
                        placeholder="Become a National Champion"
                        className={inputCls(false)} />
                    </Field>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-amber-400 text-black font-bold text-lg hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> Enrolling…</>
                    : <><CheckCircle2 size={18} /> Enroll Student</>}
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
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Student Enrolled!</h2>
              <p className="text-white/60 mb-8">
                Your student has been registered. Our team will review and assign them to the right class shortly.
              </p>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 text-left text-sm text-amber-300 space-y-2 mb-8">
                <p className="flex items-center gap-2"><GraduationCap size={14} /> Admin will assign classes within 24 hours</p>
                <p className="flex items-center gap-2"><Mail size={14} /> You'll receive a confirmation email</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={14} /> Track classes from your parent dashboard</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all text-sm"
                >
                  + Enroll Another Student
                </button>
                <a
                  href="/client"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all"
                >
                  Go to Dashboard <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Invite Claim Step ── */}
      {(step === 'claim') && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
              {/* Chess Icon */}
              <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={36} className="text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">You've Been Enrolled! ♟</h1>
              <p className="text-white/50 text-sm mb-8">
                Your parent/guardian has enrolled you at <strong className="text-white">Expertisor Chess Academy</strong>.
                Create your personal student account to access your dashboard and class schedule.
              </p>

              {submitError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left">
                  {submitError}
                  {submitError.includes('expired') && (
                    <p className="mt-2 text-white/40">Please ask your parent/guardian to resend the invite from the dashboard.</p>
                  )}
                </div>
              )}

              {!kcReady ? (
                <p className="text-white/30 text-sm flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Connecting…
                </p>
              ) : (
                <div className="space-y-3">
                  <button
                    id="btn-create-student-account"
                    onClick={goLoginForClaim}
                    className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
                  >
                    <GraduationCap size={18} /> Create My Account
                  </button>
                  <button
                    onClick={goLogin}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all text-sm"
                  >
                    I already have an account — Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Auto-claiming ── */}
      {step === 'claiming' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-amber-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2">Activating your account…</h2>
            <p className="text-white/50 text-sm">Please wait while we link your student profile.</p>
          </div>
        </div>
      )}

      {/* ── Invite Claimed Successfully ── */}
      {step === 'claimed' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Account Activated! 🎉</h2>
              <p className="text-white/60 mb-8">
                Your student account is ready. You can now log in independently and view your class schedule, track attendance, and more.
              </p>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 text-left text-sm text-amber-300 space-y-2 mb-8">
                <p className="flex items-center gap-2"><GraduationCap size={14} /> Access your personal student dashboard</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={14} /> View your upcoming chess classes</p>
                <p className="flex items-center gap-2"><Trophy size={14} /> Track your progress and attendance</p>
              </div>
              <a
                href="/student"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all"
              >
                Go to My Dashboard <ChevronRight size={16} />
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
