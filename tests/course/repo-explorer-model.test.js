const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const EXPLORER_FILE = path.resolve(__dirname, '../../apps/course-site/content/repo-explorer.json');

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

test('repo explorer content includes .agents, .codex, and root groups', async () => {
  const explorer = await loadJson(EXPLORER_FILE);
  const groupIds = explorer.groups.map((group) => group.id);

  assert.deepEqual(groupIds, ['agents', 'codex', 'root']);
});

test('repo explorer items include required explanatory fields', async () => {
  const explorer = await loadJson(EXPLORER_FILE);

  for (const group of explorer.groups) {
    assert.ok(Array.isArray(group.items));
    assert.ok(group.items.length >= 1);

    for (const item of group.items) {
      assert.equal(typeof item.label, 'string');
      assert.equal(typeof item.path, 'string');
      assert.equal(typeof item.whatItIs, 'string');
      assert.equal(typeof item.whenToRead, 'string');
      assert.equal(typeof item.whyItMatters, 'string');
      assert.ok(Array.isArray(item.commonMistakes));
      assert.ok(item.commonMistakes.length >= 1);
    }
  }
});
