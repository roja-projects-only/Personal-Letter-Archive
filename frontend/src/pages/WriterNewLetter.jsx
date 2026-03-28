import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import GhostButton from '../components/ui/GhostButton'
import PrimaryButton from '../components/ui/PrimaryButton'
import DecorativeLine from '../components/ui/DecorativeLine'
import Editor from '../components/Editor'
import { createLetter } from '../api/letters'

const DRAFT_KEY = 'pla-draft-new'

function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return { title: '', content: '' }
    const d = JSON.parse(raw)
    return { title: d.title || '', content: d.content || '' }
  } catch {
    return { title: '', content: '' }
  }
}

export default function WriterNewLetter() {
  const navigate = useNavigate()
  const initial = readDraft()
  const [title, setTitle] = useState(initial.title)
  const [content, setContent] = useState(initial.content)
  const [savingTick, setSavingTick] = useState(false)
  const [error, setError] = useState('')
  const savedRef = useRef(initial)
  const titleRef = useRef(title)
  const contentRef = useRef(content)
  titleRef.current = title
  contentRef.current = content

  const dirty =
    title !== savedRef.current.title || content !== savedRef.current.content
  const saveState = savingTick ? 'saving' : dirty ? 'unsaved' : 'saved'

  useEffect(() => {
    const t = setInterval(() => {
      const tVal = titleRef.current
      const cVal = contentRef.current
      setSavingTick(true)
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: tVal, content: cVal }))
        savedRef.current = { title: tVal, content: cVal }
      } catch {
        /* ignore */
      } finally {
        setSavingTick(false)
      }
    }, 30000)
    return () => clearInterval(t)
  }, [])

  const handleSave = async () => {
    setError('')
    try {
      await createLetter({
        title: title.trim() || null,
        content: content || '<p></p>',
      })
      localStorage.removeItem(DRAFT_KEY)
      navigate('/write/dashboard')
    } catch {
      setError('Could not save. Try again.')
    }
  }

  const saveLabel =
    saveState === 'saving' ? 'saving…' : saveState === 'unsaved' ? 'unsaved changes' : 'saved'

  return (
    <PageShell maxWidthClassName="max-w-2xl">
      <div className="animate-fade-up">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/write/dashboard">
            <GhostButton type="button">← dashboard</GhostButton>
          </Link>
          <p className="order-3 w-full text-center font-sans text-[11px] text-ink-muted sm:order-none sm:w-auto">
            {saveLabel}
          </p>
          <PrimaryButton type="button" onClick={handleSave}>
            save letter
          </PrimaryButton>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="a title, if you'd like..."
          className="mb-2 w-full border-0 bg-transparent font-serif text-[26px] italic text-ink outline-none placeholder:text-ink-muted"
        />
        <DecorativeLine className="mb-4" />
        <Editor content={content} onChange={setContent} placeholder="begin here..." />
        {error && <p className="mt-3 font-sans text-sm text-rose-deep">{error}</p>}
      </div>
    </PageShell>
  )
}
