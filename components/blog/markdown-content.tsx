import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-2 text-lg font-semibold tracking-tight">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 text-base leading-relaxed first:mt-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base leading-relaxed">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-base leading-relaxed">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 border-accent pl-4 text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  code: ({ children }) => (
    <code className="border border-border bg-surface px-1.5 py-0.5 font-mono text-sm text-accent">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-4 overflow-x-auto border border-border bg-surface p-4 text-sm">
      {children}
    </pre>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-accent underline-offset-2 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
