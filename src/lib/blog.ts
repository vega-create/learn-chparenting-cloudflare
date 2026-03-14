import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

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
    .use(html, { sanitize: false })
    .process(post.content);
  let htmlStr = processed.toString();

  htmlStr = addHeadingIds(htmlStr);

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
