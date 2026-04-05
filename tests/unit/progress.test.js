const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PROGRESS_FILE = path.resolve(__dirname, '../../apps/course-site/public/progress.js');

function createLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    dump() {
      return Object.fromEntries(store.entries());
    },
  };
}

function loadProgressModule(localStorage) {
  const source = fs.readFileSync(PROGRESS_FILE, 'utf8');
  const transformed = source
    .replace(/export function /g, 'function ')
    .replace(
      /export \{ RESOURCE_STATUS \};/,
      'module.exports = { loadProgress, saveProgress, isCompleted, markCompleted, isQuizPassed, markQuizPassed, getResourceStatus, markResourceInProgress, markResourceCompleted, getProgressStats, getResourceProgressStats, RESOURCE_STATUS };',
    );

  const context = {
    module: { exports: {} },
    exports: {},
    localStorage,
    console,
  };

  vm.runInNewContext(transformed, context, { filename: PROGRESS_FILE });
  return context.module.exports;
}

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('loadProgress returns default shape when storage is empty', () => {
  const localStorage = createLocalStorage();
  const { loadProgress } = loadProgressModule(localStorage);

  assert.deepEqual(toPlain(loadProgress()), {
    completedModules: [],
    passedQuizzes: [],
    resourceProgress: {},
  });
});

test('loadProgress recovers from malformed JSON', () => {
  const localStorage = createLocalStorage({ 'course-site-progress-v1': '{bad json' });
  const { loadProgress } = loadProgressModule(localStorage);

  assert.deepEqual(toPlain(loadProgress()), {
    completedModules: [],
    passedQuizzes: [],
    resourceProgress: {},
  });
});

test('saveProgress normalizes duplicates, invalid entries, and resource statuses', () => {
  const localStorage = createLocalStorage();
  const { saveProgress, RESOURCE_STATUS } = loadProgressModule(localStorage);

  const normalized = saveProgress({
    completedModules: ['m1', 'm1', 42, 'm5'],
    passedQuizzes: ['m2', null, 'm2'],
    resourceProgress: {
      skills: RESOURCE_STATUS.COMPLETED,
      glossary: 'invalid-status',
    },
  });

  assert.deepEqual(toPlain(normalized), {
    completedModules: ['m1', 'm5'],
    passedQuizzes: ['m2'],
    resourceProgress: {
      skills: 'completed',
      mdSession: 'completed',
    },
  });

  const persisted = JSON.parse(localStorage.getItem('course-site-progress-v1'));
  assert.deepEqual(persisted, toPlain(normalized));
});

test('markCompleted persists a module and marks mdSession for module m5', () => {
  const localStorage = createLocalStorage();
  const { markCompleted, loadProgress } = loadProgressModule(localStorage);

  markCompleted('m5');
  markCompleted('m5');

  assert.deepEqual(toPlain(loadProgress()), {
    completedModules: ['m5'],
    passedQuizzes: [],
    resourceProgress: {
      mdSession: 'completed',
    },
  });
});

test('markQuizPassed persists once and isQuizPassed reflects saved state', () => {
  const localStorage = createLocalStorage();
  const { markQuizPassed, isQuizPassed, loadProgress } = loadProgressModule(localStorage);

  markQuizPassed('m3');
  markQuizPassed('m3');

  const progress = loadProgress();
  assert.equal(isQuizPassed(progress, 'm3'), true);
  assert.deepEqual(toPlain(progress.passedQuizzes), ['m3']);
});

test('markResourceInProgress does not downgrade a completed resource', () => {
  const localStorage = createLocalStorage({
    'course-site-progress-v1': JSON.stringify({
      completedModules: [],
      passedQuizzes: [],
      resourceProgress: { skills: 'completed' },
    }),
  });
  const { markResourceInProgress, markResourceCompleted, getResourceStatus, loadProgress } = loadProgressModule(localStorage);

  markResourceInProgress('glossary');
  markResourceCompleted('skills');
  markResourceInProgress('skills');

  const progress = loadProgress();
  assert.equal(getResourceStatus(progress, 'glossary'), 'in-progress');
  assert.equal(getResourceStatus(progress, 'skills'), 'completed');
});

test('getProgressStats computes completion percent and passed quizzes', () => {
  const localStorage = createLocalStorage();
  const { getProgressStats } = loadProgressModule(localStorage);

  const modules = [{ id: 'm0' }, { id: 'm1' }, { id: 'm2' }, { id: 'm3' }];
  const progress = {
    completedModules: ['m0', 'm3'],
    passedQuizzes: ['m3'],
    resourceProgress: {},
  };

  assert.deepEqual(toPlain(getProgressStats(modules, progress)), {
    total: 4,
    completed: 2,
    percent: 50,
    quizzesPassed: 1,
  });
});

test('getResourceProgressStats computes completed and in-progress resources', () => {
  const localStorage = createLocalStorage();
  const { getResourceProgressStats } = loadProgressModule(localStorage);

  const stats = getResourceProgressStats({
    completedModules: [],
    passedQuizzes: [],
    resourceProgress: {
      skills: 'completed',
      glossary: 'in-progress',
      mdSession: 'completed',
    },
  });

  assert.deepEqual(toPlain(stats), {
    total: 4,
    completed: 2,
    inProgress: 1,
    percent: 50,
  });
});