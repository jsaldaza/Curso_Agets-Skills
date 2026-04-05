const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const {
  addExpense,
  normalizeExpenseInput,
  readExpenses,
} = require('../../src/expenseService');

test('addExpense persists expense to storage file', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'expense-storage-'));
  const storageFile = path.join(dir, 'expenses.json');

  const created = await addExpense(
    {
      amount: 18.25,
      category: 'food',
      description: 'Lunch',
      date: '2026-04-04',
    },
    storageFile,
  );

  const expenses = await readExpenses(storageFile);
  assert.equal(expenses.length, 1);
  assert.equal(expenses[0].id, created.id);
  assert.equal(expenses[0].amount, 18.25);
  assert.equal(expenses[0].category, 'food');
});

test('normalizeExpenseInput rejects invalid amount', () => {
  assert.throws(
    () =>
      normalizeExpenseInput({
        amount: -1,
        category: 'food',
        description: 'invalid',
        date: '2026-04-04',
      }),
    /amount must be a positive number/,
  );
});

test('normalizeExpenseInput rejects invalid date format', () => {
  assert.throws(
    () =>
      normalizeExpenseInput({
        amount: 20,
        category: 'transport',
        description: 'Taxi',
        date: '04-04-2026',
      }),
    /date must be in YYYY-MM-DD format/,
  );
});
