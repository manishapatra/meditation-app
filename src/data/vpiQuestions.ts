// Vedic Personality Inventory — 56 items (55 captured; VPI35 missing)
// 7-point Likert. Responses stored as the 0-based scale index (0..6).
// Guna mapping and scoring are deliberately NOT defined here — added in a
// separate scoring module once the official S-VYASA / Wolf 1999 key is in hand.

export const VPI_SCALE: readonly [string, string, string, string, string, string, string] = [
  'Very Strongly Disagree',
  'Strongly Disagree',
  'Somewhat Disagree',
  'Neutral',
  'Somewhat Agree',
  'Strongly Agree',
  'Very Strongly Agree',
]

export interface VPIItem {
  id: string
  text: string
}

export const VPI_ITEMS: readonly VPIItem[] = [
  { id: 'VPI1', text: 'I am straightforward in my dealings with other people.' },
  { id: 'VPI2', text: 'I have very little interest in spiritual understanding.' },
  { id: 'VPI3', text: 'I am satisfied with my life.' },
  { id: 'VPI4', text: 'Fruits and vegetables are among my favorite foods.' },
  { id: 'VPI5', text: 'All living entities are essentially spiritual.' },
  { id: 'VPI6', text: 'In conducting my activities, I do not consider traditional wisdom.' },
  { id: 'VPI7', text: 'I often act without considering the future consequences of my actions.' },
  { id: 'VPI8', text: 'I usually feel discontented with life.' },
  { id: 'VPI9', text: 'I become happy when I think about the material assets that I possess.' },
  { id: 'VPI10', text: 'I am good at using willpower to achieve goals.' },
  { id: 'VPI11', text: 'I enjoy spending time in bars (or public places of enjoyment).' },
  { id: 'VPI12', text: 'Cleanliness is very important to me.' },
  { id: 'VPI13', text: 'Others say that my intelligence is very sharp.' },
  { id: 'VPI14', text: 'I often feel depressed.' },
  { id: 'VPI15', text: 'I often put off or delay my responsibilities.' },
  { id: 'VPI16', text: 'I greatly admire materially successful people.' },
  { id: 'VPI17', text: 'When I speak, I really try not to irritate others.' },
  { id: 'VPI18', text: 'I believe life is over when the body dies.' },
  { id: 'VPI19', text: 'I often feel helpless.' },
  { id: 'VPI20', text: 'I enjoy foods with strong tastes.' },
  { id: 'VPI21', text: 'I am constantly dissatisfied with my position in life.' },
  { id: 'VPI22', text: 'Having possessions is very important to me.' },
  { id: 'VPI23', text: 'When things are tough, I often bail out (withdraw).' },
  { id: 'VPI24', text: 'I often feel like a victim.' },
  { id: 'VPI25', text: 'I feel that my knowledge is always increasing.' },
  { id: 'VPI26', text: 'I prefer city night life to a walk in the forest.' },
  { id: 'VPI27', text: 'For me, sex life is a major source of happiness.' },
  { id: 'VPI28', text: 'I take guidance from higher ethical and moral laws before I act.' },
  { id: 'VPI29', text: 'I enjoy intoxicating substances (including coffee, cigarettes and alcohol).' },
  { id: 'VPI30', text: 'I often feel greedy.' },
  { id: 'VPI31', text: "I become greatly distressed when things don't work out for me." },
  { id: 'VPI32', text: 'I am often angry.' },
  { id: 'VPI33', text: 'I often feel fearful.' },
  { id: 'VPI34', text: 'I do not have doubts about my responsibilities in life.' },
  // VPI35 — TODO: get item text from S-VYASA source; intentionally omitted for now.
  { id: 'VPI36', text: 'I enjoy eating meat.' },
  { id: 'VPI37', text: 'I am self-controlled.' },
  { id: 'VPI38', text: 'I am very dutiful.' },
  { id: 'VPI39', text: 'When I give charity, I often do it grudgingly.' },
  { id: 'VPI40', text: 'Self-realization is not important for me.' },
  { id: 'VPI41', text: 'I often feel dejected.' },
  { id: 'VPI42', text: 'I carry out my responsibilities regardless of whether there is success or failure.' },
  { id: 'VPI43', text: 'I often neglect my responsibilities to my family.' },
  { id: 'VPI44', text: 'I am easily affected by the joys and sorrows of life.' },
  { id: 'VPI45', text: 'I often whine.' },
  // VPI46 source was truncated mid-sentence; using inferred best completion.
  // TODO: confirm exact wording from S-VYASA source.
  { id: 'VPI46', text: 'Regardless of what I acquire or achieve, I have an uncontrollable desire to obtain more.' },
  { id: 'VPI47', text: 'I am currently struggling with an addiction, physical or psychological, to some type of intoxicant (including caffeine, cigarettes and alcohol).' },
  { id: 'VPI48', text: 'I often envy others.' },
  { id: 'VPI49', text: 'My job is a source of anxiety.' },
  { id: 'VPI50', text: 'I never think about giving up my wealth and position for a simpler life.' },
  { id: 'VPI51', text: 'It often happens that those things that brought me happiness later become the source of my suffering.' },
  { id: 'VPI52', text: 'I often feel mentally unbalanced.' },
  { id: 'VPI53', text: "I don't have much will power." },
  { id: 'VPI54', text: 'I often neglect my responsibilities to my friends.' },
  { id: 'VPI55', text: 'I often act violently towards others.' },
  { id: 'VPI56', text: 'I am good at controlling my senses and emotions.' },
]
