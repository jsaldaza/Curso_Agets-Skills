const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const CONTENT_FILE = path.resolve(__dirname, '../../apps/course-site/content/modules.json');

test('course modules file has at least 5 modules', async () => {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8');
  const modules = JSON.parse(raw);

  assert.ok(Array.isArray(modules));
  assert.ok(modules.length >= 5);
});

test('course modules are ordered ascending by order', async () => {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8');
  const modules = JSON.parse(raw);

  const orders = modules.map((module) => module.order);
  const sorted = [...orders].sort((a, b) => a - b);

  assert.deepEqual(orders, sorted);
});

test('course modules include required fields', async () => {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8');
  const modules = JSON.parse(raw);

  for (const module of modules) {
    assert.ok(module.id);
    assert.equal(typeof module.title, 'string');
    assert.equal(typeof module.level, 'string');
    assert.equal(typeof module.durationMinutes, 'number');
    assert.ok(module.durationMinutes > 0);
    assert.equal(typeof module.milestone, 'string');
    assert.ok(module.milestone.length > 10);
    assert.equal(typeof module.summary, 'string');
  }
});

test('course modules include repository-knowledge modules m6, m7, and m8', async () => {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8');
  const modules = JSON.parse(raw);

  const ids = modules.map((module) => module.id);
  assert.ok(ids.includes('m6'));
  assert.ok(ids.includes('m7'));
  assert.ok(ids.includes('m8'));
});
