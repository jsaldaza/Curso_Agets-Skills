const test = require('node:test');
const assert = require('node:assert/strict');

const { filterExpenses } = require('../../src/expenseService');

const SAMPLE_EXPENSES = [
  {
    id: '1',
    amount: 12,
    category: 'food',
    description: 'Breakfast',
    date: '2026-04-01',
  },
  {
    id: '2',
    amount: 45,
    category: 'transport',
    description: 'Train pass',
    date: '2026-04-03',
  },
  {
    id: '3',
    amount: 25,
    category: 'food',
    description: 'Dinner',
    date: '2026-04-05',
  },
];

test('filterExpenses filters by category', () => {
  const result = filterExpenses(SAMPLE_EXPENSES, { category: 'food' });
  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map((item) => item.id),
    ['1', '3'],
  );
});

test('filterExpenses filters by date range', () => {
  const result = filterExpenses(SAMPLE_EXPENSES, {
    from: '2026-04-02',
    to: '2026-04-04',
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].id, '2');
});

test('filterExpenses throws on invalid from date', () => {
  assert.throws(
    () => filterExpenses(SAMPLE_EXPENSES, { from: '2026/04/01' }),
    /from must be in YYYY-MM-DD format/,
  );
});
