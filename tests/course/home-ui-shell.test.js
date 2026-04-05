const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const HOME_HTML = path.resolve(__dirname, '../../apps/course-site/public/index.html');
const HOME_JS = path.resolve(__dirname, '../../apps/course-site/public/app.js');

async function loadText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

test('home page no longer includes duplicate roadmap panel', async () => {
  const html = await loadText(HOME_HTML);
  assert.doesNotMatch(html, /id="home-roadmap-panel"/);
});

test('home script makes module cards clickable without explicit open link', async () => {
  const script = await loadText(HOME_JS);

  assert.match(script, /module-card-clickable/);
  assert.match(script, /window\.location\.href = lessonUrl/);
  assert.doesNotMatch(script, /home\.moduleMeta\.openLesson/);
});

test('home keeps knowledge hub before learning path with simplified resource cards', async () => {
  const html = await loadText(HOME_HTML);

  const assetsIndex = html.indexOf('id="home-assets-panel"');
  const routeIndex = html.indexOf('id="home-route-panel"');

  assert.notEqual(assetsIndex, -1);
  assert.notEqual(routeIndex, -1);
  assert.ok(assetsIndex < routeIndex);
  assert.match(html, /id="hub-progress-indicator"/);
  assert.match(html, /id="hub-progress-fill"/);
  assert.doesNotMatch(html, /id="home-badge"/);
  assert.doesNotMatch(html, /id="repo-explorer-link"/);
  assert.doesNotMatch(html, /resource-card-topline/);
  assert.match(html, /class="resource-card resource-card-accent"/);
  assert.match(html, /id="skills-link"/);
  assert.match(html, /id="glossary-link"/);
  assert.match(html, /id="md-session-link"/);
  assert.match(html, /id="final-assessment-link"/);
});

test('home includes repository architecture panel and architecture doc link', async () => {
  const html = await loadText(HOME_HTML);

  assert.match(html, /id="home-architecture-panel"/);
  assert.match(html, /id="architecture-layers"/);
  assert.match(html, /id="architecture-diagram"/);
  assert.match(html, /id="home-architecture-doc-link"/);
  assert.match(html, /href="\/repo-architecture.md"/);
});

test('home includes sticky course navigation links', async () => {
  const html = await loadText(HOME_HTML);

  assert.match(html, /class="site-nav"/);
  assert.match(html, /href="\/repo-explorer.html"/);
  assert.match(html, /href="\/skills.html"/);
  assert.match(html, /href="\/glossary.html"/);
  assert.match(html, /href="\/final-assessment.html"/);
});

test('home script renders hub progress bar and watches for dynamic progress changes', async () => {
  const script = await loadText(HOME_JS);

  assert.match(script, /getResourceProgressStats/);
  assert.match(script, /hub-progress-summary/);
  assert.match(script, /hub-progress-fill/);
  assert.match(script, /renderKnowledgeHubProgress/);
  assert.match(script, /renderKnowledgeHubStats/);
  assert.match(script, /observeProgressChanges/);
  assert.match(script, /window\.addEventListener\('focus'/);
  assert.match(script, /visibilitychange/);
});

test('home script renders architecture layer cards from i18n content', async () => {
  const script = await loadText(HOME_JS);

  assert.match(script, /home\.architectureLayers/);
  assert.match(script, /architecture-layers/);
  assert.match(script, /architecture-layer-card/);
  assert.match(script, /home\.architectureRepoDocCta/);
});
