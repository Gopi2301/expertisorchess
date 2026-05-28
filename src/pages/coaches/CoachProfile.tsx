import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Award, BookOpen, Clock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { coachesApi } from '../../api/coaches.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Coach } from '../../types';

export const CoachProfile: React.FC = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    coachesApi.me()
      .then(res => setCoach(res.data))
      .catch(() => setError('Failed to load profile. Are you registered as a coach?'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await coachesApi.update(coach.id, {
        name: coach.name,
        phone: coach.phone,
        bio: coach.bio,
        fide_rating: coach.fide_rating,
        rapid_rating: coach.rapid_rating,
        blitz_rating: coach.blitz_rating,
        experience_years: coach.experience_years,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-bg-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !coach) {
    return (
      <div className="p-8 text-center bg-bg-strong border border-border rounded-2xl">
        <AlertCircle size={40} className="mx-auto text-error-strong mb-4" />
        <h2 className="text-xl font-bold">Error</h2>
        <p className="text-text-muted mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Coach Profile</h1>
          <p className="text-sm text-text-muted mt-1">Manage your professional information and ratings.</p>
        </div>
        <div className="flex items-center gap-2">
          {success && (
            <span className="text-sm text-text-success flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 size={16} /> Changes saved
            </span>
          )}
          <Button 
            onClick={handleSave} 
            loading={saving} 
            icon={<Save size={18} />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-bg-strong border border-border rounded-2xl p-6 text-center shadow-sm">
            <div className="w-24 h-24 bg-bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-bg-brand/20">
              <User size={48} className="text-bg-brand" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">{coach?.name}</h2>
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mt-1">{coach?.status}</p>
            <div className="mt-6 pt-6 border-t border-border space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail size={16} className="text-text-muted" />
                <span className="truncate">{coach?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Phone size={16} className="text-text-muted" />
                <span>{coach?.phone || 'No phone set'}</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-strong border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Award size={16} className="text-bg-brand" />
              Ratings
            </h3>
            <div className="space-y-4">
              <Input 
                label="FIDE Rating" 
                type="number" 
                value={coach?.fide_rating || ''} 
                onChange={e => setCoach(prev => prev ? { ...prev, fide_rating: parseInt(e.target.value) } : null)}
              />
              <Input 
                label="Rapid Rating" 
                type="number" 
                value={coach?.rapid_rating || ''} 
                onChange={e => setCoach(prev => prev ? { ...prev, rapid_rating: parseInt(e.target.value) } : null)}
              />
              <Input 
                label="Blitz Rating" 
                type="number" 
                value={coach?.blitz_rating || ''} 
                onChange={e => setCoach(prev => prev ? { ...prev, blitz_rating: parseInt(e.target.value) } : null)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Experience */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-bg-strong border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <BookOpen size={16} className="text-bg-brand" />
              Professional Bio
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Short Bio</label>
              <textarea 
                className="w-full bg-bg-muted/50 border border-border rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-bg-brand/30 min-h-[150px] resize-none"
                placeholder="Tell us about your chess background and teaching style..."
                value={coach?.bio || ''}
                onChange={e => setCoach(prev => prev ? { ...prev, bio: e.target.value } : null)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Input 
                label="Years of Experience" 
                type="number" 
                value={coach?.experience_years || ''} 
                onChange={e => setCoach(prev => prev ? { ...prev, experience_years: parseInt(e.target.value) } : null)}
              />
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Hourly Rate</label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-muted/50 border border-border rounded-xl text-sm text-text-muted">
                  <Clock size={16} />
                  <span>${coach?.hourly_rate || '0.00'} / hr (Managed by Admin)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-brand/5 border border-bg-brand/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2 bg-bg-brand/10 rounded-lg text-bg-brand">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-bg-brand">Account Information</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Your email and account status are managed by the administration. 
                If you need to change your registered email or request a status update, please contact the academy support.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
