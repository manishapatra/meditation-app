export type DominantPath = 'karma' | 'bhakti' | 'jnana' | 'raja'

export interface PathResonance {
  karma: number
  bhakti: number
  jnana: number
  raja: number
}

export interface Profile {
  id: string
  dominant_path: DominantPath | null
  path_resonance: PathResonance | null
  obstacle_preferences: { categories: ObstacleCategory[] } | null
  preferred_length_min: number
  started_at: string
  created_at: string
  updated_at: string
}

export type ObstacleCategory = 'physical' | 'emotional' | 'mental' | 'subtle'
