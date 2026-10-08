import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode, command }) => {
  const { SITE_URL } = loadEnv(mode, process.cwd(), 'SITE_URL');
  let siteUrl;
  if (SITE_URL) {
    try {
      siteUrl = new URL(SITE_URL);
    } catch (error) {
      throw new Error('SITE_URL must be an absolute HTTP or HTTPS website URL.', { cause: error });
    }
    if (!['http:', 'https:'].includes(siteUrl.protocol) || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash) {
      throw new Error('SITE_URL must be an HTTP or HTTPS website URL without credentials, query parameters, or a fragment.');
    }
    if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';
  } else if (command === 'build') {
    console.warn('SITE_URL is not set. Social image URLs are relative; set SITE_URL to your public website URL for reliable sharing previews.');
  }

  const imageUrl = siteUrl ? new URL('social-card.png', siteUrl).href : '/social-card.png';
  return {
    base: siteUrl?.pathname ?? '/',
    plugins: [{
      name: 'social-card-metadata',
      transformIndexHtml() {
        const tags = [
          { tag: 'meta', attrs: { property: 'og:image', content: imageUrl }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: imageUrl }, injectTo: 'head' },
        ];
        if (siteUrl) {
          tags.push(
            { tag: 'meta', attrs: { property: 'og:url', content: siteUrl.href }, injectTo: 'head' },
            { tag: 'link', attrs: { rel: 'canonical', href: siteUrl.href }, injectTo: 'head' },
          );
        }
        return tags;
      },
    }],
  };
});
