const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const MODULES_ES = path.resolve(__dirname, '../../apps/course-site/content/modules.json');
const MODULES_EN = path.resolve(__dirname, '../../apps/course-site/content/modules.en.json');
const LESSONS_ES = path.resolve(__dirname, '../../apps/course-site/content/lessons.json');
const LESSONS_EN = path.resolve(__dirname, '../../apps/course-site/content/lessons.en.json');
const SKILLS_ES = path.resolve(__dirname, '../../apps/course-site/content/skills.json');
const SKILLS_EN = path.resolve(__dirname, '../../apps/course-site/content/skills.en.json');
const GLOSSARY_ES = path.resolve(__dirname, '../../apps/course-site/content/glossary.json');
const GLOSSARY_EN = path.resolve(__dirname, '../../apps/course-site/content/glossary.en.json');
const FINAL_ES = path.resolve(__dirname, '../../apps/course-site/content/final-assessment.json');
const FINAL_EN = path.resolve(__dirname, '../../apps/course-site/content/final-assessment.en.json');
const REPO_EXPLORER_ES = path.resolve(__dirname, '../../apps/course-site/content/repo-explorer.json');
const REPO_EXPLORER_EN = path.resolve(__dirname, '../../apps/course-site/content/repo-explorer.en.json');

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

test('es/en module ids are consistent', async () => {
  const es = await loadJson(MODULES_ES);
  const en = await loadJson(MODULES_EN);

  assert.deepEqual(
    es.map((item) => item.id),
    en.map((item) => item.id),
  );
});

test('es/en lesson moduleIds are consistent', async () => {
  const es = await loadJson(LESSONS_ES);
  const en = await loadJson(LESSONS_EN);

  assert.deepEqual(
    es.map((item) => item.moduleId),
    en.map((item) => item.moduleId),
  );
});

test('es/en quiz question counts per module are consistent', async () => {
  const es = await loadJson(LESSONS_ES);
  const en = await loadJson(LESSONS_EN);

  for (let index = 0; index < es.length; index += 1) {
    const esQuestions = es[index].quiz?.questions || [];
    const enQuestions = en[index].quiz?.questions || [];

    assert.equal(
      enQuestions.length,
      esQuestions.length,
      `quiz question count mismatch for module ${es[index].moduleId}`,
    );
  }
});

test('es/en skills ids and lesson links are consistent', async () => {
  const es = await loadJson(SKILLS_ES);
  const en = await loadJson(SKILLS_EN);

  assert.deepEqual(
    es.map((item) => item.id),
    en.map((item) => item.id),
  );

  assert.deepEqual(
    es.map((item) => item.lessonId),
    en.map((item) => item.lessonId),
  );

  assert.deepEqual(
    es.map((item) => item.category),
    en.map((item) => item.category),
  );

  assert.deepEqual(
    es.map((item) => item.checklist.length),
    en.map((item) => item.checklist.length),
  );

  assert.deepEqual(
    es.map((item) => item.projectPlayground.length),
    en.map((item) => item.projectPlayground.length),
  );
});

test('es/en glossary term counts are consistent', async () => {
  const es = await loadJson(GLOSSARY_ES);
  const en = await loadJson(GLOSSARY_EN);

  assert.equal(en.length, es.length);
  assert.ok(es.length >= 5);
});

test('es/en final assessment question modules are consistent', async () => {
  const es = await loadJson(FINAL_ES);
  const en = await loadJson(FINAL_EN);

  assert.equal(en.passScore, es.passScore);
  assert.equal(en.questions.length, es.questions.length);

  assert.deepEqual(
    es.questions.map((item) => item.module),
    en.questions.map((item) => item.module),
  );
});

test('es/en repository explorer groups and item counts are consistent', async () => {
  const es = await loadJson(REPO_EXPLORER_ES);
  const en = await loadJson(REPO_EXPLORER_EN);

  assert.deepEqual(
    es.groups.map((group) => group.id),
    en.groups.map((group) => group.id),
  );

  assert.deepEqual(
    es.groups.map((group) => group.items.length),
    en.groups.map((group) => group.items.length),
  );
});
