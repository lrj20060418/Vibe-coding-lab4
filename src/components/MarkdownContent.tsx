import ReactMarkdown from 'react-markdown'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-body max-h-80 overflow-auto rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-1 text-lg font-bold text-slate-800">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-4 text-base font-semibold text-indigo-700">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-3 text-sm font-semibold text-slate-800">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-1 mt-2 text-sm font-medium text-slate-700">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="text-slate-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-slate-800">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="mb-2 border-l-4 border-indigo-200 pl-3 text-slate-500 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-slate-200" />,
          code: ({ children }) => (
            <code className="rounded bg-slate-200/80 px-1 py-0.5 font-mono text-xs text-indigo-800">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
