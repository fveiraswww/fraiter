/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unstable-nested-components */
'use client';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown, { Options } from 'react-markdown';
import React, { FC, memo, ReactNode } from 'react';
import '../../app/globals.css';

type ReactMarkdownProps = {
  node: any;
  inline?: boolean;
  className?: string;
  children: ReactNode[];
};

// Memoized component for rendering Markdown content.
export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

export function Markdown({ content }: { content: string }) {
  return (
    <div className="Markdown">
      <MemoizedReactMarkdown
        className="prose flex flex-col break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        components={{
          p({ children }) {
            return <p className="!text-grey-lab">{children}</p>;
          },
          h2: ({ node, children }) => <h2 className="!text-xl">{children}</h2>,
          pre: ({ node, children }) => <pre>{children}</pre>,
          blockquote: ({ node, children }) => (
            <blockquote>{children}</blockquote>
          ),
          ul: ({ node, children }) => <ul>{children}</ul>,
          li: ({ node, children }) => <li>{children}</li>,
          ol: ({ node, children }) => (
            <ol className="list-decimal">{children}</ol>
          ),
          // @ts-expect-error: idk
          code({
            node,
            inline,
            className,
            children,
            ...props
          }: ReactMarkdownProps & { inline?: boolean }) {
            if (children?.length && children[0] === '▍') {
              return (
                <span className="mt-1 animate-pulse cursor-default">▍</span>
              );
            }

            // children[0] = (children[0] as string).replace("`▍`", "▍");

            const match = /language-(\w+)/.exec(className || '');

            return inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm, remarkMath]}
      >
        {content}
      </MemoizedReactMarkdown>
    </div>
  );
}
