import React, { useState } from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { StudentProfile, GradeYear } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
}) => {
  const [name, setName] = useState(profile.studentName);
  const [currentGrade, setCurrentGrade] = useState<GradeYear>(profile.currentGrade);
  const [tier, setTier] = useState<StudentProfile['targetCollegeTier']>(profile.targetCollegeTier);
  const [major, setMajor] = useState(profile.targetMajor);
  const [unweightedGpa, setUnweightedGpa] = useState(profile.unweightedGpa ? String(profile.unweightedGpa) : '3.85');
  const [weightedGpa, setWeightedGpa] = useState(profile.weightedGpa ? String(profile.weightedGpa) : '4.25');
  const [satScore, setSatScore] = useState(profile.satScore ? String(profile.satScore) : '1450');
  const [actScore, setActScore] = useState(profile.actScore ? String(profile.actScore) : '0');
  const [notes, setNotes] = useState(profile.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setProfile((prev) => ({
      ...prev,
      studentName: name.trim() || 'High School Student',
      currentGrade,
      targetCollegeTier: tier,
      targetMajor: major.trim() || 'Undecided Major',
      unweightedGpa: parseFloat(unweightedGpa) || 3.8,
      weightedGpa: parseFloat(weightedGpa) || 4.2,
      satScore: parseInt(satScore) || 0,
      actScore: parseInt(actScore) || 0,
      notes: notes.trim(),
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Student Profile & Admissions Goal</h3>
              <p className="text-xs text-slate-400">Configure Grade Level, Target Tier & Academics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Grade Level</label>
              <select
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value) as GradeYear)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-700"
              >
                <option value={9}>9th Grade (Freshman)</option>
                <option value={10}>10th Grade (Sophomore)</option>
                <option value={11}>11th Grade (Junior)</option>
                <option value={12}>12th Grade (Senior)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target College Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as StudentProfile['targetCollegeTier'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
              >
                <option value="Ivy+ / Top 10">Ivy+ / Top 10 Universities</option>
                <option value="Top 30">Top 30 National Universities</option>
                <option value="Top 50 / State Flagship">Top 50 / State Flagship</option>
                <option value="Liberal Arts">Top Liberal Arts Colleges</option>
                <option value="General Prep">General College Prep</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Major / Area of Interest</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science, Pre-Med / Neuroscience, Business, Political Science"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* GPA & Test Scores */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-700 block">Academic & Testing Benchmarks:</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Unweighted GPA (out of 4.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="4.0"
                  value={unweightedGpa}
                  onChange={(e) => setUnweightedGpa(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Weighted GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="5.0"
                  value={weightedGpa}
                  onChange={(e) => setWeightedGpa(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">SAT Score (400-1600)</label>
                <input
                  type="number"
                  min="0"
                  max="1600"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  placeholder="e.g. 1480 (0 if not taken)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ACT Score (1-36)</label>
                <input
                  type="number"
                  min="0"
                  max="36"
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  placeholder="e.g. 33 (0 if not taken)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Personal Notes & Goals</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Target 1520+ SAT, looking for summer hospital research opportunities..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
