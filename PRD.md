# Stillness — Product Requirements Document (MVP)

> Working name. May change before launch.

## 1. Vision

Stillness is a personalized spiritual-practice companion rooted in the **Himalayan Yoga tradition**. Where mainstream meditation apps serve generic "calm content" to a global average user, Stillness treats each practitioner as walking their own path — the *sadhana* is shaped by who they are, what they're working through, and the kind of practitioner they want to become. The app diagnoses, prescribes, journals, and adjusts.

## 2. Problem

Existing meditation/mindfulness apps fail serious practitioners in three structural ways:

1. **No open library of paths.** The app picks a path for the user; the user cannot choose between, say, devotional vs. analytical practice.
2. **No systematic approach to goals.** Sessions are disconnected. There is no notion of "yesterday led to today, and today leads to tomorrow."
3. **No guidance when stuck.** Apps assume linear progress. They have no answer when a practitioner says "I feel blocked."

## 3. Target user

A practitioner — beginner through intermediate — who:

- Takes daily practice seriously and wants structure, not just ambience.
- Has interest in or affinity for yogic traditions (does not need to be expert in Sanskrit).
- Wants to track inner states (physical, emotional, mental, subtle) over time.
- Is willing to spend 10–30 minutes a day on practice.

Out of scope for v1: total beginners with no curiosity about tradition; advanced renunciates already in an ashram setting.

## 4. Core hypotheses the MVP must validate

| # | Hypothesis | How we measure it |
|---|---|---|
| H1 | A dynamically personalized path (vs. static catalog) drives higher day-7 and day-30 retention. | Compare retention against industry benchmark (~25% / ~5%). |
| H2 | Users will complete a daily journal check-in if it is short and embedded in the practice loop. | % of completed practice days that include a journal entry. |
| H3 | "I feel stuck" → contextual recommendation produces engagement, not just clicks. | % of stuck-flow users who try the recommendation, then return to journal it. |
| H4 | The 4-path (Karma / Bhakti / Jnana / Raja) classification resonates — users identify with their result. | Post-assessment NPS-style: "Does your path resonate?" |

## 5. Scope — what's in the MVP

### In scope (v1)

- **Onboarding flow** including the path-discovery assessment.
- **Today screen**: prescribed daily practice (1 breathwork + 1 meditation + 1 reading), progress indicators.
- **Practice player**: timer for breathwork/meditation, mark-complete.
- **Journal screen**: post-practice check-in across body / heart / mind + freeform reflection + breath quality tag.
- **Growth screen**: streak, total minutes, pillars-of-growth summary, "I feel stuck" entry point.
- **Stuck flow**: user reports an obstacle; app returns a recommended tool from a curated mapping.
- **Local persistence** so progress, journal, and assessment results survive across sessions and days.

### Explicitly out of scope (v1)

- Backend / cloud sync / multi-device.
- Authentication (single-user, single-device).
- Push notifications.
- Audio recording / custom practice creation by user.
- Social, community, live sessions, teacher chat.
- Subscription / payments.
- Adaptive/AI-generated daily content (curated library only — see §10).

### Phased after MVP

- Phase 2: AI-powered stuck flow (free-text obstacle → LLM-mediated recommendation from library).
- Phase 3: Cloud account + cross-device sync + notifications.
- Phase 4: Content CMS so non-engineers can author practices.
- Phase 5: Community / teacher-led pathways.

## 6. User flows

### 6.1 First-time user (onboarding → first practice)

1. App launch → splash → "Welcome" screen with one-line value prop and **Begin** CTA.
2. **Path discovery assessment** — 4 questions across 4 dimensions:
   - How do you most naturally express devotion? (action / study / mantra / breath)
   - Depth of intuition (logical ↔ intuitive slider)
   - What centers you most? (multi-select)
   - What pulls you off-center? (multi-select — feeds the stuck-flow library)
3. **Result screen**: resonance bar across Karma / Bhakti / Jnana / Raja, with a brief description of each and the user's dominant path highlighted. User can confirm or retake.
4. **Practice preferences**: preferred practice length (10 / 20 / 30 min), preferred time of day (informational only in v1 — no notifications yet).
5. **Welcome to Day 1** screen → drops user into the **Today** screen with their first prescribed practice.

