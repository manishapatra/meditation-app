import { useAuth } from '../contexts/AuthContext'
import { PATH_DESCRIPTIONS } from '../lib/pathScoring'

function dayN(startedAt: string): number {
  const start = new Date(startedAt)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays + 1)
}

function timeOfDayGreeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Welcome to the quiet space of this late hour.'
  if (h < 12) return 'Welcome to the quiet space of your morning.'
  if (h < 17) return 'Welcome to the quiet space of your afternoon.'
  if (h < 22) return 'Welcome to the quiet space of your evening.'
  return 'Welcome to the quiet space of this late hour.'
}

export function Today() {
  const { profile } = useAuth()

  if (!profile) {
    return (
      <div className="mx-auto max-w-screen-sm p-6">
        <p className="text-muted">Loading your path…</p>
      </div>
    )
  }

  const day = profile.started_at ? dayN(profile.started_at) : 1
  const pathInfo = profile.dominant_path
    ? PATH_DESCRIPTIONS[profile.dominant_path]
    : null

  return (
    <div className="mx-auto max-w-screen-sm p-6">
      <p className="text-xs uppercase tracking-widest text-muted">
        Day {day} of your journey
      </p>
      <p className="mt-3 font-serif text-2xl text-ink leading-snug">
        {timeOfDayGreeting()}
      </p>

      {pathInfo && (
        <div className="mt-6 rounded-2xl bg-sage-light/40 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted">
            Your path
          </p>
          <p className="mt-1 font-serif text-lg text-primary">
            {pathInfo.title} · {pathInfo.subtitle}
          </p>
        </div>
      )}

      <h2 className="mt-10 font-serif text-xl text-primary">
        Today&rsquo;s practice
      </h2>
      <div className="mt-4 space-y-3">
        <PracticeCardStub
          kind="Breathwork"
          title="Nadi Shodhana"
          meta="8 min · Energizing"
        />
        <PracticeCardStub
          kind="Meditation"
          title="Inner Sanctuary"
          meta={`${profile.preferred_length_min} min · Guided`}
        />
        <PracticeCardStub
          kind="Reading"
          title="The Art of Noticing Small Things"
          meta="5 min read"
        />
      </div>

      <div className="mt-10 rounded-2xl border border-stone-200 bg-cream-dim/60 p-5">
        <p className="text-xs uppercase tracking-widest text-muted">
          Your practice is taking root
        </p>
        <p className="mt-2 text-sm text-ink">
          Practices and journal entries from your daily loop will appear here.
          Real content arrives in the next build.
        </p>
      </div>
    </div>
  )
}

function PracticeCardStub({
  kind,
  title,
  meta,
}: {
  kind: string
  title: string
  meta: string
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wider text-muted">{kind}</p>
      <p className="mt-1 font-serif text-lg text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{meta}</p>
    </div>
  )
}
