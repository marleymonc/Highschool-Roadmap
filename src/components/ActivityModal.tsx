import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Plus, Check, Wand2, Layers, Clock } from 'lucide-react';
import { ActivityItem, ActivityCategory, GradeYear, ActivityStatus } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityItem) => void;
  activityToEdit?: ActivityItem | null;
  defaultGrade?: GradeYear;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activityToEdit,
  defaultGrade = 9,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Clubs & Organizations');
  const [grades, setGrades] = useState<GradeYear[]>([defaultGrade]);
  const [role, setRole] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [weeksPerYear, setWeeksPerYear] = useState(30);
  const [description, setDescription] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [status, setStatus] = useState<ActivityStatus>('In Progress');
  const [impactScore, setImpactScore] = useState(7);

  const [isPolishing, setIsPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setCategory(activityToEdit.category);
      setGrades(activityToEdit.grades);
      setRole(activityToEdit.role);
      setHoursPerWeek(activityToEdit.hoursPerWeek);
      setWeeksPerYear(activityToEdit.weeksPerYear);
      setDescription(activityToEdit.description);
      setBullets(activityToEdit.bullets || []);
      setStatus(activityToEdit.status);
      setImpactScore(activityToEdit.impactScore);
    } else {
      setTitle('');
      setCategory('Clubs & Organizations');
      setGrades([defaultGrade]);
      setRole('');
      setHoursPerWeek(5);
      setWeeksPerYear(30);
      setDescription('');
      setBullets([]);
      setStatus('In Progress');
      setImpactScore(7);
    }
  }, [activityToEdit, defaultGrade, isOpen]);

  if (!isOpen) return null;

  const handleToggleGrade = (g: GradeYear) => {
    if (grades.includes(g)) {
      if (grades.length > 1) setGrades(grades.filter((item) => item !== g));
    } else {
      setGrades([...grades, g].sort((a, b) => a - b));
    }
  };

  const handlePolishWithAi = async () => {
    if (!description.trim()) {
      setPolishError('Please write a brief draft description first before polishing.');
      return;
    }

    setIsPolishing(true);
    setPolishError(null);

    try {
      const res = await fetch('/api/ai/polish-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawDescription: description,
          role,
          title,
          category,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to polish bullet point');
      }

      const data = await res.json();
      if (data.polishedBullets && data.polishedBullets.length > 0) {
        setBullets(data.polishedBullets);
      }
    } catch (err: any) {
      console.error(err);
      setPolishError(err.message || 'Error polishing description');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const item: ActivityItem = {
      id: activityToEdit ? activityToEdit.id : `act-${Date.now()}`,
      title: title.trim(),
      category,
      grades,
      role: role.trim() || 'Participant',
      hoursPerWeek: Number(hoursPerWeek) || 1,
      weeksPerYear: Number(weeksPerYear) || 1,
      description: description.trim(),
      bullets,
      status,
      impactScore: Number(impactScore) || 5,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    onSave(item);
    onClose();
  };

  const categoriesList: ActivityCategory[] = [
    'AP & Honors Courses',
    'SAT / ACT & Testing',
    'Sports & Athletics',
    'Clubs & Organizations',
    'Leadership & Awards',
    'Volunteering & Community',
    'Summer & Internships',
    'Personal Passion Projects',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 space-y-4 my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {activityToEdit ? 'Edit Activity Entry' : 'Log New Activity or Course'}
              </h3>
              <p className="text-xs text-slate-400">Common App & Portfolio Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Activity or Course Name *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. FRC Robotics, AP Chemistry, Varsity Soccer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role / Position</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Captain, President, Lead Developer, Member"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ActivityStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned for Future</option>
              </select>
            </div>
          </div>

          {/* Active Grade Years selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Active Grade Level(s)</label>
            <div className="flex items-center gap-2">
              {[9, 10, 11, 12].map((g) => {
                const active = grades.includes(g as GradeYear);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleToggleGrade(g as GradeYear)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Grade {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time commitment & Impact score */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hours / Week</label>
              <input
                type="number"
                min="1"
                max="40"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Weeks / Year</label>
              <input
                type="number"
                min="1"
                max="52"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Impact (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={impactScore}
                onChange={(e) => setImpactScore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description Notes & AI Polish Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">Draft Notes / Description</label>
              <button
                type="button"
                onClick={handlePolishWithAi}
                disabled={isPolishing}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100"
              >
                {isPolishing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Polishing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3 text-amber-500" />
                    AI Resume Bullet Polisher
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what you did, leadership responsibilities, awards, or key metrics..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {polishError && (
            <p className="text-rose-600 text-[11px] bg-rose-50 p-2 rounded-lg border border-rose-200">
              {polishError}
            </p>
          )}

          {/* Polished Bullet Point Preview */}
          {bullets.length > 0 && (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5">
              <span className="font-bold text-[10px] uppercase text-indigo-700 tracking-wider block">
                ✨ Polished College Application Bullets:
              </span>
              <ul className="space-y-1">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-800">
                    <span className="text-indigo-600 font-bold">•</span>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const newB = [...bullets];
                        newB[i] = e.target.value;
                        setBullets(newB);
                      }}
                      className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

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
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
