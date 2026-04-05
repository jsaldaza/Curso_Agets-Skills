const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const SKILLS_HTML = path.resolve(__dirname, '../../apps/course-site/public/skills.html');
const SKILLS_JS = path.resolve(__dirname, '../../apps/course-site/public/skills.js');

async function loadText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

test('skills page includes search and quick plan shell elements', async () => {
  const html = await loadText(SKILLS_HTML);

  assert.match(html, /id="skills-search"/);
  assert.match(html, /id="skills-menu"/);
  assert.match(html, /id="skill-detail"/);
});

test('skills script includes selected skill persistence and quick plan generator', async () => {
  const script = await loadText(SKILLS_JS);

  assert.match(script, /SELECTED_SKILL_STORAGE_KEY/);
  assert.match(script, /SKILL_SECTION_PROGRESS_STORAGE_KEY/);
  assert.match(script, /saveSelectedSkill/);
  assert.match(script, /toggleSectionCompleted/);
  assert.match(script, /renderSyllabusSection/);
  assert.match(script, /createQuickPlan/);
  assert.match(script, /attachSearchListener/);
});
