const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const FINAL_FILE = path.resolve(__dirname, '../../apps/course-site/content/final-assessment.json');

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

test('final assessment includes modules m3, m4, and m5', async () => {
  const assessment = await loadJson(FINAL_FILE);
  const modules = new Set(assessment.questions.map((question) => question.module));

  assert.ok(modules.has('m3'));
  assert.ok(modules.has('m4'));
  assert.ok(modules.has('m5'));
});

test('final assessment has valid score and question schema', async () => {
  const assessment = await loadJson(FINAL_FILE);

  assert.equal(typeof assessment.passScore, 'number');
  assert.ok(assessment.passScore >= 1);
  assert.ok(Array.isArray(assessment.questions));
  assert.ok(assessment.questions.length >= 8);
  assert.ok(assessment.passScore <= assessment.questions.length);

  for (const question of assessment.questions) {
    assert.equal(typeof question.prompt, 'string');
    assert.ok(Array.isArray(question.options));
    assert.ok(question.options.length >= 2);
    assert.equal(typeof question.correctIndex, 'number');
    assert.ok(question.correctIndex >= 0);
    assert.ok(question.correctIndex < question.options.length);
    assert.equal(typeof question.explanation, 'string');
    assert.ok(question.explanation.length > 10);
  }
});
