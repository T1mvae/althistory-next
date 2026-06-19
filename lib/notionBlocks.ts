import { notion, notionRequest } from './notion';
import { localizeImage } from './notionMedia';
import type { BlockNode, RichSpan } from './types';

function mapRich(arr: any[] | undefined): RichSpan[] {
  if (!arr) return [];
  return arr.map((r) => {
    const a = r.annotations || {};
    const span: RichSpan = { text: r.plain_text ?? '' };
    if (a.bold) span.bold = true;
    if (a.italic) span.italic = true;
    if (a.strikethrough) span.strike = true;
    if (a.underline) span.underline = true;
    if (a.code) span.code = true;
    if (r.href) span.href = r.href;
    return span;
  });
}

async function listChildren(blockId: string): Promise<any[]> {
  const out: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res: any = await notionRequest(() =>
      notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      }),
    );
    out.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return out;
}

/**
 * Recursively fetch a Notion page/block subtree as plain, serialisable nodes
 * that can be passed straight into a client component and rendered faithfully.
 */
export async function fetchBlockTree(blockId: string): Promise<BlockNode[]> {
  const raw = await listChildren(blockId);
  const nodes: BlockNode[] = [];

  for (const b of raw) {
    const data: any = b[b.type] || {};
    const node: BlockNode = { id: b.id, type: b.type };
    if (Array.isArray(data.rich_text)) node.rich = mapRich(data.rich_text);

    switch (b.type) {
      case 'image':
        node.imageUrl = await localizeImage(
          data.type === 'external' ? data.external?.url : data.file?.url,
        );
        node.caption = mapRich(data.caption);
        break;
      case 'code':
        node.language = data.language || '';
        break;
      case 'to_do':
        node.checked = !!data.checked;
        break;
      case 'callout':
        node.icon = data.icon?.emoji || '';
        break;
      case 'table':
        node.tableWidth = data.table_width || 0;
        break;
      case 'table_row':
        node.cells = (data.cells || []).map((c: any) => mapRich(c));
        break;
      case 'bookmark':
      case 'embed':
      case 'link_preview':
      case 'video':
      case 'file':
      case 'pdf':
        node.href = data.url || data.external?.url || data.file?.url || '';
        if (data.caption) node.caption = mapRich(data.caption);
        break;
    }

    if (b.has_children) {
      node.children = await fetchBlockTree(b.id);
    }
    nodes.push(node);
  }

  return nodes;
}
