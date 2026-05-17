# Stillness — Onboarding & Assessment Questions

Complete catalogue of every question the app asks a user. Grouped by where it appears in the flow. Pulled from:

- `src/screens/Onboarding.tsx` (demographics + path discovery)
- `src/data/ghqQuestions.ts` (GHQ-12)
- `src/data/vpiQuestions.ts` (VPI-56)
- `src/screens/DeepAssessment.tsx` (renders GHQ + VPI together)

---

## 1. Demographics

Step 1 of onboarding. Required to advance.

| Field | Input | Constraints |
|---|---|---|
| Name | Free text | Non-empty |
| Age | Number | Integer, 1–120 |
| Gender | Single select | `Male` or `Female` (DB allows `other`, `prefer_not_to_say`; UI does not yet expose them) |

---

## 2. Path Discovery — 4 items

Steps 2–5 of onboarding. Maps user to one of the four classical yogic margas: Karma, Bhakti, Jnana, Raja.

### Q1 — Expression of devotion *(single select)*

> **How do you most naturally express devotion?**
> There is no right answer. Different practitioners are drawn to different expressions of yoga.

| Option | Hint | Maps to |
|---|---|---|
| Through action | Service, work, doing | Karma |
| Through quiet study | Reading, contemplation | Jnana |
| Through chanting | Mantra, devotion, song | Bhakti |
| Through breath and stillness | Meditation, asana | Raja |

### Q2 — Mode of clarity *(slider, 0–100)*

> **How do you find clarity?**
> Some find it through reasoning. Others through felt sense. Most live somewhere between.

Range: **Logical** (0) ↔ **Intuitive** (100). Scoring rules:
- 0–30: boosts Jnana + Raja
- 70–100: boosts Bhakti + Karma
- 31–69: small Karma + Raja boost

### Q3 — Sources of centeredness *(multi-select)*

> **I feel most centered when I am…**
> Choose all that resonate.

| Option | Maps to |
|---|---|
| Serving others | Karma |
| In quiet study | Jnana |
| Chanting mantras | Bhakti |
| Observing breath | Raja |

### Q4 — Sources of imbalance *(multi-select)*

> **What tends to pull you off-center?**
> Choose all that apply. We'll tailor support around these later. *(Feeds the stuck-flow library; does not affect path scoring.)*

| Option | Hint |
|---|---|
| Physical | Tension, fatigue, restlessness in the body |
| Emotional | Turbulence, grief, fear, agitation |
| Mental | Racing thoughts, doubt, distraction |
| Subtle | A vague disconnection, dullness, drift |

---

## 3. General Health Questionnaire — GHQ-12

12 items. Each is scored on a 4-point scale. Two scale variants depending on item direction.

**Positive-direction scale** *(items GHQ1, 3, 4, 7, 8, 12)*:
1. Better / More so than usual
2. Same as usual
3. Less than usual
4. Much less than usual

**Negative-direction scale** *(items GHQ2, 5, 6, 9, 10, 11)*:
1. Not at all
2. No more than usual
3. Rather more than usual
4. Much more than usual

Prompt header: *"Over the past few weeks, have you…"*

| ID | Statement | Direction |
|---|---|---|
| GHQ1 | Been able to concentrate on what you're doing. | positive |
| GHQ2 | Lost much sleep over worry. | negative |
| GHQ3 | Felt you were playing a useful part in things. | positive |
| GHQ4 | Felt capable of making decisions about things. | positive |
| GHQ5 | Felt constantly under strain. | negative |
| GHQ6 | Felt you couldn't overcome your difficulties. | negative |
| GHQ7 | Been able to enjoy your normal day-to-day activities. | positive |
| GHQ8 | Been able to face up to your problems. | positive |
| GHQ9 | Been feeling unhappy and depressed. | negative |
| GHQ10 | Been losing confidence in yourself. | negative |
| GHQ11 | Been thinking of yourself as a worthless person. | negative |
| GHQ12 | Been feeling reasonably happy, all things considered. | positive |

---

## 4. Vedic Personality Inventory — VPI-56

56 intended items (item VPI35 is currently missing from the source file — `TODO: get item text from S-VYASA source`). All items use a 7-point Likert scale.

**Likert scale:**

