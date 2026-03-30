import React from 'react';

// S — a single silent shimmer block. No text. Pure shape.
const S = ({ className = '' }) => (
  <div
    className={`relative overflow-hidden bg-slate-100 rounded-2xl
      after:absolute after:inset-0 after:-translate-x-full
      after:animate-[shimmer_2s_infinite]
      after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent
      ${className}`}
  />
);

// Generic export for one-off use elsewhere
export default function Skeleton({ className = '', variant = 'text', count = 1 }) {
  const variants = {
    text:   'h-3 w-full rounded-full',
    title:  'h-8 w-1/2 rounded-2xl',
    avatar: 'h-12 w-12 rounded-full',
    pill:   'h-8 w-24 rounded-full',
    circle: 'h-16 w-16 rounded-full',
    card:   'h-48 w-full rounded-[32px]',
    hero:   'h-72 w-full rounded-[40px]',
    bar:    'h-2 w-full rounded-full',
  };
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <S key={i} className={`${variants[variant] || variants.text} ${className}`} />
      ))}
    </div>
  );
}

// ─── DashboardSkeleton ───────────────────────────────────────────────────────
// Mirrors: slate-900 hero banner → 4 stat cards → 8/4 grid (table card left, sidebar right)
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">

      {/* Hero banner (same dark bg, same padding, same height) */}
      <div className="bg-slate-900 rounded-[40px] p-10 flex flex-col gap-4">
        <S className="h-4 w-28 bg-slate-800 rounded-full" />
        <S className="h-10 w-64 bg-slate-800 rounded-2xl" />
        <S className="h-3 w-80 bg-slate-800/50 rounded-full" />
      </div>

      {/* 4 KPI stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm">
            <S className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2.5">
              <S className="h-2 w-20 rounded-full" />
              <S className="h-6 w-28 rounded-xl" />
              <S className="h-2 w-14 rounded-full opacity-50" />
            </div>
          </div>
        ))}
      </div>

      {/* Main 8 / 4 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left column: proposals table + 3 quick-action tiles */}
        <div className="lg:col-span-8 space-y-8">

          {/* Proposals card */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            {/* header row */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="space-y-2">
                <S className="h-4 w-44 rounded-xl" />
                <S className="h-2 w-28 rounded-full opacity-50" />
              </div>
              <S className="h-3 w-20 rounded-full" />
            </div>
            {/* 4 row stubs */}
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="px-8 py-5 flex items-center justify-between border-b border-slate-50/60 last:border-0">
                <div className="flex items-center gap-4">
                  <S className="w-11 h-11 rounded-2xl shrink-0" />
                  <div className="space-y-2">
                    <S className="h-3 w-48 rounded-xl" />
                    <S className="h-2 w-32 rounded-full opacity-40" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <S className="h-8 w-20 rounded-xl" />
                  <S className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick-action grid (3 tiles) */}
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col items-center gap-4 shadow-sm">
                <S className="w-12 h-12 rounded-2xl" />
                <S className="h-3 w-24 rounded-xl" />
                <S className="h-2 w-16 rounded-full opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Segment bars card */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-6">
            <S className="h-4 w-32 rounded-xl" />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <S className="h-2 w-24 rounded-full" />
                <S className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
          {/* Dark CTA block */}
          <S className="h-56 rounded-[40px]" />
        </div>
      </div>
    </div>
  );
}

// ─── CampaignDetailSkeleton ───────────────────────────────────────────────────
// Mirrors: campaign header card → 8/4 grid (image + description left, progress + reports right)
export function CampaignDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">

      {/* Back link */}
      <S className="h-3 w-28 rounded-full" />

      {/* Campaign header card */}
      <div className="bg-white rounded-[48px] border border-slate-100 p-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <S className="w-16 h-16 rounded-full shrink-0" />
          <div className="space-y-3">
            <S className="h-8 w-72 rounded-2xl" />
            <div className="flex gap-2">
              <S className="h-7 w-20 rounded-full" />
              <S className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <S className="h-11 w-28 rounded-2xl" />
          <S className="h-11 w-28 rounded-2xl" />
        </div>
      </div>

      {/* 8 / 4 body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Mission media (16:9) */}
          <S className="w-full aspect-video rounded-[48px]" />
          {/* Description block */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 space-y-4">
            <S className="h-6 w-40 rounded-xl" />
            <S className="h-3 w-full rounded-full" />
            <S className="h-3 w-full rounded-full" />
            <S className="h-3 w-4/5 rounded-full" />
            <S className="h-3 w-3/5 rounded-full" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-10">
          {/* Progress card */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-5">
            <S className="h-4 w-32 rounded-xl" />
            <S className="h-2 w-full rounded-full" />
            <div className="flex justify-between gap-4">
              <S className="h-3 w-20 rounded-full" />
              <S className="h-3 w-20 rounded-full" />
            </div>
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <S className="w-8 h-8 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <S className="h-2 w-24 rounded-full" />
                  <S className="h-2 w-16 rounded-full opacity-40" />
                </div>
              </div>
            ))}
          </div>
          {/* Reports card */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-5">
            <S className="h-4 w-28 rounded-xl" />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <S className="w-8 h-8 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <S className="h-2 w-32 rounded-full" />
                  <S className="h-2 w-20 rounded-full opacity-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
