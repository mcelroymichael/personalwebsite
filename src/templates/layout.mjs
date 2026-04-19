import site from './site-config.json' with { type: 'json' };

export function baseLayout({ title, description, canonicalPath = '/', body, includeNav = true }) {
  const canonical = `${site.siteUrl}${canonicalPath}`;
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description || site.siteDescription}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#ffffff">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">MM</a>
    ${includeNav ? `<nav class="nav" aria-label="Main">
      <a href="/#work">Work</a>
      <a href="/blog/">Blog</a>
      <a href="/#about">About</a>
      <a href="mailto:${site.email}">Email</a>
      <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn" href="${site.resume}" target="_blank" rel="noopener">View Résumé (PDF)</a>
    </nav>` : ''}
  </header>

  <main>${body}</main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; ${year} ${site.siteName}</p>
      <p>
        <a href="mailto:${site.email}">Email</a> ·
        <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a> ·
        <a href="${site.resume}" target="_blank" rel="noopener">Résumé (PDF)</a> ·
        <a href="${site.github}" target="_blank" rel="noopener">GitHub</a> ·
        <a href="${site.siteUrl}/">mcelroymichael.com</a>
      </p>
    </div>
  </footer>
</body>
</html>`;
}

export { site };
