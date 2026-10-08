import assert from 'node:assert/strict';
import test from 'node:test';
import configure from '../vite.config.js';

function configuration(siteUrl) {
  const previous = process.env.SITE_URL;
  process.env.SITE_URL = siteUrl;
  try {
    return configure({ mode: 'test', command: 'serve' });
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
}

test('uses a local social image without inventing a public website URL', () => {
  const config = configuration('');
  assert.equal(config.base, '/');
  const tags = config.plugins[0].transformIndexHtml();
  assert.deepEqual(tags.map(({ attrs }) => attrs.content), ['/social-card.png', '/social-card.png']);
  assert.equal(tags.some(({ attrs }) => attrs.property === 'og:url' || attrs.rel === 'canonical'), false);
});

test('adds absolute social image and canonical URLs for a public website', () => {
  const config = configuration('https://calendar.example.test');
  const tags = config.plugins[0].transformIndexHtml();
  assert.equal(config.base, '/');
  assert.equal(tags.find(({ attrs }) => attrs.property === 'og:image').attrs.content, 'https://calendar.example.test/social-card.png');
  assert.equal(tags.find(({ attrs }) => attrs.name === 'twitter:image').attrs.content, 'https://calendar.example.test/social-card.png');
  assert.equal(tags.find(({ attrs }) => attrs.property === 'og:url').attrs.content, 'https://calendar.example.test/');
  assert.equal(tags.find(({ attrs }) => attrs.rel === 'canonical').attrs.href, 'https://calendar.example.test/');
});

test('supports deployment under a subdirectory', () => {
  for (const url of ['https://calendar.example.test/journal', 'https://calendar.example.test/journal/']) {
    const config = configuration(url);
    assert.equal(config.base, '/journal/');
    const tags = config.plugins[0].transformIndexHtml();
    assert.equal(tags.find(({ attrs }) => attrs.property === 'og:image').attrs.content, 'https://calendar.example.test/journal/social-card.png');
    assert.equal(tags.find(({ attrs }) => attrs.rel === 'canonical').attrs.href, 'https://calendar.example.test/journal/');
  }
});

test('rejects malformed and unsupported website URLs explicitly', () => {
  for (const url of ['not a URL', '/journal', 'ftp://calendar.example.test', 'https://user:password@calendar.example.test', 'https://calendar.example.test/?query=1', 'https://calendar.example.test/#fragment']) {
    assert.throws(() => configuration(url), /SITE_URL must be/);
  }
});
