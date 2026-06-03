"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  children: string;
  className?: string;
}

/**
 * Affiche du texte pouvant contenir des formules mathématiques inline $...$.
 * Utilise KaTeX pour un rendu propre des symboles (\times, \frac, etc.).
 */
export default function MathText({ children, className }: MathTextProps) {
  return (
    <span className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <span>{children}</span>,
        }}
      >
        {children}
      </ReactMarkdown>
    </span>
  );
}
