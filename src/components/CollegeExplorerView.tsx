import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  School,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { StudentProfile, CollegeTarget } from '../types';

interface CollegeExplorerViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export const CollegeExplorerView: React.FC<CollegeExplorerViewProps> = ({ profile, setProfile }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeTier, setNewCollegeTier] = useState<CollegeTarget['tier']>('Top 30');
  const [newAvgGpa, setNewAvgGpa] = useState('3.90');
  const [newAvgSat, setNewAvgSat] = useState('1450');
  const [newAcceptance, setNewAcceptance] = useState('15%');
  const [newPrograms, setNewPrograms] = useState('Computer Science, Business');

  const handleDeleteCollege = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      targetColleges: prev.targetColleges.filter((c) => c.id !== id),
    }));
  };

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;

    const newItem: CollegeTarget = {
      id: `college-${Date.now()}`,
      name: newCollegeName.trim(),
      tier: newCollegeTier,
      avgGpa: parseFloat(newAvgGpa) || 3.85,
      avgSat: parseInt(newAvgSat) || 1400,
      acceptanceRate: newAcceptance.trim() || '20%',
      notablePrograms: newPrograms.split(',').map((p) => p.trim()),
    };

    setProfile((prev) => ({
      ...prev,
      targetColleges: [...prev.targetColleges, newItem],
    }));

    setNewCollegeName('');
    setShowAddModal(false);
  };

  const getCollegeMatchCategory = (college: CollegeTarget): { category: 'Reach' | 'Target' | 'Safety'; badgeColor: string } => {
    const studentGpa = profile.unweightedGpa || 3.8;
    const studentSat = profile.satScore || (profile.actScore ? profile.actScore * 42 + 200 : 1380);

    // Highly competitive schools (<8% acceptance) are almost always Reaches
    const rateNum = parseFloat(college.acceptanceRate.replace('%', ''));
    if (!isNaN(rateNum) && rateNum < 8.0) {
      return { category: 'Reach', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' };
    }

    if (studentGpa >= college.avgGpa && studentSat >= college.avgSat) {
      return { category: 'Target', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    } else if (studentGpa >= college.avgGpa - 0.15 && studentSat >= college.avgSat - 60) {
      return { category: 'Target', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' };
    } else {
      return { category: 'Reach', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Target Colleges & Universities
            </span>
            <span className="text-xs text-slate-500">{profile.targetColleges.length} Colleges Shortlisted</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            College Benchmarks & Match Analysis
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Compare your GPA ({profile.unweightedGpa || 'N/A'}) and SAT ({profile.satScore || 'N/A'}) against target university averages.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add College to List
        </button>
      </div>

      {/* Target College Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profile.targetColleges.map((college) => {
          const match = getCollegeMatchCategory(college);
          const gpaDiff = profile.unweightedGpa ? profile.unweightedGpa - college.avgGpa : 0;
          const satDiff = profile.satScore ? profile.satScore - college.avgSat : 0;

          return (
            <div
              key={college.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                    {college.tier}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${match.badgeColor}`}>
                      {match.category}
                    </span>
                    <button
                      onClick={() => handleDeleteCollege(college.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove College"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-base">{college.name}</h3>
                  <p className="text-[11px] text-slate-500">
                    Acceptance Rate: <span className="font-semibold text-slate-700">{college.acceptanceRate}</span>
                  </p>
                </div>

                {/* Benchmark Stats Grid */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg GPA</span>
                    <span className="font-bold text-slate-800">{college.avgGpa.toFixed(2)}</span>
                    {profile.unweightedGpa > 0 && (
                      <span className={`text-[10px] block font-medium ${gpaDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {gpaDiff >= 0 ? `+${gpaDiff.toFixed(2)} above` : `${gpaDiff.toFixed(2)} below`}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg SAT</span>
                    <span className="font-bold text-slate-800">{college.avgSat}</span>
                    {profile.satScore > 0 && (
                      <span className={`text-[10px] block font-medium ${satDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {satDiff >= 0 ? `+${satDiff} above` : `${satDiff} below`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notable Programs */}
                {college.notablePrograms.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Top Programs:</span>
                    <div className="flex flex-wrap gap-1">
                      {college.notablePrograms.map((prog, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100">
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Admissions Alignment</span>
                <span className="font-semibold text-indigo-600">Grade {profile.currentGrade} Tracking</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add College to Target List</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCollege} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">College / University Name</label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g., UCLA, Duke University, Carnegie Mellon"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tier Category</label>
                  <select
                    value={newCollegeTier}
                    onChange={(e) => setNewCollegeTier(e.target.value as CollegeTarget['tier'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Ivy+ / Top 10">Ivy+ / Top 10</option>
                    <option value="Top 30">Top 30</option>
                    <option value="Top 50 / State Flagship">Top 50 / State Flagship</option>
                    <option value="Liberal Arts">Liberal Arts</option>
                    <option value="General Prep">General Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Acceptance Rate</label>
                  <input
                    type="text"
                    value={newAcceptance}
                    onChange={(e) => setNewAcceptance(e.target.value)}
                    placeholder="e.g. 8.5%"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Avg GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAvgGpa}
                    onChange={(e) => setNewAvgGpa(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Avg SAT</label>
                  <input
                    type="number"
                    value={newAvgSat}
                    onChange={(e) => setNewAvgSat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Programs (comma separated)</label>
                <input
                  type="text"
                  value={newPrograms}
                  onChange={(e) => setNewPrograms(e.target.value)}
                  placeholder="e.g. Computer Science, Bioengineering"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
                >
                  Save College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
