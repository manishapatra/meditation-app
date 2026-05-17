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
import type { Gender } from '../types/database'

const TOTAL_STEPS = 6

interface Demographics {
  fullName: string
  age: string // free-text in UI; parsed to int on save
  gender: Gender | null
}

export function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [demographics, setDemographics] = useState<Demographics>({
    fullName: '',
    age: '',
    gender: null,
  })

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    q1: null,
    q2: 50,
    q3: [],
    q4: [],
  })

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const ageNum = Number(demographics.age)
  const demographicsValid =
    demographics.fullName.trim().length > 0 &&
    Number.isInteger(ageNum) &&
    ageNum >= 1 &&
    ageNum <= 120 &&
    demographics.gender !== null

  const canAdvance =
    (step === 1 && demographicsValid) ||
    (step === 2 && !!answers.q1) ||
    step === 3 ||
    (step === 4 && answers.q3.length > 0) ||
    (step === 5 && answers.q4.length > 0)

  const resonance = scoreResonance(answers)
  const path = dominantPath(resonance)

  const handleConfirm = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      console.log('[onboarding] saving profile…', { path, demographics })
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: demographics.fullName.trim(),
          age: ageNum,
          gender: demographics.gender,
          path_resonance: resonance,
          dominant_path: path,
          obstacle_preferences: { categories: answers.q4 },
          started_at: now,
          updated_at: now,
        })
        .eq('id', user.id)
        .select()
      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error(
          'Update returned no rows. Row-Level Security may be blocking the write, or your profile row is missing.'
        )
      }
      console.log('[onboarding] saved, refreshing profile…')
      await refreshProfile()
      console.log('[onboarding] navigating to /today')
      navigate('/today', { replace: true })
    } catch (err) {
      console.error('[onboarding] save failed:', err)
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Could not save your path:\n\n${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-6">
      <ProgressDots current={step} total={TOTAL_STEPS} />

      <div className="mt-10 flex-1">
        {step === 1 && (
          <StepDemographics value={demographics} onChange={setDemographics} />
        )}
        {step === 2 && (
          <Step1
            value={answers.q1}
            onChange={(v) => setAnswers({ ...answers, q1: v })}
          />
        )}
        {step === 3 && (
          <Step2
            value={answers.q2}
            onChange={(v) => setAnswers({ ...answers, q2: v })}
          />
        )}
        {step === 4 && (
          <Step3
            value={answers.q3}
            onChange={(v) => setAnswers({ ...answers, q3: v })}
          />
        )}
        {step === 5 && (
          <Step4
            value={answers.q4}
            onChange={(v) => setAnswers({ ...answers, q4: v })}
          />
        )}
        {step === 6 && <Result resonance={resonance} path={path} />}
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

function StepDemographics({
  value,
  onChange,
}: {
  value: Demographics
  onChange: (v: Demographics) => void
}) {
  return (
    <div>
      <QuestionHeader
        title="A few details to begin"
        subtitle="Just to personalize your journey. You can change these later."
      />
      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Name
          </label>
          <input
            type="text"
            value={value.fullName}
            onChange={(e) => onChange({ ...value, fullName: e.target.value })}
            className="mt-2 w-full border-b border-stone-300 bg-transparent py-3 text-lg outline-none focus:border-primary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Age
          </label>
          <input
            type="number"
            min={1}
            max={120}
            inputMode="numeric"
            value={value.age}
            onChange={(e) => onChange({ ...value, age: e.target.value })}
            className="mt-2 w-full border-b border-stone-300 bg-transparent py-3 text-lg outline-none focus:border-primary"
            placeholder="—"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Gender
          </label>
          <div className="mt-3 flex gap-3">
            {(['male', 'female'] as Gender[]).map((g) => {
              const selected = value.gender === g
              return (
                <button
                  key={g}
                  onClick={() => onChange({ ...value, gender: g })}
                  className={`flex-1 rounded-full border px-6 py-3 font-serif capitalize transition ${
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-stone-300 bg-white text-ink'
                  }`}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>
      </div>
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
