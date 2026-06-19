'use client';

import React from 'react';
import Image from 'next/image';
import type { BlockNode, RichSpan } from '@/lib/types';

function Rich({ spans }: { spans?: RichSpan[] }) {
  if (!spans || spans.length === 0) return null;
  return (
    <>
      {spans.map((s, i) => {
        let el: React.ReactNode = s.text;
        if (s.code)
          el = (
            <code
              className="rounded px-1.5 py-0.5 font-mono text-[0.86em]"
              style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}
            >
              {el}
            </code>
          );
        if (s.bold) el = <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{el}</strong>;
        if (s.italic) el = <em>{el}</em>;
        if (s.underline) el = <u>{el}</u>;
        if (s.strike) el = <s>{el}</s>;
        if (s.href)
          el = (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              {el}
            </a>
          );
        return <React.Fragment key={i}>{el}</React.Fragment>;
      })}
    </>
  );
}

function hasText(spans?: RichSpan[]) {
  return !!spans && spans.some((s) => s.text.trim().length > 0);
}

function Block({ node }: { node: BlockNode }) {
  const kids = node.children && node.children.length > 0 ? <Nodes nodes={node.children} /> : null;

  switch (node.type) {
    case 'heading_1':
      return (
        <h2 className="mb-3 mt-10 font-serif text-[30px] font-medium leading-tight" style={{ color: 'var(--fg)' }}>
          <Rich spans={node.rich} />
        </h2>
      );
    case 'heading_2':
      return (
        <h3 className="mb-3 mt-9 font-serif text-[24px] font-medium leading-tight" style={{ color: 'var(--fg)' }}>
          <Rich spans={node.rich} />
        </h3>
      );
    case 'heading_3':
      return (
        <h4 className="mb-2 mt-7 font-serif text-[19px] font-medium" style={{ color: 'var(--fg)' }}>
          <Rich spans={node.rich} />
        </h4>
      );
    case 'paragraph':
      if (!hasText(node.rich) && !kids) return <div className="h-3" />;
      return (
        <p className="my-3.5 font-sans text-[15.5px] leading-[1.75]" style={{ color: 'var(--fg2)' }}>
          <Rich spans={node.rich} />
          {kids}
        </p>
      );
    case 'quote':
      return (
        <blockquote
          className="my-5 pl-5 font-serif text-[18px] italic leading-[1.6]"
          style={{ borderLeft: '3px solid var(--gold)', color: 'var(--fg)' }}
        >
          <Rich spans={node.rich} />
          {kids}
        </blockquote>
      );
    case 'callout':
      return (
        <div className="my-5 flex gap-3 rounded-xl p-4" style={{ background: 'var(--gold-soft)', border: '1px solid var(--line)' }}>
          {node.icon && <div className="text-[20px] leading-none">{node.icon}</div>}
          <div className="font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--fg)' }}>
            <Rich spans={node.rich} />
            {kids}
          </div>
        </div>
      );
    case 'divider':
      return <hr className="my-8" style={{ border: 0, borderTop: '1px solid var(--line2)' }} />;
    case 'image':
      return (
        <figure className="my-6">
          {node.imageUrl && (
            <Image
              src={node.imageUrl}
              alt={node.caption?.map((c) => c.text).join('') || ''}
              width={1280}
              height={860}
              unoptimized
              className="h-auto w-full rounded-xl"
              style={{ border: '1px solid var(--line2)' }}
            />
          )}
          {hasText(node.caption) && (
            <figcaption className="mt-2 text-center font-sans text-[13px]" style={{ color: 'var(--fg2)' }}>
              <Rich spans={node.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'code':
      return (
        <pre
          className="my-5 overflow-x-auto rounded-xl p-4 font-mono text-[13px] leading-[1.6]"
          style={{ background: 'var(--card)', border: '1px solid var(--line2)', color: 'var(--fg)' }}
        >
          <code>{node.rich?.map((s) => s.text).join('')}</code>
        </pre>
      );
    case 'to_do':
      return (
        <div className="my-1.5 flex items-start gap-2.5 font-sans text-[15.5px] leading-[1.7]" style={{ color: 'var(--fg2)' }}>
          <span
            className="mt-[3px] inline-flex h-[16px] w-[16px] flex-none items-center justify-center rounded text-[11px]"
            style={{ border: '1px solid var(--line)', background: node.checked ? 'var(--gold)' : 'transparent', color: 'var(--gold-fg)' }}
          >
            {node.checked ? '✓' : ''}
          </span>
          <span style={node.checked ? { textDecoration: 'line-through', opacity: 0.65 } : undefined}>
            <Rich spans={node.rich} />
          </span>
        </div>
      );
    case 'toggle':
      return (
        <details className="my-3 rounded-lg p-3" style={{ border: '1px solid var(--line2)' }}>
          <summary className="cursor-pointer font-sans text-[15.5px]" style={{ color: 'var(--fg)' }}>
            <Rich spans={node.rich} />
          </summary>
          <div className="mt-2">{kids}</div>
        </details>
      );
    case 'column_list':
      return (
        <div className="my-5 flex flex-col gap-6 sm:flex-row">
          {node.children?.map((c) => (
            <div key={c.id} className="flex-1">
              <Nodes nodes={c.children || []} />
            </div>
          ))}
        </div>
      );
    case 'table':
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse font-sans text-[14px]">
            <tbody>
              {node.children?.map((row, ri) => (
                <tr key={row.id}>
                  {row.cells?.map((cell, ci) => {
                    const Tag = (ri === 0 ? 'th' : 'td') as 'th' | 'td';
                    return (
                      <Tag
                        key={ci}
                        className="p-2.5 text-left align-top"
                        style={{
                          border: '1px solid var(--line2)',
                          color: ri === 0 ? 'var(--fg)' : 'var(--fg2)',
                          fontWeight: ri === 0 ? 600 : 400,
                        }}
                      >
                        <Rich spans={cell} />
                      </Tag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'bookmark':
    case 'embed':
    case 'link_preview':
    case 'video':
    case 'file':
    case 'pdf':
      if (!node.href) return null;
      return (
        <p className="my-3">
          <a
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[15px]"
            style={{ color: 'var(--gold)', textDecoration: 'underline' }}
          >
            {node.href}
          </a>
        </p>
      );
    default:
      // Unknown block type: still surface its text + children so nothing silently disappears.
      if (hasText(node.rich) || kids)
        return (
          <div className="my-3 font-sans text-[15.5px] leading-[1.7]" style={{ color: 'var(--fg2)' }}>
            <Rich spans={node.rich} />
            {kids}
          </div>
        );
      return null;
  }
}

/** Renders sibling nodes, grouping consecutive list items into <ul>/<ol>. */
function Nodes({ nodes }: { nodes: BlockNode[] }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.type === 'bulleted_list_item' || n.type === 'numbered_list_item') {
      const ordered = n.type === 'numbered_list_item';
      const group: BlockNode[] = [];
      while (i < nodes.length && nodes[i].type === n.type) {
        group.push(nodes[i]);
        i++;
      }
      const items = group.map((li) => (
        <li key={li.id} className="my-1.5 font-sans text-[15.5px] leading-[1.7]" style={{ color: 'var(--fg2)' }}>
          <Rich spans={li.rich} />
          {li.children && li.children.length > 0 && (
            <div className="mt-1">
              <Nodes nodes={li.children} />
            </div>
          )}
        </li>
      ));
      out.push(
        ordered ? (
          <ol key={group[0].id} className="my-3.5 list-decimal pl-6">
            {items}
          </ol>
        ) : (
          <ul key={group[0].id} className="my-3.5 list-disc pl-6">
            {items}
          </ul>
        ),
      );
      continue;
    }
    out.push(<Block key={n.id} node={n} />);
    i++;
  }
  return <>{out}</>;
}

export function NotionBlocks({ blocks }: { blocks: BlockNode[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="max-w-[720px]">
      <Nodes nodes={blocks} />
    </div>
  );
}
