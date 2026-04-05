import {
  isCompleted,
  isQuizPassed,
  loadProgress,
  markCompleted,
  markQuizPassed,
  markResourceCompleted,
  markResourceInProgress,
} from './progress.js';
import { initializeGuide } from './guide.js';
import {
  applyLanguageSelector,
  buildUrl,
  getCurrentLanguage,
  setLanguagePreference,
  t,
} from './lang.js';

const language = setLanguagePreference(getCurrentLanguage());

async function loadModules() {
  const contentFile = language === 'en' ? '/content/modules.en.json' : '/content/modules.json';
  const response = await fetch(contentFile);
  if (!response.ok) {
    throw new Error(t(language, 'lesson.errors.loadModules'));
  }
  return response.json();
}

async function loadLessons() {
  const contentFile = language === 'en' ? '/content/lessons.en.json' : '/content/lessons.json';
  const response = await fetch(contentFile);
  if (!response.ok) {
    throw new Error(t(language, 'lesson.errors.loadLessons'));
  }
  return response.json();
}

function getModuleIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'm0';
}

function renderSections(lesson) {
  const container = document.getElementById('lesson-sections');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  lesson.sections.forEach((section) => {
    const article = document.createElement('article');
    article.className = 'lesson-section';

    const heading = document.createElement('h3');
    heading.textContent = section.heading;
    article.appendChild(heading);

    (section.paragraphs || []).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      article.appendChild(p);
    });

    if (section.bullets && section.bullets.length > 0) {
      const ul = document.createElement('ul');
      section.bullets.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      article.appendChild(ul);
    }

    if (section.diagram) {
      const pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = section.diagram;
      article.appendChild(pre);
    }

    if (section.simulator) {
      article.appendChild(createSimulator(section.simulator));
    }

    container.appendChild(article);
  });
}

function createSimulator(simulator) {
  const wrapper = document.createElement('div');
  wrapper.className = 'simulator';

  const title = document.createElement('h4');
  title.textContent = simulator.title || t(language, 'lesson.simulator.fallbackTitle');
  wrapper.appendChild(title);

  const description = document.createElement('p');
  description.textContent = simulator.description || t(language, 'lesson.simulator.fallbackDescription');
  wrapper.appendChild(description);

  const state = document.createElement('div');
  state.className = 'sim-state';
  wrapper.appendChild(state);

  const actions = document.createElement('div');
  actions.className = 'sim-actions';

  const prevButton = document.createElement('button');
  prevButton.className = 'secondary-button';
  prevButton.type = 'button';
  prevButton.textContent = t(language, 'lesson.simulator.previous');

  const nextButton = document.createElement('button');
  nextButton.className = 'primary-button';
  nextButton.type = 'button';
  nextButton.textContent = t(language, 'lesson.simulator.next');

  actions.appendChild(prevButton);
  actions.appendChild(nextButton);
  wrapper.appendChild(actions);

  const steps = Array.isArray(simulator.steps) ? simulator.steps : [];
  let index = 0;

  function renderStep() {
    if (steps.length === 0) {
      state.innerHTML = `<p>${t(language, 'lesson.simulator.noSteps')}</p>`;
      prevButton.disabled = true;
      nextButton.disabled = true;
      return;
    }

    const step = steps[index];
    state.innerHTML = `
      <p class="sim-step-meta">${t(language, 'lesson.simulator.stepMeta', {
        index: index + 1,
        total: steps.length,
      })}</p>
      <h5>${step.actor}</h5>
      <p>${step.action}</p>
      <p class="sim-output"><strong>${t(language, 'lesson.simulator.output')}:</strong> ${step.output}</p>
    `;

    prevButton.disabled = index === 0;
    nextButton.disabled = index === steps.length - 1;
  }

  prevButton.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      renderStep();
    }
  });

  nextButton.addEventListener('click', () => {
    if (index < steps.length - 1) {
      index += 1;
      renderStep();
    }
  });

  renderStep();
  return wrapper;
}

