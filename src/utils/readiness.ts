import { StudentProfile, ActivityItem } from '../types';

export interface ReadinessPillar {
  name: string;
  score: number; // 0 to 100
  maxScore: number;
  description: string;
  color: string;
}

export interface ReadinessAnalysis {
  overallScore: number;
  tierLabel: string;
  badgeColor: string;
  pillars: {
    academics: ReadinessPillar;
    testing: ReadinessPillar;
    extracurriculars: ReadinessPillar;
    leadership: ReadinessPillar;
    community: ReadinessPillar;
    rigor: ReadinessPillar;
  };
  keyInsights: string[];
}

export function calculateReadinessScore(profile: StudentProfile): ReadinessAnalysis {
  const { currentGrade, targetCollegeTier, unweightedGpa, satScore, actScore, activities } = profile;

  // 1. Academic GPA Score (0 - 100)
  let gpaScore = 0;
  if (unweightedGpa > 0) {
    if (unweightedGpa >= 3.9) gpaScore = 98;
    else if (unweightedGpa >= 3.8) gpaScore = 90;
    else if (unweightedGpa >= 3.6) gpaScore = 80;
    else if (unweightedGpa >= 3.3) gpaScore = 70;
    else gpaScore = Math.max(40, Math.round((unweightedGpa / 4.0) * 75));
  } else {
    gpaScore = 50; // Default placeholder
  }

  // 2. Testing Score (0 - 100)
  let testingScore = 0;
  const satTarget = targetCollegeTier === 'Ivy+ / Top 10' ? 1540 : targetCollegeTier === 'Top 30' ? 1480 : 1380;
  if (satScore > 0) {
    testingScore = Math.min(100, Math.round((satScore / satTarget) * 95));
  } else if (actScore > 0) {
    const actEquivalentSat = actScore * 42 + 200;
    testingScore = Math.min(100, Math.round((actEquivalentSat / satTarget) * 95));
  } else {
    // If testing not taken yet, scale expectation by grade
    testingScore = currentGrade === 9 ? 75 : currentGrade === 10 ? 65 : 45;
  }

  // 3. AP & Course Rigor (0 - 100)
  const apActivities = activities.filter((a) => a.category === 'AP & Honors Courses');
  const totalApCount = apActivities.length;
  let rigorScore = Math.min(100, totalApCount * 22 + (currentGrade === 9 ? 40 : currentGrade === 10 ? 25 : 10));

  // 4. Extracurricular Depth (0 - 100)
  const nonAcademicActs = activities.filter((a) => a.category !== 'AP & Honors Courses' && a.category !== 'SAT / ACT & Testing');
  const totalHoursWeekly = nonAcademicActs.reduce((acc, curr) => acc + (curr.hoursPerWeek || 0), 0);
  const multiYearCount = nonAcademicActs.filter((a) => a.grades.length >= 2).length;
  let ecScore = Math.min(100, Math.round((totalHoursWeekly / 18) * 50 + multiYearCount * 15 + nonAcademicActs.length * 8));

  // 5. Leadership & Impact (0 - 100)
  const leadershipActs = nonAcademicActs.filter(
    (a) =>
      a.category === 'Leadership & Awards' ||
      a.role.toLowerCase().includes('president') ||
      a.role.toLowerCase().includes('captain') ||
      a.role.toLowerCase().includes('founder') ||
      a.role.toLowerCase().includes('officer') ||
      a.role.toLowerCase().includes('lead') ||
      a.role.toLowerCase().includes('head')
  );
  const highImpactCount = nonAcademicActs.filter((a) => a.impactScore >= 8).length;
  let leadershipScore = Math.min(100, leadershipActs.length * 28 + highImpactCount * 18 + (currentGrade <= 10 ? 20 : 0));

  // 6. Community & Volunteering (0 - 100)
  const volunteerActs = activities.filter((a) => a.category === 'Volunteering & Community');
  const volunteerHoursYearly = volunteerActs.reduce((acc, curr) => acc + curr.hoursPerWeek * curr.weeksPerYear, 0);
  let communityScore = Math.min(100, Math.round((volunteerHoursYearly / 80) * 70 + volunteerActs.length * 15));

  // Weighted overall calculation
  let overall = Math.round(
    gpaScore * 0.25 +
      rigorScore * 0.15 +
      testingScore * 0.15 +
      ecScore * 0.20 +
      leadershipScore * 0.15 +
      communityScore * 0.10
  );

  // Grade adjustment: Freshmen & Sophomores are projected
  if (currentGrade === 9) overall = Math.min(96, overall + 10);
  else if (currentGrade === 10) overall = Math.min(97, overall + 5);

  overall = Math.max(35, Math.min(99, overall));

  // Tier designation label
  let tierLabel = 'On Track for Target';
  let badgeColor = 'bg-emerald-500/15 text-emerald-700 border-emerald-300';

  if (targetCollegeTier === 'Ivy+ / Top 10') {
    if (overall >= 92) {
      tierLabel = 'Highly Competitive for Top 10';
      badgeColor = 'bg-indigo-500/15 text-indigo-700 border-indigo-300';
    } else if (overall >= 82) {
      tierLabel = 'Competitive Candidate for Top 20';
      badgeColor = 'bg-blue-500/15 text-blue-700 border-blue-300';
    } else {
      tierLabel = 'Building Profile for Top 20';
      badgeColor = 'bg-amber-500/15 text-amber-700 border-amber-300';
    }
  } else if (targetCollegeTier === 'Top 30') {
    if (overall >= 85) {
      tierLabel = 'Strong Match for Top 30';
      badgeColor = 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
    } else {
      tierLabel = 'Promising Candidate for Top 30';
      badgeColor = 'bg-blue-500/15 text-blue-700 border-blue-300';
    }
  }

  // Quick insights list
  const keyInsights: string[] = [];

  if (unweightedGpa >= 3.8) {
    keyInsights.push('Strong academic GPA baseline gives you solid admissions standing.');
  } else if (unweightedGpa > 0) {
    keyInsights.push('Focus on maintaining upward GPA trend in core junior/senior courses.');
  }

  if (leadershipActs.length > 0) {
    keyInsights.push(`Demonstrated student leadership with ${leadershipActs.length} active leadership position(s).`);
  } else {
    keyInsights.push('Opportunity: Step up into an officer, team captain, or project founder role.');
  }

  if (volunteerHoursYearly < 30) {
    keyInsights.push('Community Service Gap: Consider logging 30-50 hours of consistent volunteering.');
  } else {
    keyInsights.push(`Solid service record with ~${volunteerHoursYearly} annual volunteer hours logged.`);
  }

  if (nonAcademicActs.length >= 4) {
    keyInsights.push('Well-rounded extracurricular activity portfolio.');
  } else {
    keyInsights.push('Add 1-2 key interest clubs or passion initiatives to round out your profile.');
  }

  return {
    overallScore: overall,
    tierLabel,
    badgeColor,
    pillars: {
      academics: {
        name: 'GPA & Grades',
        score: gpaScore,
        maxScore: 100,
        description: `${unweightedGpa > 0 ? unweightedGpa.toFixed(2) : '3.80+'} Unweighted Target`,
        color: 'from-emerald-500 to-teal-600',
      },
      rigor: {
        name: 'AP/Honors Rigor',
        score: rigorScore,
        maxScore: 100,
        description: `${totalApCount} AP/Honors course(s) logged`,
        color: 'from-blue-500 to-indigo-600',
      },
      testing: {
        name: 'SAT / ACT Testing',
        score: testingScore,
        maxScore: 100,
        description: satScore > 0 ? `SAT ${satScore}` : actScore > 0 ? `ACT ${actScore}` : 'Prep in Progress',
        color: 'from-violet-500 to-purple-600',
      },
      extracurriculars: {
        name: 'Extracurriculars',
        score: ecScore,
        maxScore: 100,
        description: `${totalHoursWeekly} hrs/wk total involvement`,
        color: 'from-amber-500 to-orange-600',
      },
      leadership: {
        name: 'Leadership & Impact',
        score: leadershipScore,
        maxScore: 100,
        description: `${leadershipActs.length} leadership role(s)`,
        color: 'from-rose-500 to-pink-600',
      },
      community: {
        name: 'Volunteering & Service',
        score: communityScore,
        maxScore: 100,
        description: `${volunteerHoursYearly} hrs/yr service`,
        color: 'from-cyan-500 to-blue-600',
      },
    },
    keyInsights,
  };
}
