import type { DominantPath, PathResonance } from '../types/database'

export type Q1Answer = 'action' | 'study' | 'mantra' | 'breath'
export type Q3Choice = 'serving' | 'study' | 'mantras' | 'breath'
export type Q4Choice = 'physical' | 'emotional' | 'mental' | 'subtle'

export interface OnboardingAnswers {
  q1: Q1Answer | null
  q2: number // 0 = logical, 100 = intuitive
  q3: Q3Choice[]
  q4: Q4Choice[]
}

const Q1_TO_PATH: Record<Q1Answer, keyof PathResonance> = {
  action: 'karma',
  study: 'jnana',
  mantra: 'bhakti',
  breath: 'raja',
}

const Q3_TO_PATH: Record<Q3Choice, keyof PathResonance> = {
  serving: 'karma',
  study: 'jnana',
  mantras: 'bhakti',
  breath: 'raja',
}

export function scoreResonance(answers: OnboardingAnswers): PathResonance {
  const r: PathResonance = { karma: 0, bhakti: 0, jnana: 0, raja: 0 }

  if (answers.q1) {
    r[Q1_TO_PATH[answers.q1]] += 40
  }

  if (answers.q2 <= 30) {
    r.jnana += 15
    r.raja += 10
  } else if (answers.q2 >= 70) {
    r.bhakti += 15
    r.karma += 10
  } else {
    r.karma += 10
    r.raja += 10
  }

  for (const choice of answers.q3) {
    r[Q3_TO_PATH[choice]] += 20
  }

  const max = Math.max(r.karma, r.bhakti, r.jnana, r.raja)
  if (max === 0) return r
  return {
    karma: Math.round((r.karma / max) * 100),
    bhakti: Math.round((r.bhakti / max) * 100),
    jnana: Math.round((r.jnana / max) * 100),
    raja: Math.round((r.raja / max) * 100),
  }
}

const TIEBREAK_ORDER: DominantPath[] = ['karma', 'bhakti', 'jnana', 'raja']

export function dominantPath(r: PathResonance): DominantPath {
  let winner: DominantPath = 'karma'
  let winnerScore = -1
  for (const path of TIEBREAK_ORDER) {
    if (r[path] > winnerScore) {
      winner = path
      winnerScore = r[path]
    }
  }
  return winner
}

export const PATH_DESCRIPTIONS: Record<DominantPath, { title: string; subtitle: string; description: string }> = {
  karma: {
    title: 'Karma',
    subtitle: 'The Path of Action',
    description:
      'You find clarity through service and disciplined action. Your practice will lean into selfless work as meditation in motion.',
  },
  bhakti: {
    title: 'Bhakti',
    subtitle: 'The Path of Devotion',
    description:
      'You move toward the divine through love, mantra, and surrender. Your practice will cultivate feeling and devotional rhythm.',
  },
  jnana: {
    title: 'Jnana',
    subtitle: 'The Path of Knowledge',
    description:
      'You seek truth through discernment and study. Your practice will explore the nature of self through inquiry.',
  },
  raja: {
    title: 'Raja',
    subtitle: 'The Path of Discipline',
    description:
      'You walk the eightfold path of inner discipline — breath, posture, concentration, absorption.',
  },
}
