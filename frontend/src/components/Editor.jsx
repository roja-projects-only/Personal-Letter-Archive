import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
        active ? 'bg-blush text-rose-deep' : 'hover:bg-rose-light'
      }`}
    >
      {children}
    </button>
  )
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

  const showToolbar = editor?.isFocused

  if (!editor) {
    return <div className={`min-h-[320px] rounded-xl bg-card/50 ${className}`} />
  }

  return (
    <div className={`relative ${className}`}>
      {showToolbar && (
        <div className="mb-2 flex justify-center">
          <div className="flex flex-wrap justify-center gap-1 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm">
            <ToolbarButton
              title="Bold"
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <span className="font-sans text-sm font-semibold">B</span>
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <span className="font-sans text-sm italic">I</span>
            </ToolbarButton>
            <ToolbarButton
              title="Quote"
              active={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <span className="font-sans text-xs">“</span>
            </ToolbarButton>
            <ToolbarButton
              title="Heading"
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <span className="font-sans text-[11px] uppercase tracking-wide">H2</span>
            </ToolbarButton>
            <ToolbarButton
              title="Bullet list"
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <span className="font-sans text-lg leading-none">•</span>
            </ToolbarButton>
            <ToolbarButton
              title="Numbered list"
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <span className="font-sans text-xs">1.</span>
            </ToolbarButton>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
