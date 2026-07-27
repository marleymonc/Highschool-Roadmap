import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock3,
  CalendarDays,
} from 'lucide-react';
import { StudentProfile, ActivityItem, ActivityCategory, GradeYear } from '../types';

interface ActivityManagerProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenAddModal: (actToEdit?: ActivityItem) => void;
}

export const ActivityManager: React.FC<ActivityManagerProps> = ({
  profile,
  setProfile,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');

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

  const handleDeleteActivity = (id: string) => {
    if (confirm('Are you sure you want to delete this activity entry?')) {
      setProfile((prev) => ({
        ...prev,
        activities: prev.activities.filter((a) => a.id !== id),
      }));
    }
  };

  const filteredActivities = profile.activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;

    const matchesGrade =
      selectedGradeFilter === 'ALL' || a.grades.includes(Number(selectedGradeFilter) as GradeYear);

    return matchesSearch && matchesCat && matchesGrade;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Activity Directory
            </span>
            <span className="text-xs text-slate-500">{profile.activities.length} Total Items Logged</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            Extracurriculars, Honors & Coursework
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage sports, clubs, AP courses, testing, and volunteering across all high school years.
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Activity
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
        {/* Search Field */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, roles, skills..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Grades (9-12)</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
          <Layers className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No matching activities found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search terms or filters above.</p>
          <button
            onClick={() => onOpenAddModal()}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-semibold text-xs border border-indigo-200 hover:bg-indigo-100"
          >
            + Add First Activity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                    {act.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenAddModal(act)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                      title="Edit Activity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">{act.title}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{act.role}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>

                {/* Bullets Preview if existing */}
                {act.bullets && act.bullets.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-700">
                    <span className="font-semibold text-[10px] uppercase text-indigo-600 tracking-wider block">
                      Common App Resume Bullets:
                    </span>
                    <ul className="space-y-1">
                      {act.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {act.hoursPerWeek}h/wk ({act.weeksPerYear}wks/yr)
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    Grades: {act.grades.map((g) => `${g}th`).join(', ')}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200 text-[10px]">
                  Impact: {act.impactScore}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
