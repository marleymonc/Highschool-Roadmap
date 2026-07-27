import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  ChevronRight,
  Filter,
  Trophy,
  Award,
  Clock,
  Layers,
  Flame,
  Check,
  Star,
} from 'lucide-react';
import { StudentProfile, GradeYear, ActivityCategory, ActivityItem, MilestoneItem } from '../types';

interface TimelinePlannerProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenAddActivity: (gradeForAdd?: GradeYear) => void;
  onMilestoneCompleted: (title: string) => void;
}

export const TimelinePlanner: React.FC<TimelinePlannerProps> = ({
  profile,
  setProfile,
  onOpenAddActivity,
  onMilestoneCompleted,
}) => {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<GradeYear | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const grades: GradeYear[] = [9, 10, 11, 12];
  const gradeTitles: Record<GradeYear, { name: string; subtitle: string; color: string }> = {
    9: { name: 'Freshman Year (9th)', subtitle: 'Exploration & GPA Foundation', color: 'from-emerald-500 to-teal-600' },
    10: { name: 'Sophomore Year (10th)', subtitle: 'AP Rigor & Leadership Steps', color: 'from-blue-500 to-indigo-600' },
    11: { name: 'Junior Year (11th)', subtitle: 'SAT/ACT Peak, AP Honors & Spike', color: 'from-indigo-600 to-purple-600' },
    12: { name: 'Senior Year (12th)', subtitle: 'Application Essays & Submissions', color: 'from-rose-500 to-pink-600' },
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

  const handleToggleMilestone = (id: string) => {
    setProfile((prev) => {
      let completedTitle = '';
      const updatedMilestones = prev.milestones.map((m) => {
        if (m.id === id) {
          const nextVal = !m.isCompleted;
          if (nextVal) completedTitle = m.title;
          return { ...m, isCompleted: nextVal };
        }
        return m;
      });

      if (completedTitle) {
        setTimeout(() => onMilestoneCompleted(completedTitle), 100);
      }

      return { ...prev, milestones: updatedMilestones };
    });
  };

  const visibleGrades = selectedGradeFilter === 'ALL' ? grades : [selectedGradeFilter];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Year-by-Year Roadmap
            </span>
            <span className="text-xs text-slate-500">Current Grade: Grade {profile.currentGrade}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">Four-Year High School Timeline</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Plan courses, sports, clubs, standardized testing, and milestones from 9th through 12th grade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAddActivity()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Activity
          </button>
        </div>
      </div>

      {/* Grade & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        {/* Grade Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedGradeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedGradeFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 4 Years
          </button>
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGradeFilter(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedGradeFilter === g
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Grade {g}</span>
              {profile.currentGrade === g && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Nodes */}
      <div className="space-y-8">
        {visibleGrades.map((gradeNum) => {
          const info = gradeTitles[gradeNum];
          const gradeMilestones = profile.milestones.filter((m) => m.grade === gradeNum);
          const completedMilestones = gradeMilestones.filter((m) => m.isCompleted).length;

          // Filter activities for this grade
          const gradeActivities = profile.activities.filter((act) => {
            const matchesGrade = act.grades.includes(gradeNum);
            const matchesCat = selectedCategory === 'ALL' || act.category === selectedCategory;
            return matchesGrade && matchesCat;
          });

          const isCurrentGrade = profile.currentGrade === gradeNum;

          return (
            <div
              key={gradeNum}
              className={`bg-white rounded-3xl border transition-all ${
                isCurrentGrade
                  ? 'border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 shadow-sm'
              } overflow-hidden`}
            >
              {/* Grade Header Strip */}
              <div
                className={`bg-gradient-to-r ${info.color} text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-extrabold text-xl border border-white/20">
                    {gradeNum}th
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{info.name}</h3>
                      {isCurrentGrade && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 font-extrabold text-[10px] tracking-wide uppercase">
                          Current Grade
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/80">{info.subtitle}</p>
                  </div>
                </div>

                {/* Progress Metric for Grade Milestones */}
                <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <div className="text-right text-xs">
                    <span className="font-bold block">
                      {completedMilestones} / {gradeMilestones.length} Milestones Done
                    </span>
                    <span className="text-white/70 text-[10px]">Grade Completion</span>
                  </div>
                  <div className="w-16 bg-white/20 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-300 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          gradeMilestones.length > 0 ? (completedMilestones / gradeMilestones.length) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Grade Body: Milestones + Activities */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Grade Specific Milestones & Goals Checklist */}
                <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Grade {gradeNum} Key Milestones</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Click to mark complete</span>
                  </div>

                  <div className="space-y-2">
                    {gradeMilestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(m.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          m.isCompleted
                            ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {m.isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                          )}
                        </div>

                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                m.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
                              }`}
                            >
                              {m.title}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[10px] font-medium">
                              {m.season}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Activities for this Grade */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Activities & Courses Logged ({gradeActivities.length})</span>
                    </div>
                    <button
                      onClick={() => onOpenAddActivity(gradeNum)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Grade {gradeNum}</span>
                    </button>
                  </div>

                  {gradeActivities.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 space-y-2">
                      <Layers className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-medium">No activities logged for Grade {gradeNum} yet.</p>
                      <button
                        onClick={() => onOpenAddActivity(gradeNum)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs border border-indigo-200"
                      >
                        + Add Activity / AP Course
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {gradeActivities.map((act) => (
                        <div
                          key={act.id}
                          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all shadow-sm space-y-2 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                              {act.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{act.hoursPerWeek}h/wk</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{act.title}</h4>
                            <p className="text-[11px] text-indigo-600 font-medium">{act.role}</p>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2">{act.description}</p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                            <span className="text-slate-400">
                              Grades: {act.grades.map((g) => `${g}th`).join(', ')}
                            </span>
                            <div className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Impact: {act.impactScore}/10</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
