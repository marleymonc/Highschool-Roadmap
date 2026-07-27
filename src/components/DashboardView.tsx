import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Plus,
  ArrowRight,
  BookOpen,
  Target,
  FileCheck,
  Zap,
  Info,
  Loader2,
  Flame,
} from 'lucide-react';
import { StudentProfile, AiAuditResult } from '../types';
import { calculateReadinessScore } from '../utils/readiness';

interface DashboardViewProps {
  profile: StudentProfile;
  onOpenAddActivity: () => void;
  onOpenSettings: () => void;
  onNavigateTab: (tab: 'timeline' | 'activities' | 'suggestions' | 'colleges') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  onOpenAddActivity,
  onOpenSettings,
  onNavigateTab,
}) => {
  const readiness = calculateReadinessScore(profile);
  const [aiAudit, setAiAudit] = useState<AiAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);
    try {
      const response = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate audit');
      }

      const data = await response.json();
      setAiAudit(data);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || 'Error running AI audit');
    } finally {
      setIsAuditing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Grade {profile.currentGrade} Journey Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {profile.studentName}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Targeting <span className="font-semibold text-indigo-200">{profile.targetCollegeTier}</span> for{' '}
              <span className="font-semibold text-indigo-200">{profile.targetMajor || 'Undecided Major'}</span>.
              Here is your overall profile strength and gap analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddActivity}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
            <button
              onClick={onOpenSettings}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
            >
              Edit Profile Info
            </button>
          </div>
        </div>
      </div>

      {/* College Readiness Gauge & Overview Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Score Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-base">College Readiness Score</h2>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${readiness.badgeColor}`}>
              {readiness.tierLabel}
            </span>
          </div>

          <div className="py-2 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Visual Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                  strokeDasharray={`${readiness.overallScore}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900">{readiness.overallScore}</span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Out of 100</span>
              </div>
            </div>

            {/* Core Stats Snapshot */}
            <div className="space-y-3 w-full sm:w-auto text-sm">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <span className="text-slate-500 text-xs">Unweighted GPA:</span>
                <span className="font-bold text-slate-800">
                  {profile.unweightedGpa ? profile.unweightedGpa.toFixed(2) : '3.80 (Target)'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <span className="text-slate-500 text-xs">SAT / ACT:</span>
                <span className="font-bold text-slate-800">
                  {profile.satScore ? `${profile.satScore} SAT` : profile.actScore ? `${profile.actScore} ACT` : 'Not Taken'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <span className="text-slate-500 text-xs">Logged Activities:</span>
                <span className="font-bold text-indigo-600">{profile.activities.length} items</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <button
              onClick={handleRunAiAudit}
              disabled={isAuditing}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Analyzing Profile with Gemini AI...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 text-amber-300" />
                  Run Gemini AI Deep Profile Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* 6-Pillar Profile Balance Progress Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-base">Profile Pillar Breakdown</h2>
            </div>
            <span className="text-xs text-slate-400">Targeting {profile.targetCollegeTier}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(readiness.pillars).map(([key, pillar]) => (
              <div key={key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{pillar.name}</span>
                  <span className="font-bold text-indigo-600">{pillar.score}%</span>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${pillar.color} rounded-full transition-all duration-700`}
                    style={{ width: `${pillar.score}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-500">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Audit Result Banner (if loaded) */}
      {auditError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{auditError}</span>
        </div>
      )}

      {aiAudit && (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 border border-indigo-800/60 shadow-xl space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-indigo-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Gemini AI Profile Audit & Strategy</h3>
                <p className="text-xs text-indigo-200">{aiAudit.tierEvaluation}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-amber-300">{aiAudit.overallScore}</span>
              <span className="text-xs block text-slate-400">AI Readiness Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Application Strengths</span>
              </div>
              <ul className="space-y-1.5 text-slate-200">
                {aiAudit.keyStrengths?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Gaps */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Gaps to Address</span>
              </div>
              <ul className="space-y-1.5 text-slate-200">
                {aiAudit.criticalGaps?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Current Grade Focus */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-indigo-300">
                <Target className="w-4 h-4" />
                <span>Grade {profile.currentGrade} Focus Items</span>
              </div>
              <ul className="space-y-1.5 text-slate-200">
                {aiAudit.recommendedFocusForCurrentGrade?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Passion Spike Idea */}
          {aiAudit.passionSpikeIdea && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/40 flex items-start gap-3">
              <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 text-xs uppercase tracking-wider block">
                  Recommended Passion Project (Academic Spike)
                </span>
                <p className="text-xs text-slate-200 mt-0.5">{aiAudit.passionSpikeIdea}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strengths, Gaps & Immediate Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insights & Quick Action List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Smart Profile Insights</span>
            </div>
            <button
              onClick={() => onNavigateTab('suggestions')}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>AI Counselor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {readiness.keyInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation Shortcuts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Next Steps for Grade {profile.currentGrade}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onNavigateTab('timeline')}
              className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-indigo-900 text-xs block">View 4-Year Timeline Planner</span>
                <span className="text-[11px] text-indigo-700">Check off Fall/Winter grade milestones</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenAddActivity}
              className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-emerald-900 text-xs block">Log AP Class or Club Leadership</span>
                <span className="text-[11px] text-emerald-700">Use AI Bullet Polisher to craft resume entries</span>
              </div>
              <Plus className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab('colleges')}
              className="w-full p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-purple-900 text-xs block">Explore Target College Benchmarks</span>
                <span className="text-[11px] text-purple-700">Compare GPA/SAT against Stanford, MIT, Berkeley, etc.</span>
              </div>
              <FileCheck className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
