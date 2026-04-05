#!/usr/bin/env node

const { addExpense, filterExpenses, readExpenses } = require('./expenseService');

function printUsage() {
  console.log('Expense Tracker CLI');
  console.log('');
  console.log('Usage:');
  console.log('  node src/cli.js add --amount <number> --category <text> --description <text> --date <YYYY-MM-DD>');
  console.log('  node src/cli.js list [--category <text>] [--from <YYYY-MM-DD>] [--to <YYYY-MM-DD>]');
}

function parseFlags(args) {
  const flags = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const value = args[i + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    flags[key] = value;
    i += 1;
  }

  return flags;
}

async function run() {
  const [, , command, ...rest] = process.argv;

  if (!command || command === '--help' || command === '-h') {
    printUsage();
    return;
  }

  if (command === 'add') {
    const flags = parseFlags(rest);

    const expense = await addExpense({
      amount: flags.amount,
      category: flags.category,
      description: flags.description,
      date: flags.date,
    });

    console.log('Expense added:');
    console.table([expense]);
    return;
  }

  if (command === 'list') {
    const flags = parseFlags(rest);
    const expenses = await readExpenses();
    const filtered = filterExpenses(expenses, {
      category: flags.category,
      from: flags.from,
      to: flags.to,
    });

    if (filtered.length === 0) {
      console.log('No expenses found for the provided filters.');
      return;
    }

    console.table(filtered);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
