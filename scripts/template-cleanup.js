#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const isApply = process.argv.includes('--apply');

const removeTargets = [
  'apps/course-site',
  'src/cli.js',
  'src/expenseService.js',
  'data/expenses.json',
  'tests/course',
  'tests/e2e',
  'tests/legacy',
  'tests/unit/filter.test.js',
  'tests/unit/storage.test.js',
  'tests/unit/progress.test.js',
  'playwright.config.js',
  'allure-results',
  'allure-report',
  'playwright-report',
  'test-results',
];

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function cleanupPackageJson(pkg) {
  const scripts = {
    dev: 'echo "Define the development command for your project"',
    build: 'echo "Define the build command for your project"',
    start: 'echo "Define the start command for your project"',
    lint: 'echo "Define the lint command for your project"',
    format: 'echo "Define the format command for your project"',
    test: 'echo "Define the test command for your project"',
    'test:watch': 'echo "Define the watch test command for your project"',
    'test:ci': 'echo "Define the CI test command for your project"',
    e2e: 'echo "Define the E2E command for your project"',
    'e2e:ui': 'echo "Define the interactive E2E command for your project"',
    validate: 'echo "Define the validation workflow for your project"',
    prepare: 'echo "Optional: add git hooks or setup steps"',
    'template:cleanup:dry': 'node scripts/template-cleanup.js',
    'template:cleanup': 'node scripts/template-cleanup.js --apply',
  };

  const next = {
    ...pkg,
    scripts,
  };

  if (next.devDependencies) {
    delete next.devDependencies['@playwright/test'];
    delete next.devDependencies['allure-commandline'];
    delete next.devDependencies['allure-playwright'];

    if (Object.keys(next.devDependencies).length === 0) {
      delete next.devDependencies;
    }
  }

  return next;
}

async function main() {
  const existingTargets = [];

  for (const rel of removeTargets) {
    const abs = path.join(repoRoot, rel);
    if (await exists(abs)) {
      existingTargets.push(rel);
    }
  }

  const packagePath = path.join(repoRoot, 'package.json');
  const pkgRaw = await fs.readFile(packagePath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  const cleanedPkg = cleanupPackageJson(pkg);

  console.log('Template cleanup plan');
  console.log(`Mode: ${isApply ? 'APPLY' : 'DRY-RUN'}`);
  console.log('');

  if (existingTargets.length === 0) {
    console.log('- No removable demo targets found.');
  } else {
    console.log('- Demo/reference targets to remove:');
    for (const target of existingTargets) {
      console.log(`  - ${target}`);
    }
  }

  console.log('');
  console.log('- package.json will be normalized to template-friendly placeholder scripts.');
  console.log('- Playwright/Allure dev dependencies will be removed when present.');

  if (!isApply) {
    console.log('');
    console.log('No files were changed. Run with --apply to execute cleanup.');
    return;
  }

  for (const rel of existingTargets) {
    const abs = path.join(repoRoot, rel);
    await fs.rm(abs, { recursive: true, force: true });
  }

  await fs.writeFile(packagePath, `${JSON.stringify(cleanedPkg, null, 2)}\n`, 'utf8');

  console.log('');
  console.log('Cleanup applied successfully.');
}

main().catch((error) => {
  console.error('Template cleanup failed.');
  console.error(error);
  process.exitCode = 1;
});
