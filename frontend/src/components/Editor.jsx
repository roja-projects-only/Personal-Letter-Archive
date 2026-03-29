import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

/** Single toolbar action — themed to the archive's parchment language. */
function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 min-w-[2rem] items-center justify-center rounded px-2 font-sans text-xs tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-1 focus-visible:ring-offset-parchment active:scale-95 ${
        active
          ? 'bg-rose text-white shadow-sm'
          : 'text-ink-muted hover:bg-rose-light hover:text-rose-deep'
      }`}
    >
      {children}
    </button>
  )
}

/** Thin separator between toolbar groups. */
function ToolbarDivider() {
  return <span className="mx-0.5 h-5 w-px self-center bg-gold-soft/60" aria-hidden="true" />
}

export default function Editor({
  content = '',
  placeholder = 'begin here...',
  onChange,
  className = '',
  editable = true,
}) {
  const [, setVersion] = useState(0)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'letter-content',
      },
    },
  })

  useEffect(() => {
    if (!editor) return undefined
    const bump = () => setVersion((v) => v + 1)
    editor.on('transaction', bump)
    editor.on('focus', bump)
    editor.on('blur', bump)
    return () => {
      editor.off('transaction', bump)
      editor.off('focus', bump)
      editor.off('blur', bump)
    }
  }, [editor])

  useEffect(() => {
    if (!editor || content === undefined) return
    const current = editor.getHTML()
    if (current === content) return
    editor.commands.setContent(content || '<p></p>', { emitUpdate: false })
  }, [content, editor])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(editable)
  }, [editable, editor])

  if (!editor) {
    return <div className={`min-h-[320px] rounded-xl bg-card/50 ${className}`} />
  }

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {/* Toolbar — always shown when editable; no focus-driven layout jump */}
      {editable && (
        <div className="mb-3 flex flex-wrap items-center gap-0.5 rounded-lg border border-gold-soft/70 bg-parchment/60 px-2 py-1.5">
          {/* Text style group */}
          <ToolbarButton
            title="Bold"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Structure group */}
          <ToolbarButton
            title="Heading"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <span className="uppercase tracking-widest">H</span>
          </ToolbarButton>
          <ToolbarButton
            title="Block quote"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <span className="font-serif text-sm leading-none">"</span>
          </ToolbarButton>

          <ToolbarDivider />

          {/* List group */}
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="1.5" cy="3.5" r="1.2" fill="currentColor" />
              <rect x="4" y="2.75" width="9" height="1.5" rx="0.75" fill="currentColor" />
              <circle cx="1.5" cy="7" r="1.2" fill="currentColor" />
              <rect x="4" y="6.25" width="9" height="1.5" rx="0.75" fill="currentColor" />
              <circle cx="1.5" cy="10.5" r="1.2" fill="currentColor" />
              <rect x="4" y="9.75" width="9" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <text x="0" y="4.5" fontSize="4" fontFamily="serif" fill="currentColor">1.</text>
              <rect x="4" y="2.75" width="9" height="1.5" rx="0.75" fill="currentColor" />
              <text x="0" y="8" fontSize="4" fontFamily="serif" fill="currentColor">2.</text>
              <rect x="4" y="6.25" width="9" height="1.5" rx="0.75" fill="currentColor" />
              <text x="0" y="11.5" fontSize="4" fontFamily="serif" fill="currentColor">3.</text>
              <rect x="4" y="9.75" width="9" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Horizontal rule */}
          <ToolbarButton
            title="Horizontal rule"
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <span className="text-[10px] uppercase tracking-widest">—</span>
          </ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
