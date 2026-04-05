const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const MODULES_FILE = path.resolve(__dirname, '../../apps/course-site/content/modules.json');
const LESSONS_FILE = path.resolve(__dirname, '../../apps/course-site/content/lessons.json');

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

test('each module has one lesson entry', async () => {
  const modules = await loadJson(MODULES_FILE);
  const lessons = await loadJson(LESSONS_FILE);

  const moduleIds = new Set(modules.map((module) => module.id));
  const lessonIds = new Set(lessons.map((lesson) => lesson.moduleId));

  assert.deepEqual([...lessonIds].sort(), [...moduleIds].sort());
  assert.equal(
    lessons.length,
    modules.length,
    'lessons list should have exactly one entry per module id',
  );
});

test('each lesson includes a quiz with at least one question', async () => {
  const lessons = await loadJson(LESSONS_FILE);

  for (const lesson of lessons) {
    assert.equal(typeof lesson.quiz, 'object');
    assert.ok(Array.isArray(lesson.quiz.questions));
    assert.ok(lesson.quiz.questions.length >= 1);

    for (const question of lesson.quiz.questions) {
      assert.equal(typeof question.prompt, 'string');
      assert.ok(Array.isArray(question.options));
      assert.ok(question.options.length >= 2);
      assert.equal(typeof question.correctIndex, 'number');
      assert.ok(question.correctIndex >= 0);
      assert.ok(question.correctIndex < question.options.length);
      assert.equal(typeof question.explanation, 'string');
      assert.ok(question.explanation.length > 10);
    }
  }
});

test('lesson m0 includes at least two diagrams', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const m0 = lessons.find((lesson) => lesson.moduleId === 'm0');

  assert.ok(m0, 'm0 lesson should exist');

  const diagrams = m0.sections.filter((section) => typeof section.diagram === 'string');
  assert.ok(diagrams.length >= 2);
});

test('lesson m1 includes at least two diagrams and four sections', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const m1 = lessons.find((lesson) => lesson.moduleId === 'm1');

  assert.ok(m1, 'm1 lesson should exist');
  assert.ok(m1.sections.length >= 4);

  const diagrams = m1.sections.filter((section) => typeof section.diagram === 'string');
  assert.ok(diagrams.length >= 2);
});

test('lesson m2 includes simulator with at least five steps', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const m2 = lessons.find((lesson) => lesson.moduleId === 'm2');

  assert.ok(m2, 'm2 lesson should exist');

  const simulatorSection = m2.sections.find((section) => typeof section.simulator === 'object');
  assert.ok(simulatorSection, 'm2 should include one simulator section');

  const steps = simulatorSection.simulator.steps;
  assert.ok(Array.isArray(steps));
  assert.ok(steps.length >= 5);

  for (const step of steps) {
    assert.equal(typeof step.actor, 'string');
    assert.equal(typeof step.action, 'string');
    assert.equal(typeof step.output, 'string');
  }
});

test('lesson m3 covers skills 00, 10, and 20 in section headings', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const m3 = lessons.find((lesson) => lesson.moduleId === 'm3');

  assert.ok(m3, 'm3 lesson should exist');

  const headings = m3.sections.map((section) => section.heading).join(' | ');
  assert.match(headings, /00/);
  assert.match(headings, /10/);
  assert.match(headings, /20/);
});

test('lesson m4 covers skills 30 and 40 in section headings', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const m4 = lessons.find((lesson) => lesson.moduleId === 'm4');

  assert.ok(m4, 'm4 lesson should exist');

  const headings = m4.sections.map((section) => section.heading).join(' | ');
  assert.match(headings, /30/);
  assert.match(headings, /40/);
});

test('lesson m5 explains markdown governance and chat interaction', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const m5 = lessons.find((lesson) => lesson.moduleId === 'm5');

  assert.ok(m5, 'm5 lesson should exist');
  assert.ok(m5.sections.length >= 4);

  const content = [m5.title, m5.objective, ...m5.sections.map((section) => section.heading)].join(' | ');
  assert.match(content.toLowerCase(), /\.md|markdown/);
  assert.match(content.toLowerCase(), /chat|agente/);
});

test('lessons m6, m7, and m8 explain .agents, .codex, and root markdown governance', async () => {
  const lessons = await loadJson(LESSONS_FILE);

  const m6 = lessons.find((lesson) => lesson.moduleId === 'm6');
  const m7 = lessons.find((lesson) => lesson.moduleId === 'm7');
  const m8 = lessons.find((lesson) => lesson.moduleId === 'm8');

  assert.ok(m6, 'm6 lesson should exist');
  assert.ok(m7, 'm7 lesson should exist');
  assert.ok(m8, 'm8 lesson should exist');

  const m6Text = [m6.title, m6.objective, ...m6.sections.map((section) => section.heading)].join(' ').toLowerCase();
  const m7Text = [m7.title, m7.objective, ...m7.sections.map((section) => section.heading)].join(' ').toLowerCase();
  const m8Text = [m8.title, m8.objective, ...m8.sections.map((section) => section.heading)].join(' ').toLowerCase();

  assert.match(m6Text, /\.agents|agents/);
  assert.match(m7Text, /\.codex|codex/);
  assert.match(m8Text, /markdown|governance|gobernanza/);
});

test('negative case: invalid module id has no lesson match', async () => {
  const lessons = await loadJson(LESSONS_FILE);
  const lesson = lessons.find((entry) => entry.moduleId === 'm999');

  assert.equal(lesson, undefined);
});
