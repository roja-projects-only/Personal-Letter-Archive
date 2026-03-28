import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import GhostButton from '../components/ui/GhostButton'
import PrimaryButton from '../components/ui/PrimaryButton'
import FloralDivider from '../components/ui/FloralDivider'
import Editor from '../components/Editor'
import { createLetter } from '../api/letters'
import { useToast } from '../hooks/useToast'

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
  const toast = useToast()
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
    } catch (err) {
      const msg = err.userMessage || 'Could not save. Try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const saveLabel =
    saveState === 'saving'
      ? '~ saving…'
      : saveState === 'unsaved'
        ? '~ unsaved changes'
        : '~ saved'

  return (
    <PageShell maxWidthClassName="max-w-2xl">
      <div className="animate-fade-up">
        {/* Nav bar */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link to="/write/dashboard">
            <GhostButton type="button">← dashboard</GhostButton>
          </Link>
          <p className="order-3 w-full text-center font-serif text-[12px] italic text-gold sm:order-none sm:w-auto">
            {saveLabel}
          </p>
          <PrimaryButton type="button" onClick={handleSave}>
            save letter
          </PrimaryButton>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="a title, if you'd like…"
          className="mb-3 w-full border-0 bg-transparent font-display text-[28px] font-semibold italic text-ink outline-none placeholder:text-ink-muted"
        />
        <FloralDivider ornament="❧" className="mb-5" />

        {/* Editor */}
        <div className="paper-card paper-texture rounded-2xl p-5 sm:p-7">
          <Editor content={content} onChange={setContent} placeholder="begin here…" />
        </div>

        {error && <p className="mt-3 font-serif text-sm italic text-rose-deep">{error}</p>}
      </div>
    </PageShell>
  )
}
