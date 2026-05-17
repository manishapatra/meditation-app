import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Auth() {
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If the user becomes signed-in while sitting on this screen (e.g. their
  // magic-link callback finished processing after the redirect), bounce away.
  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signIn(email)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl text-primary">Check your inbox</h1>
        <p className="mt-4 text-muted">
          We sent a sign-in link to{' '}
          <span className="text-ink">{email}</span>. Open it on this device to
          continue.
        </p>
        <button
          onClick={() => {
            setSent(false)
            setEmail('')
          }}
          className="mt-8 text-sm text-primary underline"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center p-6">
      <h1 className="font-serif text-4xl text-primary">Stillness</h1>
      <p className="mt-2 text-center text-muted">
        Sign in to begin your practice.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 w-full">
        <label className="block text-xs font-medium uppercase tracking-wider text-muted">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-b border-stone-300 bg-transparent py-3 text-lg outline-none focus:border-primary"
          placeholder="you@example.com"
        />
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !email}
          className="mt-8 w-full rounded-full bg-primary px-8 py-4 font-serif text-lg text-white disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send magic link'}
        </button>
      </form>
    </div>
  )
}