**Exit criteria:** assessment complete, dominant path stored locally, Day 1 practice queued.

### 6.2 Returning user — daily practice loop

1. App launch → **Today** screen.
2. Greeting: "Day N of your journey." Today's prescribed items (1 breathwork, 1 meditation, 1 reading).
3. User taps a practice → **Practice player** opens:
   - Breathwork / meditation: timer, optional audio guidance, **Complete** button at end.
   - Reading: paged text, **Mark as read** button at end.
4. On complete → automatic prompt: **"Open your journal?"** → Journal screen pre-scoped to today's session.
5. Journal: tap body / heart / mind ratings, optionally type a reflection, optionally tag breath quality, tap **Seal this moment**.
6. Returns to Today, with the completed practice marked. Streak ticks up if all required items done.

**Exit criteria:** at least one practice completed + journaled; streak and minutes updated.

### 6.3 "I feel stuck" flow

1. From **Growth** screen, user taps **I feel stuck**.
2. Prompt: "What feels heavy right now?" with quick-pick categories (Physical / Emotional / Mental / Subtle) + free-text input.
3. User selects category, optionally types detail, taps **Find a tool**.
4. App matches against curated **problem → tool** mapping (see §8.3) and returns 1–3 recommended tools (e.g., "Try Nadi Shodhana for 8 minutes — alternate nostril breathing settles agitated mind").
5. User taps a recommendation → opens **Practice player** with that tool.
6. After completion, prompt: "Did this help?" (yes / partly / no). Response is logged to refine future recommendations.

**Exit criteria:** recommendation tried OR explicitly dismissed; outcome logged.

### 6.4 Long-arc growth flow

1. From any screen → bottom nav → **Growth**.
2. Sees: current state label (e.g., "Intermediate Practitioner" — derived from streak + journal depth), growth map of past weeks, current streak, total mindful minutes.
3. **Pillars of Growth** (Awareness / Patience / Consistency) — each with a percentage and short auto-generated comment based on recent behavior.
4. **Today's wisdom** quote (rotates daily from curated set).
5. Optional: **I feel stuck** entry point.

**Exit criteria:** view-only screen; no required actions.

### 6.5 Path re-discovery (rare)

User can re-run the assessment from a settings/profile entry. Previous result is archived; current dominant path updates. Streak is not reset.

## 7. Information architecture & navigation

Bottom tab navigation with four tabs, always visible:

| Tab | Screen | Primary purpose |
|---|---|---|
| Today | `your_daily_path` | Do today's practice |
| Journal | `practice_journal` | Log inner state |
| Path | `path_discovery` | View/refine yogic path |
| Growth | `growth_guidance` | See progress; handle stuckness |

A lightweight Profile / Settings entry lives in the header of any screen (avatar tap). Contains: re-take assessment, preferred practice length, app version, license info. No account in v1.

## 8. Functional requirements

### 8.1 Path assessment

- 4 weighted questions, each contributing scores to the 4 margas.
- Result is a **resonance vector** `{karma: 0–100, bhakti: 0–100, jnana: 0–100, raja: 0–100}`.
- Dominant path = max of the vector (ties broken by `karma > bhakti > jnana > raja`, an arbitrary but stable order — to be tuned with practitioner advisor).
- Stored locally; persists across sessions.

### 8.2 Daily prescription

For MVP, the daily prescription is deterministic, not adaptive:

- Each day has a **slot for**: 1 breathwork, 1 meditation, 1 reading.
- The pool of content for each slot is filtered by the user's dominant path (e.g., a Bhakti user gets devotional readings; a Jnana user gets philosophical ones).
- Day-N selects from the filtered pool by `dayNumber % poolSize`, ensuring no repeat until the pool is exhausted.
- Practice length matches user's stated preference (10/20/30 min) — content library is tagged accordingly.

### 8.3 Problem → tool mapping (stuck flow library)

