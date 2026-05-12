import React from 'react';
import type { ClassStatus, Status, AttendanceStatus, ChessLevel, EnrollmentStatus } from '../../types';

type BadgeVariant = 'default' | 'brand' | 'success' | 'error' | 'warning' | 'muted';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-strong text-text-secondary border border-border',
  brand: 'bg-bg-brand text-text-on-brand',
  success: 'bg-bg-success text-text-success border border-green-900',
  error: 'bg-bg-error text-error-strong border border-red-900',
  warning: 'bg-yellow-950 text-warning border border-yellow-900',
  muted: 'bg-bg-muted text-text-muted border border-border',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
    {children}
  </span>
);

// ── Semantic Status Badges ────────────────────────────────────────────────────

export const ClassStatusBadge: React.FC<{ status: ClassStatus }> = ({ status }) => {
  const map: Record<ClassStatus, { label: string; variant: BadgeVariant }> = {
    DRAFT: { label: 'Draft', variant: 'muted' },
    PUBLISHED: { label: 'Published', variant: 'brand' },
    ONGOING: { label: 'Ongoing', variant: 'success' },
    COMPLETED: { label: 'Completed', variant: 'default' },
    CANCELLED: { label: 'Cancelled', variant: 'error' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
};

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const map: Record<Status, BadgeVariant> = {
    PENDING:  'warning',
    ACTIVE:   'success',
    INACTIVE: 'muted',
    SUSPENDED:'error',
    REJECTED: 'error',
  };
  return <Badge variant={map[status] ?? 'default'}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
};

export const AttendanceBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  const map: Record<AttendanceStatus, BadgeVariant> = {
    PRESENT: 'success',
    ABSENT: 'error',
    LATE: 'warning',
    EXCUSED: 'muted',
  };
  return <Badge variant={map[status]}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
};

export const ChessLevelBadge: React.FC<{ level: ChessLevel }> = ({ level }) => {
  const map: Record<ChessLevel, BadgeVariant> = {
    BEGINNER: 'muted',
    INTERMEDIATE: 'default',
    ADVANCED: 'warning',
    EXPERT: 'brand',
  };
  return <Badge variant={map[level]}>{level.charAt(0) + level.slice(1).toLowerCase()}</Badge>;
};

export const EnrollmentBadge: React.FC<{ status: EnrollmentStatus }> = ({ status }) => {
  const map: Record<EnrollmentStatus, BadgeVariant> = {
    CONFIRMED: 'success',
    PENDING: 'warning',
    DECLINED: 'error',
  };
  return <Badge variant={map[status]}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
};
