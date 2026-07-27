export type GradeYear = 9 | 10 | 11 | 12;

export type ActivityCategory =
  | 'AP & Honors Courses'
  | 'SAT / ACT & Testing'
  | 'Sports & Athletics'
  | 'Clubs & Organizations'
  | 'Leadership & Awards'
  | 'Volunteering & Community'
  | 'Summer & Internships'
  | 'Personal Passion Projects';

export type ActivityStatus = 'Planned' | 'In Progress' | 'Completed';

export interface ActivityItem {
  id: string;
  title: string;
  category: ActivityCategory;
  grades: GradeYear[];
  role: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  description: string;
  bullets?: string[];
  status: ActivityStatus;
  impactScore: number; // 1 to 10 scale
  dateAdded: string;
}

export interface MilestoneItem {
  id: string;
  grade: GradeYear;
  season: 'Fall' | 'Winter' | 'Spring' | 'Summer';
  title: string;
  description: string;
  category: ActivityCategory | 'General Admissions';
  isCompleted: boolean;
}

export interface CollegeTarget {
  id: string;
  name: string;
  tier: 'Ivy+ / Top 10' | 'Top 30' | 'Top 50 / State Flagship' | 'Liberal Arts' | 'General Prep';
  avgGpa: number;
  avgSat: number;
  acceptanceRate: string;
  notablePrograms: string[];
}

export interface StudentProfile {
  studentName: string;
  currentGrade: GradeYear;
  targetCollegeTier: 'Ivy+ / Top 10' | 'Top 30' | 'Top 50 / State Flagship' | 'Liberal Arts' | 'General Prep';
  targetMajor: string;
  unweightedGpa: number;
  weightedGpa: number;
  satScore: number; // 400 - 1600
  actScore: number; // 1 - 36
  activities: ActivityItem[];
  milestones: MilestoneItem[];
  targetColleges: CollegeTarget[];
  notes: string;
}

export interface AiAuditResult {
  overallScore: number;
  tierEvaluation: string;
  keyStrengths: string[];
  criticalGaps: string[];
  recommendedFocusForCurrentGrade: string[];
  passionSpikeIdea: string;
}

export interface AiSuggestion {
  title: string;
  category: string;
  reason: string;
  impactLevel: 'High' | 'Essential';
}