A static JSON/Markdown file shipped in the app:

```
[
  {
    "category": "mental",
    "obstacle": "racing thoughts",
    "tools": ["Nadi Shodhana 8min", "Body Scan 12min", "Reading: Vrittis"]
  },
  ...
]
```

For MVP: simple keyword + category match. The free-text input is matched against `obstacle` strings with a substring/keyword strategy; if no match, fall back to category-level default.

### 8.4 Journal data model

Each journal entry:

```
{
  date: ISO-8601,
  sessionId: uuid (links to completed practice),
  body: 1 | 2 | 3,        // sad / neutral / happy
  heart: 1 | 2 | 3,       // 3 options shown
  mind: 1 | 2 | 3,
  reflection: string,     // optional, freeform
  breath: 'deep' | 'fragmented' | 'rhythmic' | 'effortless' | null
}
```

Stored locally (SQLite via Expo, or AsyncStorage if simpler is enough for MVP).

### 8.5 Progress & streaks

- **Streak** = consecutive days with at least one completed practice + sealed journal entry.
- **Mindful minutes** = sum of completed practice durations.
- **Pillars of Growth percentages** (v1, simple heuristics):
  - Awareness = journal depth (% of days with a non-empty reflection over last 14 days).
  - Patience = streak length normalized against a 30-day cap.
  - Consistency = % of last 7 days with any completed practice.

### 8.6 Practice player

- Timer with start / pause / restart.
- Optional ambient audio per practice (pre-bundled, no streaming in v1).
- For readings: paged text with previous/next.
- **Complete** state is required to advance the day and unlock journal prompt.

### 8.7 Content library (v1)

A curated JSON manifest shipped in the app bundle. Roughly:

- ~12 breathwork practices (Nadi Shodhana, Kapalabhati, Box Breath, etc.) tagged by path + duration.
- ~12 meditations (guided text-only in v1; optional audio for 4–6 hero practices).
- ~15 short readings (300–800 words each) tagged by path.
- ~20 stuck-flow obstacle → tool mappings.

Content authoring is a separate, manual workstream — *not* part of engineering.

## 9. Non-functional requirements

- **Offline-first**: all content and user data must work without network in v1.
- **Performance**: app cold start < 2s on modern iOS device.
- **Privacy**: no analytics or third-party SDKs in v1. Journal data never leaves the device.
- **Accessibility**: minimum WCAG AA contrast, dynamic type support, VoiceOver labels on all interactive elements.
- **Stability**: zero crashes in core daily loop is the bar before TestFlight.

## 10. Tech direction (recommendation, not requirement of the PRD)

The PRD does not prescribe stack, but the user's stated goal (iOS first, Android next, eventually App Store / Play Store) plus the offline-first MVP scope strongly points to **React Native + Expo**. Single codebase, both platforms, fast iteration, easy TestFlight builds. Final stack decision is its own follow-up.

## 11. Success metrics (post-launch)

- **Day-7 retention** ≥ 35% (vs. ~25% category average).
- **Day-30 retention** ≥ 15%.
- **Daily journal completion** ≥ 60% of practice-completed days.
- **Stuck-flow recovery**: ≥ 50% of users who tap "I feel stuck" complete the recommended tool.
- **Path resonance**: ≥ 70% answer "yes" to "Does your path resonate?" after assessment.

## 12. Open questions (to resolve before build)

1. **Who authors content?** The MVP is only as good as its practice library. Is there an advisor / teacher who will write/vet the breathwork, meditations, and readings? Without this, content quality is the biggest risk.
2. **Path classification validity.** Are 4 questions enough to meaningfully assign someone to Karma / Bhakti / Jnana / Raja? Worth a brief consult with a tradition practitioner.
3. **Streak philosophy.** Streaks can drive engagement *or* drive shame and dropout. Do we soften (e.g., "Honor your quiet phases" framing) or gamify (visible counter)? Current designs lean toward soft.
4. **Marcus V. and other named voices** in the design — placeholder or real teachers?
5. **Branding / naming.** "Stillness" is the working name in the design. Is it final?
