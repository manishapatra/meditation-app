// General Health Questionnaire — 12 items
// Scoring is NOT done here. Responses are stored as the 0-based scale index
// (0..3) and scored in a separate module once the rubric is finalized.

export type GHQDirection = 'positive' | 'negative'

export interface GHQItem {
  id: string
  text: string
  scale: readonly [string, string, string, string]
  direction: GHQDirection
}

const POSITIVE_SCALE = [
  'More so than usual',
  'Same as usual',
  'Less than usual',
  'Much less than usual',
] as const

const NEGATIVE_SCALE = [
  'Not at all',
  'No more than usual',
  'Rather more than usual',
  'Much more than usual',
] as const

export const GHQ_ITEMS: readonly GHQItem[] = [
  {
    id: 'GHQ1',
    text: "Been able to concentrate on what you're doing.",
    // Source uses 'Better than usual' here specifically.
    scale: ['Better than usual', 'Same as usual', 'Less than usual', 'Much less than usual'],
    direction: 'positive',
  },
  { id: 'GHQ2', text: 'Lost much sleep over worry.', scale: NEGATIVE_SCALE, direction: 'negative' },
  { id: 'GHQ3', text: 'Felt you were playing a useful part in things.', scale: POSITIVE_SCALE, direction: 'positive' },
  { id: 'GHQ4', text: 'Felt capable of making decisions about things.', scale: POSITIVE_SCALE, direction: 'positive' },
  { id: 'GHQ5', text: 'Felt constantly under strain.', scale: NEGATIVE_SCALE, direction: 'negative' },
  { id: 'GHQ6', text: "Felt you couldn't overcome your difficulties.", scale: NEGATIVE_SCALE, direction: 'negative' },
  { id: 'GHQ7', text: 'Been able to enjoy your normal day-to-day activities.', scale: POSITIVE_SCALE, direction: 'positive' },
  { id: 'GHQ8', text: 'Been able to face up to your problems.', scale: POSITIVE_SCALE, direction: 'positive' },
  { id: 'GHQ9', text: 'Been feeling unhappy and depressed.', scale: NEGATIVE_SCALE, direction: 'negative' },
  { id: 'GHQ10', text: 'Been losing confidence in yourself.', scale: NEGATIVE_SCALE, direction: 'negative' },
  { id: 'GHQ11', text: 'Been thinking of yourself as a worthless person.', scale: NEGATIVE_SCALE, direction: 'negative' },
  { id: 'GHQ12', text: 'Been feeling reasonably happy, all things considered.', scale: POSITIVE_SCALE, direction: 'positive' },
]
