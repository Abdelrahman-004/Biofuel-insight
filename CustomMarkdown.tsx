import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { MermaidChart } from './MermaidChart';

interface CustomMarkdownProps {
  children: string;
}

/**
 * Preprocesses raw markdown to repair escaped newlines, un-fenced mermaid diagrams,
 * and broken markdown table/header spacing emitted by LLM responses.
 */
function preprocessMarkdown(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw;

  // 1. Unescape literal string representations of newlines, carriage returns, and tabs
  text = text.replace(/\\r\\n/g, '\n');
  text = text.replace(/\\n/g, '\n');
  text = text.replace(/\\t/g, '\t');

  // 2. Normalize section header if it starts with "Executive Summary" without "#"
  text = text.replace(/^\s*#*\s*Executive Summary\b/i, '# Executive Summary\n\n');

  // 3. Ensure headers have clean linebreaks before and after
  // Matches e.g. "targets.\n# Problem Analysis" or "targets.\n\n# Problem Analysis"
  text = text.replace(/([^\n])\s*\n\s*(#+\s+[^\n]+)/g, '$1\n\n$2\n\n');

  // 4. Auto-wrap raw mermaid diagrams that lack ```mermaid code fences
  // E.g. "mermaid\nflowchart TD..." or "\nflowchart TD..."
  text = text.replace(
    /(?:^|\n)\s*(?:```(?:mermaid)?\s*\n)?(?:mermaid\s*\n)?(flowchart\s+(?:TD|TB|LR|RL|BT)[\s\S]*?)(?=(?:\n\s*#|\n\s*```|$))/gi,
    (_match, diagram) => {
      const cleanDiagram = diagram.replace(/```/g, '').trim();
      return `\n\n\`\`\`mermaid\n${cleanDiagram}\n\`\`\`\n\n`;
    }
  );

  // 5. Ensure tables have proper line breaks before and after
  text = text.replace(/([^\n])\s*\n\s*(\|.+?\|)\s*\n/g, '$1\n\n$2\n');

  return text.trim();
}

export const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ children }) => {
  const processedContent = useMemo(() => preprocessMarkdown(children), [children]);

  return (
    <div className="w-full text-[var(--text-secondary)] font-sans antialiased">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1({ children: hChildren, ...props }) {
            return (
              <div className="flex items-center gap-2.5 mt-8 mb-4 pb-2.5 border-b border-[var(--border-glow)] first:mt-1">
                <span className="w-2 h-5 rounded-full bg-[var(--accent-emerald)] shrink-0 shadow-xs" />
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]" {...props}>
                  {hChildren}
                </h2>
              </div>
            );
          },
          h2({ children: hChildren, ...props }) {
            return (
              <div className="flex items-center gap-2 mt-6 mb-3 first:mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] shrink-0" />
                <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)]" {...props}>
                  {hChildren}
                </h3>
              </div>
            );
          },
          h3({ children: hChildren, ...props }) {
            return (
              <h4 className="text-sm md:text-base font-semibold text-[var(--text-primary)] mt-4 mb-2" {...props}>
                {hChildren}
              </h4>
            );
          },
          p({ children: pChildren, ...props }) {
            return (
              <p className="text-sm md:text-[14.5px] leading-relaxed text-[var(--text-secondary)] mb-3.5 font-normal overflow-wrap-anywhere" {...props}>
                {pChildren}
              </p>
            );
          },
          ul({ children: ulChildren, ...props }) {
            return (
              <ul className="list-disc space-y-1.5 my-3 pl-5 text-sm md:text-[14.5px] text-[var(--text-secondary)] marker:text-[var(--accent-emerald)]" {...props}>
                {ulChildren}
              </ul>
            );
          },
          ol({ children: olChildren, ...props }) {
            return (
              <ol className="list-decimal space-y-1.5 my-3 pl-5 text-sm md:text-[14.5px] text-[var(--text-secondary)] marker:text-[var(--accent-emerald)] marker:font-bold" {...props}>
                {olChildren}
              </ol>
            );
          },
          li({ children: liChildren, ...props }) {
            return (
              <li className="leading-relaxed pl-1 text-[var(--text-secondary)]" {...props}>
                {liChildren}
              </li>
            );
          },
          strong({ children: strongChildren, ...props }) {
            return (
              <strong className="font-semibold text-[var(--text-primary)]" {...props}>
                {strongChildren}
              </strong>
            );
          },
          blockquote({ children: bqChildren, ...props }) {
            return (
              <blockquote className="border-l-4 border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/5 px-4 py-3 rounded-r-xl my-4 text-sm text-[var(--text-secondary)] italic leading-relaxed" {...props}>
                {bqChildren}
              </blockquote>
            );
          },
          table({ children: tChildren, ...props }) {
            return (
              <div className="my-5 w-full overflow-hidden rounded-2xl border border-[var(--border-glow)] bg-[var(--card-bg)] shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-sm border-collapse" {...props}>
                    {tChildren}
                  </table>
                </div>
              </div>
            );
          },
          thead({ children: thChildren, ...props }) {
            return (
              <thead className="bg-[var(--bg-main)] border-b border-[var(--border-glow)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]" {...props}>
                {thChildren}
              </thead>
            );
          },
          tbody({ children: tbChildren, ...props }) {
            return (
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]" {...props}>
                {tbChildren}
              </tbody>
            );
          },
          tr({ children: trChildren, ...props }) {
            return (
              <tr className="hover:bg-[var(--zebra-even)] transition-colors duration-150 odd:bg-[var(--card-bg)] even:bg-[var(--zebra-even)]" {...props}>
                {trChildren}
              </tr>
            );
          },
          th({ children: thChildren, ...props }) {
            return (
              <th className="px-4 py-3 text-start text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider whitespace-nowrap" {...props}>
                {thChildren}
              </th>
            );
          },
          td({ children: tdChildren, ...props }) {
            return (
              <td className="px-4 py-2.5 text-start text-sm text-[var(--text-secondary)] whitespace-nowrap sm:whitespace-normal" {...props}>
                {tdChildren}
              </td>
            );
          },
          hr({ ...props }) {
            return <hr className="my-6 border-t border-[var(--border-glow)]" {...props} />;
          },
          code({ node, className, children: codeChildren, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isMermaid = match && match[1] === 'mermaid';
            const value = String(codeChildren || '').replace(/\n$/, '');
            const isDiagramCode = !match && /^(?:flowchart|graph\s+(?:TD|TB|LR|RL|BT)|sequenceDiagram|classDiagram|gantt)\b/i.test(value.trim());
            
            if (isMermaid || isDiagramCode) {
              return (
                <div className="my-6">
                  <MermaidChart chart={value} />
                </div>
              );
            }
            
            const isMultiLine = value.includes('\n');
            if (isMultiLine) {
              return (
                <pre className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-glow)] overflow-x-auto text-xs font-mono text-[var(--text-secondary)] my-4 leading-relaxed">
                  <code className={className} {...props}>
                    {codeChildren}
                  </code>
                </pre>
              );
            }

            return (
              <code className="px-1.5 py-0.5 rounded-md bg-[var(--bg-main)] text-[var(--accent-emerald)] font-mono text-xs border border-[var(--border-subtle)] font-medium" {...props}>
                {codeChildren}
              </code>
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

