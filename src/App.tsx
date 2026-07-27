import React, { useState, useEffect } from 'react';
import { StudentProfile, ActivityItem, GradeYear } from './types';
import { SAMPLE_PROFILES, DEFAULT_MILESTONES, TARGET_COLLEGE_PRESETS } from './data/defaults';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TimelinePlanner } from './components/TimelinePlanner';
import { ActivityManager } from './components/ActivityManager';
import { SmartSuggestionsView } from './components/SmartSuggestionsView';
import { CollegeExplorerView } from './components/CollegeExplorerView';
import { ActivityModal } from './components/ActivityModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { MilestoneCelebration } from './components/MilestoneCelebration';

const STORAGE_KEY = 'highschool_roadmap_student_profile_v1';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved profile:', e);
    }
    return SAMPLE_PROFILES.josh_stem;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline' | 'activities' | 'suggestions' | 'colleges'>('dashboard');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<ActivityItem | null>(null);
  const [defaultGradeForAdd, setDefaultGradeForAdd] = useState<GradeYear>(profile.currentGrade);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [celebrationTitle, setCelebrationTitle] = useState<string | null>(null);

  // Sync profile to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }, [profile]);

  const handleOpenAddActivity = (gradeForAdd?: GradeYear, actToEdit?: ActivityItem | null) => {
    setActivityToEdit(actToEdit || null);
    setDefaultGradeForAdd(gradeForAdd || profile.currentGrade);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (activity: ActivityItem) => {
    setProfile((prev) => {
      const existingIdx = prev.activities.findIndex((a) => a.id === activity.id);
      let updatedActivities = [...prev.activities];

      if (existingIdx >= 0) {
        updatedActivities[existingIdx] = activity;
      } else {
        updatedActivities.unshift(activity);
      }

      return { ...prev, activities: updatedActivities };
    });
  };

  const handleResetData = () => {
    if (confirm('Reset profile to fresh starter state? This will load default starter data.')) {
      setProfile(SAMPLE_PROFILES.josh_stem);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.studentName.replaceAll(' ', '_')}_College_Roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        setProfile={setProfile}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onResetData={handleResetData}
        onExportJson={handleExportJson}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            onOpenAddActivity={() => handleOpenAddActivity()}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelinePlanner
            profile={profile}
            setProfile={setProfile}
            onOpenAddActivity={(grade) => handleOpenAddActivity(grade)}
            onMilestoneCompleted={(title) => setCelebrationTitle(title)}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityManager
            profile={profile}
            setProfile={setProfile}
            onOpenAddModal={(act) => handleOpenAddActivity(undefined, act)}
          />
        )}

        {activeTab === 'suggestions' && <SmartSuggestionsView profile={profile} />}

        {activeTab === 'colleges' && <CollegeExplorerView profile={profile} setProfile={setProfile} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© HighSchool Journey & College Prep AI • 4-Year Roadmap Planner</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Freshman (9th)</span>
            <span>•</span>
            <span>Sophomore (10th)</span>
            <span>•</span>
            <span>Junior (11th)</span>
            <span>•</span>
            <span>Senior (12th)</span>
          </div>
        </div>
      </footer>

      {/* Activity Edit / Add Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        activityToEdit={activityToEdit}
        defaultGrade={defaultGradeForAdd}
      />

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* Milestone Celebration Toast */}
      <MilestoneCelebration
        title={celebrationTitle}
        onClose={() => setCelebrationTitle(null)}
      />
    </div>
  );
}