function renderNavigation(modules, moduleId) {
  const nav = document.getElementById('lesson-nav');
  if (!nav) {
    return;
  }

  const ordered = [...modules].sort((a, b) => a.order - b.order);
  const currentIndex = ordered.findIndex((module) => module.id === moduleId);

  if (currentIndex === -1) {
    nav.innerHTML = `<p>${t(language, 'lesson.navigation.notFound')}</p>`;
    return;
  }

  const previous = ordered[currentIndex - 1];
  const next = ordered[currentIndex + 1];

  nav.innerHTML = `
    <a class="nav-button ${previous ? '' : 'is-disabled'}" href="${previous ? buildUrl('/lesson.html', language, { id: previous.id }) : '#'}">
      ${previous ? `← ${previous.title}` : t(language, 'lesson.navigation.prevEmpty')}
    </a>
    <a class="nav-button ${next ? '' : 'is-disabled'}" href="${next ? buildUrl('/lesson.html', language, { id: next.id }) : '#'}">
      ${next ? `${next.title} →` : t(language, 'lesson.navigation.nextEmpty')}
    </a>
  `;
}

function renderLessonHeader(lesson) {
  const title = document.getElementById('lesson-title');
  const objective = document.getElementById('lesson-objective');

  if (title) {
    title.textContent = lesson.title;
  }

  if (objective) {
    objective.textContent = lesson.objective;
  }
}

function renderError(error) {
  const container = document.getElementById('lesson-sections');
  if (!container) {
    return;
  }

  container.innerHTML = `<p>${error.message}</p>`;
}

function renderCompletionStatus(moduleId) {
  const status = document.getElementById('completion-status');
  const button = document.getElementById('complete-lesson-button');

  if (!status || !button) {
    return;
  }

  if (isCompleted(loadProgress(), moduleId)) {
    status.textContent = t(language, 'lesson.completionDone');
    button.disabled = true;
    button.textContent = t(language, 'lesson.completionButtonDone');
    return;
  }

  status.textContent = t(language, 'lesson.completionPending');
  button.disabled = false;
  button.textContent = t(language, 'lesson.completionButtonPending');
}

function renderQuiz(lesson, moduleId) {
  const container = document.getElementById('lesson-quiz');
  const intro = document.getElementById('quiz-intro');

  if (!container || !intro) {
    return;
  }

  if (!lesson.quiz) {
    intro.textContent = t(language, 'lesson.quizNoData');
    container.innerHTML = '';
    return;
  }

  const progress = loadProgress();
  const alreadyPassed = isQuizPassed(progress, moduleId);
  intro.textContent = alreadyPassed
    ? t(language, 'lesson.quizPassedIntro')
    : lesson.quiz.description || t(language, 'lesson.quizDefaultIntro');

  container.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'quiz-form';

  lesson.quiz.questions.forEach((question, questionIndex) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'quiz-question';

    const legend = document.createElement('legend');
    legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
    fieldset.appendChild(legend);

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      label.className = 'quiz-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `question-${questionIndex}`;
      input.value = String(optionIndex);
      input.disabled = alreadyPassed;

      const span = document.createElement('span');
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      fieldset.appendChild(label);
    });

    const feedback = document.createElement('p');
    feedback.className = 'quiz-feedback';
    feedback.dataset.questionFeedback = String(questionIndex);
    fieldset.appendChild(feedback);

    form.appendChild(fieldset);
  });

  const actions = document.createElement('div');
  actions.className = 'quiz-actions';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'primary-button';
  submit.textContent = alreadyPassed ? t(language, 'lesson.quizPassedButton') : t(language, 'lesson.quizSubmit');
  submit.disabled = alreadyPassed;

  const result = document.createElement('p');
  result.className = 'quiz-result';
  if (alreadyPassed) {
    result.textContent = t(language, 'lesson.quizSaved');
  }

  actions.appendChild(submit);
  actions.appendChild(result);
  form.appendChild(actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let correctAnswers = 0;

    lesson.quiz.questions.forEach((question, questionIndex) => {
      const selected = form.querySelector(`input[name="question-${questionIndex}"]:checked`);
      const feedback = form.querySelector(`[data-question-feedback="${questionIndex}"]`);
      const explanation = question.explanation || t(language, 'lesson.feedbackFallback');

      if (selected && Number(selected.value) === question.correctIndex) {
        correctAnswers += 1;
        if (feedback) {
          feedback.textContent = t(language, 'lesson.quizCorrectFeedback', explanation);
          feedback.className = 'quiz-feedback correct';
        }
        return;
      }

      if (feedback) {
        feedback.textContent = t(language, 'lesson.quizIncorrectFeedback', explanation);
        feedback.className = 'quiz-feedback incorrect';
      }
    });

    const passed = correctAnswers === lesson.quiz.questions.length;

    if (passed) {
      markQuizPassed(moduleId);
      if (moduleId === 'm5') {
        markResourceCompleted('mdSession');
      }
      result.textContent = t(language, 'lesson.quizPerfect', {
        correct: correctAnswers,
        total: lesson.quiz.questions.length,
      });
      submit.disabled = true;
      submit.textContent = t(language, 'lesson.quizPassedButton');

      form.querySelectorAll('input').forEach((input) => {
        input.disabled = true;
      });
      intro.textContent = t(language, 'lesson.quizPassedIntro');
      return;
    }

    result.textContent = t(language, 'lesson.quizRetry', {
      correct: correctAnswers,
      total: lesson.quiz.questions.length,
    });
  });

  container.appendChild(form);
}

