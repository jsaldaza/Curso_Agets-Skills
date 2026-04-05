const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const HTML_FILE = path.resolve(__dirname, '../../apps/course-site/public/repo-explorer.html');
const JS_FILE = path.resolve(__dirname, '../../apps/course-site/public/repo-explorer.js');

async function loadText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

test('repo explorer page includes tree and detail shells', async () => {
  const html = await loadText(HTML_FILE);

  assert.match(html, /id="repo-tree"/);
  assert.match(html, /id="repo-detail"/);
  assert.match(html, /language-switch/);
});

test('repo explorer script loads content and renders tree details', async () => {
  const script = await loadText(JS_FILE);

  assert.match(script, /loadExplorer/);
  assert.match(script, /renderTree/);
  assert.match(script, /renderDetail/);
});