1. Very Strongly Disagree
2. Strongly Disagree
3. Somewhat Disagree
4. Neutral
5. Somewhat Agree
6. Strongly Agree
7. Very Strongly Agree

Guna mapping (Sattva / Rajas / Tamas) and scoring rubric live in a separate scoring module — not yet implemented; awaiting the official S-VYASA / Wolf 1999 key.

| ID | Statement |
|---|---|
| VPI1 | I am straightforward in my dealings with other people. |
| VPI2 | I have very little interest in spiritual understanding. |
| VPI3 | I am satisfied with my life. |
| VPI4 | Fruits and vegetables are among my favorite foods. |
| VPI5 | All living entities are essentially spiritual. |
| VPI6 | In conducting my activities, I do not consider traditional wisdom. |
| VPI7 | I often act without considering the future consequences of my actions. |
| VPI8 | I usually feel discontented with life. |
| VPI9 | I become happy when I think about the material assets that I possess. |
| VPI10 | I am good at using willpower to achieve goals. |
| VPI11 | I enjoy spending time in bars (or public places of enjoyment). |
| VPI12 | Cleanliness is very important to me. |
| VPI13 | Others say that my intelligence is very sharp. |
| VPI14 | I often feel depressed. |
| VPI15 | I often put off or delay my responsibilities. |
| VPI16 | I greatly admire materially successful people. |
| VPI17 | When I speak, I really try not to irritate others. |
| VPI18 | I believe life is over when the body dies. |
| VPI19 | I often feel helpless. |
| VPI20 | I enjoy foods with strong tastes. |
| VPI21 | I am constantly dissatisfied with my position in life. |
| VPI22 | Having possessions is very important to me. |
| VPI23 | When things are tough, I often bail out (withdraw). |
| VPI24 | I often feel like a victim. |
| VPI25 | I feel that my knowledge is always increasing. |
| VPI26 | I prefer city night life to a walk in the forest. |
| VPI27 | For me, sex life is a major source of happiness. |
| VPI28 | I take guidance from higher ethical and moral laws before I act. |
| VPI29 | I enjoy intoxicating substances (including coffee, cigarettes and alcohol). |
| VPI30 | I often feel greedy. |
| VPI31 | I become greatly distressed when things don't work out for me. |
| VPI32 | I am often angry. |
| VPI33 | I often feel fearful. |
| VPI34 | I do not have doubts about my responsibilities in life. |
| VPI35 | *(missing — TODO: source from S-VYASA)* |
| VPI36 | I enjoy eating meat. |
| VPI37 | I am self-controlled. |
| VPI38 | I am very dutiful. |
| VPI39 | When I give charity, I often do it grudgingly. |
| VPI40 | Self-realization is not important for me. |
| VPI41 | I often feel dejected. |
| VPI42 | I carry out my responsibilities regardless of whether there is success or failure. |
| VPI43 | I often neglect my responsibilities to my family. |
| VPI44 | I am easily affected by the joys and sorrows of life. |
| VPI45 | I often whine. |
| VPI46 | Regardless of what I acquire or achieve, I have an uncontrollable desire to obtain more. *(inferred; TODO confirm wording)* |
| VPI47 | I am currently struggling with an addiction, physical or psychological, to some type of intoxicant (including caffeine, cigarettes and alcohol). |
| VPI48 | I often envy others. |
| VPI49 | My job is a source of anxiety. |
| VPI50 | I never think about giving up my wealth and position for a simpler life. |
| VPI51 | It often happens that those things that brought me happiness later become the source of my suffering. |
| VPI52 | I often feel mentally unbalanced. |
| VPI53 | I don't have much will power. |
| VPI54 | I often neglect my responsibilities to my friends. |
| VPI55 | I often act violently towards others. |
| VPI56 | I am good at controlling my senses and emotions. |

---

## Outstanding TODOs

- **VPI35** — missing item text; needs sourcing from S-VYASA / Wolf 1999 original instrument.
- **VPI46** — wording inferred from truncated source; confirm against original.
- **VPI guna scoring** — Sattva/Rajas/Tamas mapping not yet implemented.
- **GHQ scoring** — 0-3 raw responses stored; aggregate scoring rubric not yet implemented.
- **Path discovery scoring** is implemented in `src/lib/pathScoring.ts` and currently weights only Q1-Q3 (Q4 stored separately for the stuck flow).
