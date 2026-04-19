import { promises as fs } from 'node:fs';
import path from 'node:path';
import { baseLayout, site } from '../src/templates/layout.mjs';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const outDir = path.join(root, 'production');
const projectsDir = path.join(root, 'src/content/projects');
const blogDir = path.join(root, 'src/content/blog');

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  }
  return { data, content: match[2].trim() };
}

function splitCsv(value) {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function parseLinks(value) {
  if (!value) return [];
  return value
    .split(';')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [label, href, kind] = chunk.split('|').map((part) => part.trim());
      return { label, href, kind: kind || 'link' };
    });
}

function markdownToHtml(md) {
  const lines = md.split('\n');
  const html = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      html.push(`<h2>${line.slice(3)}</h2>`);
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${line.slice(2)}</li>`);
      continue;
    }

    if (line.trim() === '') {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      continue;
    }

    html.push(`<p>${line}</p>`);
  }

  if (inList) html.push('</ul>');
  return html.join('\n');
}

async function loadCollection(dir, type) {
  const entries = await fs.readdir(dir);
  const rows = [];

  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(dir, entry), 'utf8');
    const { data, content } = parseFrontmatter(raw);

    if (type === 'project') {
      rows.push({
        slug: data.slug || slugify(data.title || entry.replace('.md', '')),
        title: data.title || 'Untitled Project',
        subtitle: data.subtitle || '',
        summary: data.summary || '',
        tags: splitCsv(data.tags),
        tech: splitCsv(data.tech),
        featured: String(data.featured).toLowerCase() === 'true',
        hero: data.hero || '',
        gallery: splitCsv(data.gallery),
        links: parseLinks(data.links),
        contentHtml: markdownToHtml(content)
      });
    } else {
      rows.push({
        slug: data.slug || slugify(data.title || entry.replace('.md', '')),
        title: data.title || 'Untitled Post',
        date: data.date || '1970-01-01',
        updated: data.updated || data.date || '1970-01-01',
        tags: splitCsv(data.tags),
        excerpt: data.excerpt || '',
        draft: String(data.draft).toLowerCase() === 'true',
        contentHtml: markdownToHtml(content)
      });
    }
  }

  return rows;
}

function projectCard(project) {
  const tags = project.tags.map((t) => `<li>${t}</li>`).join('');
  return `<a class="card" href="/projects/${project.slug}/">
    <h3>${project.title}</h3>
    <p>${project.summary || project.subtitle}</p>
    <ul class="tags">${tags}</ul>
  </a>`;
}

function blogCard(post) {
  const date = new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  return `<a class="card" href="/blog/${post.slug}/">
    <h3>${post.title}</h3>
    <p>${post.excerpt || ''}</p>
    <small>${date}</small>
  </a>`;
}

async function writePage(relativePath, html) {
  const filePath = path.join(outDir, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, html, 'utf8');
}

async function run() {
  const projects = await loadCollection(projectsDir, 'project');
  const posts = (await loadCollection(blogDir, 'blog'))
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  const homeBody = `
    <section class="hero">
      <div class="container">
        <h1>Michael McElroy</h1>
        <p class="sub">Undergraduate Electrical & Computer Engineer · UT @ Austin · Class of 2029</p>
        <div class="actions">
          <a class="btn" href="${site.resume}" target="_blank" rel="noopener">View Résumé (PDF)</a>
          <a class="btn ghost" href="${site.github}" target="_blank" rel="noopener">GitHub</a>
          <a class="btn ghost" href="/projects/">Browse All Projects</a>
          <a class="btn ghost" href="/blog/">Read Blog</a>
        </div>
      </div>
    </section>

    <section id="work" class="section">
      <div class="container">
        <h2>Selected Work</h2>
        <div class="cards">${featured.map(projectCard).join('')}</div>
      </div>
    </section>

    <section id="blog" class="section alt">
      <div class="container">
        <h2>Recent Blog Posts</h2>
        <div class="cards">${recentPosts.map(blogCard).join('')}</div>
      </div>
    </section>

    <section id="about" class="section">
      <div class="container about">
        <div>
          <h2>About</h2>
          <p>I’m an undergraduate ECE major with an undeclared tech core. Electronics have been a passion of mine as long as I can remember.</p>
          <p>I like building both simple and complex projects as long as I'm always trying something new. I learn best through hands-on experience and making mistakes, and projects that combine both creativity and rigor are the ones that are most impactful.</p>
          <blockquote class="quote">“Life is either a daring adventure or nothing at all.” <span>– Helen Keller</span></blockquote>
        </div>
      </div>
    </section>
  `;

  await writePage('index.html', baseLayout({
    title: `${site.siteName} | Electrical Engineering`,
    description: site.siteDescription,
    canonicalPath: '/',
    body: homeBody
  }));

  await writePage('projects/index.html', baseLayout({
    title: `All Projects — ${site.siteName}`,
    description: 'Browse all projects by Michael McElroy.',
    canonicalPath: '/projects/',
    body: `<section class="section"><div class="container"><h1>All Projects</h1><p class="sub">Filter and browse all project entries.</p><div class="cards">${projects.map(projectCard).join('')}</div></div></section>`
  }));

  for (const project of projects) {
    const tags = project.tags.map((t) => `<span class="chip">${t}</span>`).join('');
    const links = project.links.map((l) => `<a class="btn ${l.kind === 'code' ? '' : 'ghost'}" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('');
    const tech = project.tech.map((t) => `<li>${t}</li>`).join('');
    const gallery = project.gallery.length ? `<div class="gallery">${project.gallery.map((g) => `<img src="${g}" alt="${project.title} media" />`).join('')}</div>` : '';
    const hero = project.hero ? `<img class="project-heroimg" src="${project.hero}" alt="${project.title}"/>` : '';

    await writePage(`projects/${project.slug}/index.html`, baseLayout({
      title: `${project.title} — ${site.siteName}`,
      description: project.summary || project.subtitle,
      canonicalPath: `/projects/${project.slug}/`,
      body: `<section class="section"><div class="container"><a class="backlink" href="/projects/">← Back to All Projects</a><h1>${project.title}</h1><p class="sub">${project.subtitle}</p><div>${tags}</div><div class="actions">${links}</div>${hero}<article class="panel"><p>${project.summary}</p>${project.contentHtml}<h3>Tech</h3><ul>${tech}</ul>${gallery}</article></div></section>`
    }));
  }

  await writePage('blog/index.html', baseLayout({
    title: `Blog — ${site.siteName}`,
    description: 'Engineering notes and project updates by Michael McElroy.',
    canonicalPath: '/blog/',
    body: `<section class="section"><div class="container"><h1>Blog</h1><p class="sub">Notes, updates, and project writeups.</p><div class="cards">${posts.map(blogCard).join('')}</div></div></section>`
  }));

  for (const post of posts) {
    const tags = post.tags.map((t) => `<span class="chip">${t}</span>`).join('');
    const pubDate = new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    await writePage(`blog/${post.slug}/index.html`, baseLayout({
      title: `${post.title} — ${site.siteName}`,
      description: post.excerpt,
      canonicalPath: `/blog/${post.slug}/`,
      body: `<section class="section"><div class="container"><a class="backlink" href="/blog/">← Back to Blog</a><article class="panel"><h1>${post.title}</h1><p class="sub">Published ${pubDate}</p><div>${tags}</div>${post.contentHtml}</article></div></section>`
    }));
  }

  const rssItems = posts
    .map((post) => `<item><title>${post.title}</title><link>${site.siteUrl}/blog/${post.slug}/</link><guid>${site.siteUrl}/blog/${post.slug}/</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description>${post.excerpt}</description></item>`)
    .join('');

  await writePage('rss.xml', `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>${site.siteName} Blog</title><link>${site.siteUrl}/blog/</link><description>${site.siteDescription}</description>${rssItems}</channel></rss>`);

  const urls = [
    `${site.siteUrl}/`,
    `${site.siteUrl}/projects/`,
    `${site.siteUrl}/blog/`,
    ...projects.map((p) => `${site.siteUrl}/projects/${p.slug}/`),
    ...posts.map((p) => `${site.siteUrl}/blog/${p.slug}/`)
  ];

  await writePage('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `<url><loc>${url}</loc></url>`).join('\n')}\n</urlset>`);

  console.log(`Generated ${projects.length} projects and ${posts.length} blog posts.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
