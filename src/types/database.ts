export type DominantPath = 'karma' | 'bhakti' | 'jnana' | 'raja'

export interface PathResonance {
  karma: number
  bhakti: number
  jnana: number
  raja: number
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export type ObstacleCategory = 'physical' | 'emotional' | 'mental' | 'subtle'

/**
 * Raw responses from the deep assessment. Stored as scale indices so the
 * scoring rubric can change later without re-surveying users.
 * - GHQ values are 0..3 (corresponding to the 4-point scale per item)
 * - VPI values are 0..6 (corresponding to the 7-point Likert)
 */
export interface AssessmentResponses {
  ghq?: Record<string, number>
  vpi?: Record<string, number>
  completed_at?: string
}

export interface Profile {
  id: string
  full_name: string | null
  age: number | null
  gender: Gender | null
  dominant_path: DominantPath | null
  path_resonance: PathResonance | null
  obstacle_preferences: { categories: ObstacleCategory[] } | null
  assessment_responses: AssessmentResponses | null
  preferred_length_min: number
  started_at: string
  created_at: string
  updated_at: string
}