function initializeLessonGuide(moduleId) {
  const baseSteps = [
    {
      title: t(language, 'lesson.tour.step1Title'),
      description: t(language, 'lesson.tour.step1Description'),
      selector: '#lesson-content-panel',
    },
    {
      title: t(language, 'lesson.tour.step2Title'),
      description: t(language, 'lesson.tour.step2Description'),
      selector: '#quiz-panel',
    },
    {
      title: t(language, 'lesson.tour.step3Title'),
      description: t(language, 'lesson.tour.step3Description'),
      selector: '#lesson-next-panel',
    },
  ];

  if (moduleId === 'm2') {
    baseSteps.splice(1, 0, {
      title: t(language, 'lesson.tour.m2Title'),
      description: t(language, 'lesson.tour.m2Description'),
      selector: '.simulator',
    });
  }

  const stepLabels = {
    previous: t(language, 'guide.previous'),
    next: t(language, 'guide.next'),
    finish: t(language, 'guide.finish'),
    close: t(language, 'guide.close'),
  };

  const total = baseSteps.length;
  const localizedSteps = baseSteps.map((step, index) => ({
    ...step,
    labels: {
      ...stepLabels,
      stepMeta: t(language, 'guide.stepMeta', { current: index + 1, total }),
    },
  }));

  initializeGuide({
    triggerId: 'start-lesson-tour',
    steps: localizedSteps,
  });
}

function wireCompletionAction(moduleId) {
  const button = document.getElementById('complete-lesson-button');
  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    markCompleted(moduleId);
    if (moduleId === 'm5') {
      markResourceCompleted('mdSession');
    }
    renderCompletionStatus(moduleId);
  });
}

async function run() {
  const [modules, lessons] = await Promise.all([loadModules(), loadLessons()]);
  const moduleId = getModuleIdFromUrl();

  const lesson = lessons.find((entry) => entry.moduleId === moduleId);

  if (moduleId === 'm5') {
    markResourceInProgress('mdSession');
  }

  if (!lesson) {
    throw new Error(t(language, 'lesson.errors.lessonNotFound'));
  }

  renderLessonHeader(lesson);
  renderSections(lesson);
  renderQuiz(lesson, moduleId);
  renderNavigation(modules, moduleId);
  renderCompletionStatus(moduleId);
  wireCompletionAction(moduleId);
  initializeLessonGuide(moduleId);

  if (window.__MERMAID__) {
    await window.__MERMAID__.run({ querySelector: '.mermaid' });
  }
}

function applyStaticTranslations() {
  const mappings = [
    ['lesson-back-home', 'lesson.backHome'],
    ['lesson-badge', 'lesson.badge'],
    ['start-lesson-tour', 'lesson.startTour'],
    ['lesson-content-title', 'lesson.contentTitle'],
    ['lesson-quiz-title', 'lesson.quizTitle'],
    ['quiz-intro', 'lesson.quizIntro'],
    ['lesson-next-title', 'lesson.nextStepTitle'],
    ['completion-status', 'lesson.completionPending'],
    ['complete-lesson-button', 'lesson.completionButtonPending'],
    ['lesson-footer', 'lesson.footer'],
    ['language-label', 'language.label'],
  ];

  mappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(language, key);
    }
  });

  const homeLink = document.getElementById('lesson-back-home');
  if (homeLink) {
    homeLink.href = buildUrl('/index.html', language);
  }

  const switcher = document.getElementById('language-switch');
  if (switcher) {
    const options = switcher.querySelectorAll('option');
    options.forEach((option) => {
      option.textContent = option.value === 'en' ? t(language, 'language.english') : t(language, 'language.spanish');
    });
  }

  document.documentElement.lang = language;
  document.title = t(language, 'lesson.pageTitle');
}

applyStaticTranslations();
applyLanguageSelector('language-switch', language);

run().catch((error) => renderError(error));
