import { createHash } from 'crypto';
import { mkdir, writeFile, access } from 'fs/promises';
import path from 'path';

const MEDIA_DIR = path.join(process.cwd(), 'public', 'notion-media');

/**
 * Notion-hosted file URLs are signed and expire within ~1h, which breaks a
 * statically-exported site (the URL is baked into HTML at build time). We
 * download those to /public/notion-media at build time and return a stable
 * local path. External URLs (Unsplash, etc.) don't expire and are returned
 * unchanged.
 */
export async function localizeImage(
  url: string | undefined,
): Promise<string | undefined> {
  if (!url) return url;
  if (!/amazonaws\.com|notion\.so/.test(url)) return url; // external — leave as-is

  try {
    const cleanPath = url.split('?')[0];
    const ext = (
      cleanPath.match(/\.(png|jpe?g|gif|webp|svg|avif)$/i)?.[1] || 'jpg'
    ).toLowerCase();
    const hash = createHash('sha1').update(cleanPath).digest('hex').slice(0, 16);
    const file = `${hash}.${ext}`;
    const dest = path.join(MEDIA_DIR, file);
    const publicPath = `/notion-media/${file}`;

    // Skip the download if we already have it (this build or a previous one).
    try {
      await access(dest);
      return publicPath;
    } catch {}

    const res = await fetch(url);
    if (!res.ok) return url;
    await mkdir(MEDIA_DIR, { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return publicPath;
  } catch {
    return url; // on any failure, fall back to the original URL
  }
}
