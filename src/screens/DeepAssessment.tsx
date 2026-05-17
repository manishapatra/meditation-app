import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GHQ_ITEMS, type GHQItem } from '../data/ghqQuestions'
import { VPI_ITEMS, VPI_SCALE, type VPIItem } from '../data/vpiQuestions'
import { supabase } from '../lib/supabase'

const GHQ_PER_PAGE = 6
const VPI_PER_PAGE = 8

type Section = 'ghq' | 'vpi'

interface Page {
  section: Section
  items: readonly (GHQItem | VPIItem)[]
  pageNumber: number // 1-based within section
  totalInSection: number
}

function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size) as T[])
  }
  return out
}

export function DeepAssessment() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const pages = useMemo<Page[]>(() => {
    const ghqChunks = chunk(GHQ_ITEMS, GHQ_PER_PAGE)
    const vpiChunks = chunk(VPI_ITEMS, VPI_PER_PAGE)
    return [
      ...ghqChunks.map((items, i) => ({
        section: 'ghq' as const,
        items,
        pageNumber: i + 1,
        totalInSection: ghqChunks.length,
      })),
      ...vpiChunks.map((items, i) => ({
        section: 'vpi' as const,
        items,
        pageNumber: i + 1,
        totalInSection: vpiChunks.length,
      })),
    ]
  }, [])

  const [pageIndex, setPageIndex] = useState(0)
  const [ghqResponses, setGhqResponses] = useState<Record<string, number>>({})
  const [vpiResponses, setVpiResponses] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)

  const page = pages[pageIndex]
  const responses = page.section === 'ghq' ? ghqResponses : vpiResponses
  const allAnsweredOnPage = page.items.every((item) => item.id in responses)

  const isLastPage = pageIndex === pages.length - 1

  const sectionLabel =
    page.section === 'ghq' ? 'About your wellbeing' : 'About your tendencies'

  const handleSelect = (itemId: string, value: number) => {
    if (page.section === 'ghq') {
      setGhqResponses((r) => ({ ...r, [itemId]: value }))
    } else {
      setVpiResponses((r) => ({ ...r, [itemId]: value }))
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          assessment_responses: {
            ghq: ghqResponses,
            vpi: vpiResponses,
            completed_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      navigate('/path', { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Could not save your assessment:\n\n${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-6 pb-32">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted">
          {sectionLabel} &middot; Page {page.pageNumber} of {page.totalInSection}
        </p>
        <div className="mt-3 flex gap-1">
          {pages.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= pageIndex ? 'bg-primary' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>
        {page.section === 'ghq' && page.pageNumber === 1 && (
          <p className="mt-6 text-sm text-muted">
            Reflect on the past few weeks as you answer.
          </p>
        )}
        {page.section === 'vpi' && page.pageNumber === 1 && (
          <p className="mt-6 text-sm text-muted">
            For each statement, choose the option that fits you best in general.
          </p>
        )}
      </header>

      <div className="mt-8 flex-1 space-y-6">
        {page.section === 'ghq'
          ? (page.items as readonly GHQItem[]).map((item) => (
              <GHQQuestion
                key={item.id}
                item={item}
                selected={ghqResponses[item.id]}
                onSelect={(v) => handleSelect(item.id, v)}
              />
            ))
          : (page.items as readonly VPIItem[]).map((item) => (
              <VPIQuestion
                key={item.id}
                item={item}
                selected={vpiResponses[item.id]}
                onSelect={(v) => handleSelect(item.id, v)}
              />
            ))}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
          disabled={pageIndex === 0}
          className="text-sm uppercase tracking-wider text-muted disabled:opacity-30"
        >
          ← Back
        </button>
        {!isLastPage ? (
          <button
            onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))}
            disabled={!allAnsweredOnPage}
            className="rounded-full bg-primary px-8 py-3 font-serif text-base text-white disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnsweredOnPage || submitting}
            className="rounded-full bg-primary px-8 py-3 font-serif text-base text-white disabled:opacity-40"
          >
            {submitting ? 'Saving…' : 'Complete assessment'}
          </button>
        )}
      </div>
    </div>
  )
}

function GHQQuestion({
  item,
  selected,
  onSelect,
}: {
  item: GHQItem
  selected: number | undefined
  onSelect: (v: number) => void
}) {
  return (
    <div className="border-b border-stone-200 pb-6">
      <p className="font-serif text-base leading-snug text-ink">{item.text}</p>
      <div className="mt-3 space-y-2">
        {item.scale.map((label, i) => {
          const active = selected === i
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-stone-300 bg-white text-ink'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function VPIQuestion({
  item,
  selected,
  onSelect,
}: {
  item: VPIItem
  selected: number | undefined
  onSelect: (v: number) => void
}) {
  return (
    <div className="border-b border-stone-200 pb-6">
      <p className="font-serif text-base leading-snug text-ink">{item.text}</p>
      <div className="mt-4 flex gap-1.5">
        {VPI_SCALE.map((_, i) => {
          const active = selected === i
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              aria-label={VPI_SCALE[i]}
              className={`flex h-11 flex-1 items-center justify-center rounded-full border text-sm font-medium transition ${
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-stone-300 bg-white text-muted'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>
    </div>
  )
}
