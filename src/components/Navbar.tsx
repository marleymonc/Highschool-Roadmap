import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  Building2,
  Download,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { GradeYear, StudentProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/defaults';

interface NavbarProps {
  activeTab: 'dashboard' | 'timeline' | 'activities' | 'suggestions' | 'colleges';
  setActiveTab: (tab: 'dashboard' | 'timeline' | 'activities' | 'suggestions' | 'colleges') => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenSettings: () => void;
  onResetData: () => void;
  onExportJson: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  setProfile,
  onOpenSettings,
  onResetData,
  onExportJson,
}) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleSelectSampleProfile = (key: string) => {
    if (SAMPLE_PROFILES[key]) {
      setProfile(SAMPLE_PROFILES[key]);
      setShowProfileMenu(false);
    }
  };

  const gradeLabels: Record<GradeYear, string> = {
    9: '9th (Freshman)',
    10: '10th (Sophomore)',
    11: '11th (Junior)',
    12: '12th (Senior)',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  HighSchool Roadmap
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  College Prep AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">4-Year Journey & Readiness Planner</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Readiness & Dashboard
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-300" />
              4-Year Planner
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'activities'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-teal-300" />
              Activities ({profile.activities.length})
            </button>

            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'suggestions'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-pink-300" />
              AI Suggestions
            </button>

            <button
              onClick={() => setActiveTab('colleges')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'colleges'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-300" />
              Colleges
            </button>
          </nav>

          {/* Student Profile Quick Settings & Sample Switcher */}
          <div className="flex items-center gap-2">
            {/* Grade Badge */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              title="Click to edit profile settings"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{profile.studentName}</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                Gr {profile.currentGrade}
              </span>
            </button>

            {/* Presets & Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 text-xs"
                title="Sample Profiles & Options"
              >
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Demo Profiles</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 z-50 text-slate-200 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-slate-700 mb-1">
                    Load Demo Student Profile:
                  </div>
                  <button
                    onClick={() => handleSelectSampleProfile('josh_stem')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Alex Rivera (STEM & Robotics)</div>
                      <div className="text-[10px] text-slate-400">10th Grade • Target: Top 30</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectSampleProfile('maya_premed')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Maya Chen (Pre-Med & Research)</div>
                      <div className="text-[10px] text-slate-400">11th Grade • Target: Ivy+ / Top 10</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectSampleProfile('freshman_starter')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Sam Taylor (Freshman Starter)</div>
                      <div className="text-[10px] text-slate-400">9th Grade • Target: Top 50</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-700 my-1 pt-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onExportJson();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      Export Profile (JSON)
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onResetData();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-700 text-rose-400 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset to Fresh State
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex items-center justify-around bg-slate-950/80 border-t border-slate-800/80 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'timeline' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          4-Year Plan
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'activities' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          Activities
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'suggestions' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          AI Guide
        </button>
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'colleges' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Colleges
        </button>
      </div>
    </header>
  );
};
