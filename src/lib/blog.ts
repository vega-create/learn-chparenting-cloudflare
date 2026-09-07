import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

// Sanitize schema: block <script>/<iframe>/event handlers (XSS) while keeping
// the raw HTML our posts legitimately use — tables, divs, inline styles.
// (rehype-raw parses raw HTML into the tree so it can be sanitized instead of
// dropped, which is what remark-html's sanitize option would do.)
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'style', 'className', 'class'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'details', 'summary'],
};

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
  author: string;
  content: string;
  htmlContent?: string;
  toc?: TocItem[];
  readingTime?: number;
  faq?: FaqItem[];
}

function estimateReadingTime(content: string): number {
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = content.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200);
  return Math.max(1, minutes);
}

function extractToc(htmlStr: string): TocItem[] {
  const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  const toc: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(htmlStr)) !== null) {
    toc.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    });
  }
  return toc;
}

function addHeadingIds(htmlStr: string): string {
  return htmlStr.replace(/<h([2-3])>(.*?)<\/h[2-3]>/gi, (_, level, text) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    const id = plainText
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-|-$/g, '');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

/**
 * 站外商業連結一律加 rel="sponsored nofollow"。
 *
 * 目前 7 篇文章共 23 個博客來聯盟連結（books.com.tw/exep/assp.php/…）沒有任何
 * rel 屬性。頁面本身有揭露文字，但 Google 的連結配置政策要求付費／聯盟連結
 * 必須以 rel 標示，否則屬於規範問題而非優化問題。在這一層處理，而不是逐篇
 * 改 markdown：新增的文章自動套用，也不怕漏。
 *
 * 只針對聯盟樣式的網址；一般外部引用（例如 LTTC 官方報名頁）維持可跟隨，
 * 那些是應該傳遞信任的來源。
 *
 * 必須在 rehype-sanitize 之後執行——sanitize 會剝掉它不認識的屬性。
 */
const SPONSORED_PATTERNS = [
  /books\.com\.tw\/exep\/assp\.php/i,   // 博客來 AP 聯盟
  /[?&](amp;)?utm_medium=ap-/i,             // 博客來 AP 的 utm 標記（HTML 實體化後為 &amp;）
];

function markSponsoredLinks(html: string): string {
  return html.replace(/<a\s+([^>]*?)href="([^"]+)"([^>]*)>/gi, (whole, pre, href, post) => {
    if (!SPONSORED_PATTERNS.some((re) => re.test(href))) return whole;
    const attrs = `${pre}href="${href}"${post}`
      .replace(/\s+rel="[^"]*"/gi, '')
      .replace(/\s+target="[^"]*"/gi, '')
      .trim();
    return `<a ${attrs} rel="sponsored nofollow" target="_blank">`;
  });
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    return getPostBySlug(slug);
  }).filter(Boolean) as BlogPost[];

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    category: data.category || '',
    tags: data.tags || [],
    image: data.image || undefined,
    author: data.author || 'Mommy Wisdom',
    content,
    readingTime: estimateReadingTime(content),
    faq: data.faq || undefined,
  };
}

export async function getPostWithHtml(slug: string): Promise<BlogPost | null> {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(post.content);
  let htmlStr = processed.toString();

  htmlStr = addHeadingIds(htmlStr);
  htmlStr = markSponsoredLinks(htmlStr);

  post.htmlContent = htmlStr;
  post.toc = extractToc(htmlStr);

  return post;
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(p => p.category === category);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map(p => p.category));
  return Array.from(categories);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}
