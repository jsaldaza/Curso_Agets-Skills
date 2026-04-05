const test = require('@playwright/test').test;
const expect = require('@playwright/test').expect;
const { allure } = require('allure-playwright');

test('user can complete first lesson and progress is persisted', async ({ page }) => {
  await page.goto('/index.html?lang=en');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();

  const firstModule = page.locator('.module-card.module-card-clickable').first();
  await expect(firstModule).toBeVisible();
  await firstModule.click();

  await expect(page).toHaveURL(/\/lesson\.html\?.*id=m0/);

  const completeButton = page.locator('#complete-lesson-button');
  await expect(completeButton).toBeVisible();
  await expect(completeButton).toBeEnabled();
  await completeButton.click();

  const progressAfterLesson = await page.evaluate(() => {
    const raw = window.localStorage.getItem('course-site-progress-v1');
    return raw ? JSON.parse(raw) : null;
  });

  await allure.attachment(
    'progress-after-lesson.json',
    JSON.stringify(progressAfterLesson, null, 2),
    'application/json',
  );

  expect(progressAfterLesson).not.toBeNull();
  expect(progressAfterLesson.completedModules).toContain('m0');

  await page.goto('/index.html?lang=en');
  await expect(page.locator('#progress-summary')).toContainText('1');
});

test('home guided tour opens and displays first step', async ({ page }) => {
  await page.goto('/index.html?lang=en');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();

  const tourButton = page.locator('#start-home-tour');
  await expect(tourButton).toBeVisible();
  await tourButton.click();

  await expect(page.locator('.tour-card')).toBeVisible();
  await expect(page.locator('.tour-step-meta')).toContainText(/1|Step 1/);

  const tourStepMeta = await page.locator('.tour-step-meta').innerText();
  await allure.attachment('tour-step-meta.txt', tourStepMeta, 'text/plain');
});

test('final assessment can be passed and marks resource as completed', async ({ page }) => {
  const assessmentData = await page.request.get('/content/final-assessment.en.json').then((response) => response.json());
  await allure.attachment(
    'assessment-metadata.json',
    JSON.stringify({
      title: assessmentData.title,
      questions: assessmentData.questions.length,
      passScore: assessmentData.passScore,
    }, null, 2),
    'application/json',
  );

  await page.goto('/final-assessment.html?lang=en');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();

  await expect(page.locator('#assessment-form .quiz-question')).toHaveCount(assessmentData.questions.length);

  for (let questionIndex = 0; questionIndex < assessmentData.questions.length; questionIndex += 1) {
    const correctIndex = assessmentData.questions[questionIndex].correctIndex;
    await page.locator(`input[name="q${questionIndex}"][value="${correctIndex}"]`).check();
  }

  await page.locator('#assessment-form button[type="submit"]').click();
  await expect(page.locator('#assessment-result')).toContainText(/Excellent|Passed/);

  const progress = await page.evaluate(() => {
    const raw = window.localStorage.getItem('course-site-progress-v1');
    return raw ? JSON.parse(raw) : null;
  });

  await allure.attachment('progress-after-assessment.json', JSON.stringify(progress, null, 2), 'application/json');

  expect(progress).not.toBeNull();
  expect(progress.resourceProgress.finalAssessment).toBe('completed');
});
