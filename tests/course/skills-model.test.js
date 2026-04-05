const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const SKILLS_FILE = path.resolve(__dirname, '../../apps/course-site/content/skills.json');

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

test('each skill includes detailed fields for skill lab view', async () => {
  const skills = await loadJson(SKILLS_FILE);

  assert.ok(Array.isArray(skills));
  assert.ok(skills.length >= 5);

  for (const skill of skills) {
    assert.equal(typeof skill.id, 'string');
    assert.equal(typeof skill.name, 'string');
    assert.equal(typeof skill.category, 'string');
    assert.equal(typeof skill.purpose, 'string');
    assert.equal(typeof skill.pitfall, 'string');
    assert.equal(typeof skill.whatItDoes, 'string');
    assert.equal(typeof skill.whenToUse, 'string');

    assert.ok(Array.isArray(skill.checklist));
    assert.ok(Array.isArray(skill.suggestions));
    assert.ok(Array.isArray(skill.improvements));
    assert.ok(Array.isArray(skill.projectPlayground));

    assert.ok(skill.checklist.length >= 3);
    assert.ok(skill.suggestions.length >= 2);
    assert.ok(skill.improvements.length >= 2);
    assert.ok(skill.projectPlayground.length >= 1);

    for (const item of skill.projectPlayground) {
      assert.equal(typeof item.scenario, 'string');
      assert.equal(typeof item.tweak, 'string');
      assert.equal(typeof item.expectedImpact, 'string');
    }
  }
});
