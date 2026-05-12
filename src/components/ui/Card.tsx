import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover, onClick }) => (
  <div
    onClick={onClick}
    className={`
      bg-bg-strong border border-border rounded-xl p-5
      ${hover ? 'card-hover cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; up: boolean };
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, accent }) => (
  <Card className={`relative overflow-hidden ${accent ? 'border-bg-brand/30' : ''}`}>
    {accent && (
      <div className="absolute top-0 right-0 w-24 h-24 bg-bg-brand/5 rounded-full -mr-8 -mt-8" />
    )}
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${accent ? 'bg-bg-brand/10 text-bg-brand' : 'bg-bg-muted text-text-secondary'}`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend.up ? 'text-text-success' : 'text-error-strong'}`}>
          {trend.up ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary mt-0.5">{label}</p>
    </div>
  </Card>
);
