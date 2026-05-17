import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PATH_DESCRIPTIONS } from '../lib/pathScoring'

export function Path() {
  const { profile } = useAuth()

  if (!profile) {
    return (
      <div className="mx-auto max-w-screen-sm p-6">
        <p className="text-muted">Loading your path…</p>
      </div>
    )
  }

  const dominant = profile.dominant_path
  const resonance = profile.path_resonance
  const dominantInfo = dominant ? PATH_DESCRIPTIONS[dominant] : null
  const assessmentDone = !!profile.assessment_responses?.completed_at

  return (
    <div className="mx-auto max-w-screen-sm p-6">
      <p className="text-xs uppercase tracking-widest text-muted">Your path</p>

      {dominantInfo ? (
        <>
          <h1 className="mt-2 font-serif text-4xl text-primary">
            {dominantInfo.title}
          </h1>
          <p className="mt-1 font-serif text-muted">{dominantInfo.subtitle}</p>
          <p className="mt-6 leading-relaxed text-ink">
            {dominantInfo.description}
          </p>
        </>
      ) : (
        <h1 className="mt-2 font-serif text-2xl text-primary">
          You haven&rsquo;t taken the path assessment yet.
        </h1>
      )}

      {resonance && (
        <div className="mt-10 space-y-4">
          <p className="text-xs uppercase tracking-wider text-muted">
            Resonance
          </p>
          {(['karma', 'bhakti', 'jnana', 'raja'] as const).map((p) => (
            <div key={p}>
              <div className="flex items-baseline justify-between">
                <span
                  className={`font-serif text-base ${
                    p === dominant ? 'text-primary' : 'text-ink'
                  }`}
                >
                  {PATH_DESCRIPTIONS[p].title}
                </span>
                <span className="text-xs text-muted">{resonance[p]}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className={`h-full ${p === dominant ? 'bg-primary' : 'bg-sage'}`}
                  style={{ width: `${resonance[p]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-5">
        <p className="text-xs uppercase tracking-wider text-muted">
          {assessmentDone ? 'Deep profile complete' : 'Deepen your profile'}
        </p>
        <p className="mt-2 font-serif text-lg text-ink leading-snug">
          {assessmentDone
            ? 'You can retake the deep assessment any time to refresh your profile.'
            : 'Take a deeper look at your inner state and tendencies. This unlocks more tailored daily practice.'}
        </p>
        <Link
          to="/assessment"
          className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 font-serif text-sm text-white"
        >
          {assessmentDone ? 'Retake assessment' : 'Take the assessment'}
        </Link>
      </div>
    </div>
  )
}
