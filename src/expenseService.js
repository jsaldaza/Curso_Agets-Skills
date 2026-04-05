const { randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const DEFAULT_DATA_FILE = path.resolve(process.cwd(), 'data', 'expenses.json');

async function ensureDataFile(storageFile = DEFAULT_DATA_FILE) {
  const dir = path.dirname(storageFile);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(storageFile);
  } catch {
    await fs.writeFile(storageFile, '[]\n', 'utf8');
  }
}

async function readExpenses(storageFile = DEFAULT_DATA_FILE) {
  await ensureDataFile(storageFile);
  const raw = await fs.readFile(storageFile, 'utf8');

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeExpenses(expenses, storageFile = DEFAULT_DATA_FILE) {
  await ensureDataFile(storageFile);
  await fs.writeFile(storageFile, `${JSON.stringify(expenses, null, 2)}\n`, 'utf8');
}

function validateDate(value, fieldName) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${fieldName} must be in YYYY-MM-DD format`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} is not a valid date`);
  }
}

function normalizeExpenseInput(input) {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('amount must be a positive number');
  }

  const category = String(input.category || '').trim();
  if (!category) {
    throw new Error('category is required');
  }

  const description = String(input.description || '').trim();
  if (!description) {
    throw new Error('description is required');
  }

  const date = String(input.date || '').trim();
  validateDate(date, 'date');

  return {
    amount,
    category,
    description,
    date,
  };
}

async function addExpense(input, storageFile = DEFAULT_DATA_FILE) {
  const normalized = normalizeExpenseInput(input);
  const expenses = await readExpenses(storageFile);

  const expense = {
    id: randomUUID(),
    ...normalized,
  };

  expenses.push(expense);
  await writeExpenses(expenses, storageFile);

  return expense;
}

function filterExpenses(expenses, filters = {}) {
  const category = filters.category ? String(filters.category).trim().toLowerCase() : null;
  const from = filters.from ? String(filters.from).trim() : null;
  const to = filters.to ? String(filters.to).trim() : null;

  if (from) {
    validateDate(from, 'from');
  }

  if (to) {
    validateDate(to, 'to');
  }

  return expenses.filter((expense) => {
    if (category && String(expense.category).toLowerCase() !== category) {
      return false;
    }

    if (from && expense.date < from) {
      return false;
    }

    if (to && expense.date > to) {
      return false;
    }

    return true;
  });
}

module.exports = {
  DEFAULT_DATA_FILE,
  addExpense,
  filterExpenses,
  normalizeExpenseInput,
  readExpenses,
  writeExpenses,
};
