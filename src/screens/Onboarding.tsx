import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  PATH_DESCRIPTIONS,
  dominantPath,
  scoreResonance,
  type OnboardingAnswers,
  type Q1Answer,
  type Q3Choice,
  type Q4Choice,
} from '../lib/pathScoring'

const TOTAL_STEPS = 5

export function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    q1: null,
    q2: 50,
    q3: [],
    q4: [],
  })

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const canAdvance =
    (step === 1 && !!answers.q1) ||
    step === 2 ||
    (step === 3 && answers.q3.length > 0) ||
    (step === 4 && answers.q4.length > 0)

  const resonance = scoreResonance(answers)
  const path = dominantPath(resonance)

  const handleConfirm = async () => {
    if (!user) return
    setSubmitting(true)
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('profiles')
      .update({
        path_resonance: resonance,
        dominant_path: path,
        obstacle_preferences: { categories: answers.q4 },
        started_at: now,
        updated_at: now,
      })
      .eq('id', user.id)
    setSubmitting(false)
    if (error) {
      console.error(error)
      alert('Could not save your path. Please try again.')
      return
    }
    await refreshProfile()
    navigate('/today', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-6">
      <ProgressDots current={step} total={TOTAL_STEPS} />

      <div className="mt-10 flex-1">
        {step === 1 && (
          <Step1
            value={answers.q1}
            onChange={(v) => setAnswers({ ...answers, q1: v })}
          />
        )}
        {step === 2 && (
          <Step2
            value={answers.q2}
            onChange={(v) => setAnswers({ ...answers, q2: v })}
          />
        )}
        {step === 3 && (
          <Step3
            value={answers.q3}
            onChange={(v) => setAnswers({ ...answers, q3: v })}
          />
        )}
        {step === 4 && (
          <Step4
            value={answers.q4}
            onChange={(v) => setAnswers({ ...answers, q4: v })}
          />
        )}
        {step === 5 && <Result resonance={resonance} path={path} />}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            onClick={back}
            className="text-sm uppercase tracking-wider text-muted"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < TOTAL_STEPS && (
          <button
            onClick={next}
            disabled={!canAdvance}
            className="rounded-full bg-primary px-8 py-3 font-serif text-base text-white disabled:opacity-40"
          >
            Continue →
          </button>
        )}
        {step === TOTAL_STEPS && (
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded-full bg-primary px-8 py-3 font-serif text-base text-white disabled:opacity-40"
          >
            {submitting ? 'Saving…' : 'Begin your journey'}
          </button>
        )}
      </div>
    </div>
  )
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i + 1 === current
              ? 'w-8 bg-primary'
              : i + 1 < current
                ? 'w-1.5 bg-primary'
                : 'w-1.5 bg-stone-300'
          }`}
        />
      ))}
    </div>
  )
}

function QuestionHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl text-primary leading-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </div>
  )
}

const Q1_OPTIONS: { value: Q1Answer; label: string; hint: string }[] = [
  { value: 'action', label: 'Through action', hint: 'Service, work, doing' },
  { value: 'study', label: 'Through quiet study', hint: 'Reading, contemplation' },
  { value: 'mantra', label: 'Through chanting', hint: 'Mantra, devotion, song' },
  { value: 'breath', label: 'Through breath and stillness', hint: 'Meditation, asana' },
]

function Step1({
  value,
  onChange,
}: {
  value: Q1Answer | null
  onChange: (v: Q1Answer) => void
}) {
  return (
    <div>
      <QuestionHeader
        title="How do you most naturally express devotion?"
        subtitle="There is no right answer. Different practitioners are drawn to different expressions of yoga."
      />
      <div className="mt-8 space-y-3">
        {Q1_OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-stone-300 bg-white text-ink hover:border-stone-400'
              }`}
            >
              <div className="font-serif text-lg">{opt.label}</div>
              <div
                className={`mt-1 text-sm ${selected ? 'text-white/70' : 'text-muted'}`}
              >
                {opt.hint}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step2({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <QuestionHeader
        title="How do you find clarity?"
        subtitle="Some find it through reasoning. Others through felt sense. Most live somewhere between."
      />
      <div className="mt-10">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="mt-3 flex justify-between text-xs uppercase tracking-wider text-muted">
          <span>Logical</span>
          <span>Intuitive</span>
        </div>
      </div>
    </div>
  )
}

const Q3_OPTIONS: { value: Q3Choice; label: string }[] = [
  { value: 'serving', label: 'Serving others' },
  { value: 'study', label: 'In quiet study' },
  { value: 'mantras', label: 'Chanting mantras' },
  { value: 'breath', label: 'Observing breath' },
]

function Step3({
  value,
  onChange,
}: {
  value: Q3Choice[]
  onChange: (v: Q3Choice[]) => void
}) {
  const toggle = (v: Q3Choice) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <div>
      <QuestionHeader
        title="I feel most centered when I am…"
        subtitle="Choose all that resonate."
      />
      <div className="mt-8 space-y-3">
        {Q3_OPTIONS.map((opt) => {
          const selected = value.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`w-full rounded-full border px-6 py-4 text-left font-serif text-lg transition ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-stone-300 bg-white text-ink hover:border-stone-400'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Q4_OPTIONS: { value: Q4Choice; label: string; hint: string }[] = [
  { value: 'physical', label: 'Physical', hint: 'Tension, fatigue, restlessness in the body' },
  { value: 'emotional', label: 'Emotional', hint: 'Turbulence, grief, fear, agitation' },
  { value: 'mental', label: 'Mental', hint: 'Racing thoughts, doubt, distraction' },
  { value: 'subtle', label: 'Subtle', hint: 'A vague disconnection, dullness, drift' },
]

function Step4({
  value,
  onChange,
}: {
  value: Q4Choice[]
  onChange: (v: Q4Choice[]) => void
}) {
  const toggle = (v: Q4Choice) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <div>
      <QuestionHeader
        title="What tends to pull you off-center?"
        subtitle="Choose all that apply. We'll tailor support around these later."
      />
      <div className="mt-8 space-y-3">
        {Q4_OPTIONS.map((opt) => {
          const selected = value.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-stone-300 bg-white text-ink hover:border-stone-400'
              }`}
            >
              <div className="font-serif text-lg">{opt.label}</div>
              <div
                className={`mt-1 text-sm ${selected ? 'text-white/70' : 'text-muted'}`}
              >
                {opt.hint}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Result({
  resonance,
  path,
}: {
  resonance: ReturnType<typeof scoreResonance>
  path: ReturnType<typeof dominantPath>
}) {
  const info = PATH_DESCRIPTIONS[path]
  return (
    <div>
      <p className="text-center text-xs uppercase tracking-widest text-muted">
        Your Resonance
      </p>
      <h1 className="mt-2 text-center font-serif text-4xl text-primary">
        {info.title}
      </h1>
      <p className="mt-1 text-center font-serif text-muted">{info.subtitle}</p>
      <p className="mt-6 leading-relaxed text-ink">{info.description}</p>

      <div className="mt-10 space-y-4">
        {(['karma', 'bhakti', 'jnana', 'raja'] as const).map((p) => (
          <div key={p}>
            <div className="flex items-baseline justify-between">
              <span
                className={`font-serif text-base ${p === path ? 'text-primary' : 'text-ink'}`}
              >
                {PATH_DESCRIPTIONS[p].title}
              </span>
              <span className="text-xs text-muted">{resonance[p]}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className={`h-full ${p === path ? 'bg-primary' : 'bg-sage'}`}
                style={{ width: `${resonance[p]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
