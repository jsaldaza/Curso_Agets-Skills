import { getProgressStats, getResourceProgressStats, isCompleted, isQuizPassed, loadProgress } from './progress.js';
import { initializeGuide } from './guide.js';
import {
  applyLanguageSelector,
  buildUrl,
  getCurrentLanguage,
  setLanguagePreference,
  t,
} from './lang.js';

const language = setLanguagePreference(getCurrentLanguage());
const RESOURCE_LINKS = [
  {
    id: 'skills-link',
    prefix: 'skills',
    href: () => buildUrl('/skills.html', language),
    key: 'home.assetsLinks.skills',
  },
  {
    id: 'glossary-link',
    prefix: 'glossary',
    href: () => buildUrl('/glossary.html', language),
    key: 'home.assetsLinks.glossary',
  },
  {
    id: 'md-session-link',
    prefix: 'md-session',
    href: () => buildUrl('/lesson.html', language, { id: 'm5' }),
    key: 'home.assetsLinks.mdSession',
  },
  {
    id: 'final-assessment-link',
    prefix: 'final-assessment',
    href: () => buildUrl('/final-assessment.html', language),
    key: 'home.assetsLinks.finalAssessment',
  },
];

function renderKnowledgeHubProgress() {
  const summary = document.getElementById('hub-progress-summary');
  const fill = document.getElementById('hub-progress-fill');

  if (!summary || !fill) {
    return;
  }

  const stats = getResourceProgressStats(loadProgress());
  summary.textContent = t(language, 'home.hubProgressSummary', stats);
  fill.style.width = `${stats.percent}%`;
}

function renderKnowledgeHubStats() {
  renderKnowledgeHubProgress();
}

function applyStaticTranslations() {
  const textMappings = [
    ['home-title', 'home.title'],
    ['home-subtitle', 'home.subtitle'],
    ['start-home-tour', 'home.startTour'],
    ['home-progress-title', 'home.progressTitle'],
    ['home-route-title', 'home.routeTitle'],
    ['home-assets-badge', 'home.assetsBadge'],
    ['home-assets-title', 'home.assetsTitle'],
    ['home-assets-description', 'home.assetsDescription'],
    ['home-assets-route-title', 'home.assetsRouteTitle'],
    ['home-assets-route-description', 'home.assetsRouteDescription'],
    ['home-workflow-title', 'home.workflowTitle'],
    ['home-workflow-description', 'home.workflowDescription'],
    ['home-architecture-title', 'home.architectureTitle'],
    ['home-architecture-description', 'home.architectureDescription'],
    ['home-architecture-diagram-title', 'home.architectureDiagramTitle'],
    ['home-practical-title', 'home.practicalTitle'],
    ['home-footer', 'home.footer'],
    ['language-label', 'language.label'],
  ];

  textMappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(language, key);
    }
  });

  const routeSteps = t(language, 'home.assetsRoute');
  if (Array.isArray(routeSteps)) {
    routeSteps.forEach((step, index) => {
      const title = document.getElementById(`route-step-${index + 1}-title`);
      const description = document.getElementById(`route-step-${index + 1}-description`);
      if (title) title.textContent = step.title;
      if (description) description.textContent = step.description;
    });
  }

  const practicalList = document.getElementById('home-practical-steps');
  const practicalSteps = t(language, 'home.practicalSteps');
  if (practicalList && Array.isArray(practicalSteps)) {
    practicalList.innerHTML = practicalSteps.map((step) => `<li>${step}</li>`).join('');
  }

  const architectureLayers = t(language, 'home.architectureLayers');
  const architectureContainer = document.getElementById('architecture-layers');
  if (architectureContainer && Array.isArray(architectureLayers)) {
    architectureContainer.innerHTML = architectureLayers
      .map(
        (layer) => `
          <article class="architecture-layer-card">
            <h4>${layer.title}</h4>
            <p>${layer.description}</p>
          </article>
        `,
      )
      .join('');
  }

  const architectureDocLink = document.getElementById('home-architecture-doc-link');
  if (architectureDocLink) {
    architectureDocLink.textContent = t(language, 'home.architectureRepoDocCta');
    architectureDocLink.href = '/repo-architecture.md';
  }

  document.documentElement.lang = language;
  document.title = t(language, 'home.title');

  const switcher = document.getElementById('language-switch');
  if (switcher) {
    const options = switcher.querySelectorAll('option');
    options.forEach((option) => {
      option.textContent = option.value === 'en' ? t(language, 'language.english') : t(language, 'language.spanish');
    });
  }

  RESOURCE_LINKS.forEach(({ id, prefix, href, key }) => {
    const link = document.getElementById(id);
    if (link) {
      link.href = href();
    }

    const content = t(language, key);
    if (!content || typeof content !== 'object') {
      return;
    }

    const title = document.getElementById(`${prefix}-title`);
    const description = document.getElementById(`${prefix}-description`);
    const meta = document.getElementById(`${prefix}-meta`);

    if (title) title.textContent = content.title;
    if (description) description.textContent = content.description;
    if (meta) meta.textContent = content.meta;
  });

  renderKnowledgeHubStats();
}

async function loadModules() {
  const contentFile = language === 'en' ? '/content/modules.en.json' : '/content/modules.json';
  const response = await fetch(contentFile);

  if (!response.ok) {
    throw new Error(language === 'en' ? 'Could not load course content' : 'No se pudo cargar el contenido del curso');
  }

  return response.json();
}

function renderModules(modules) {
  const grid = document.getElementById('module-grid');
  const progress = loadProgress();

  if (!grid) {
    return;
  }

  grid.innerHTML = '';

  modules.forEach((module) => {
    const article = document.createElement('article');
    article.className = 'module-card module-card-clickable';
    article.dataset.module = module.id;
    article.setAttribute('role', 'link');
    article.setAttribute('tabindex', '0');
    const completed = isCompleted(progress, module.id);
    const lessonUrl = buildUrl('/lesson.html', language, { id: module.id });

    article.innerHTML = `
      <h3>${module.order}. ${module.title}</h3>
      <p class="module-meta">${t(language, 'home.moduleMeta.level')}: ${module.level}</p>
      <p class="module-meta">${t(language, 'home.moduleMeta.duration')}: ${module.durationMinutes} ${t(language, 'home.moduleMeta.minutes')}</p>
      <p class="module-status ${completed ? 'done' : 'pending'}">${completed ? t(language, 'home.moduleMeta.completed') : t(language, 'home.moduleMeta.pending')}</p>
      <p class="module-meta">${t(language, 'home.moduleMeta.quizLabel')}: ${isQuizPassed(progress, module.id) ? t(language, 'home.moduleMeta.quizApproved') : t(language, 'home.moduleMeta.quizPending')}</p>
      <p>${module.summary}</p>
    `;

    article.addEventListener('click', () => {
      window.location.href = lessonUrl;
    });

    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = lessonUrl;
      }
    });

    grid.appendChild(article);
  });
}

function renderProgress(modules) {
  const summary = document.getElementById('progress-summary');
  const fill = document.getElementById('progress-fill');

  if (!summary || !fill) {
    return;
  }

  const stats = getProgressStats(modules, loadProgress());
  summary.textContent = t(language, 'home.progressSummary', stats);
  fill.style.width = `${stats.percent}%`;
}

function renderError(message) {
  const grid = document.getElementById('module-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = `<p>${message}</p>`;
}

loadModules()
  .then((modules) => {
    renderProgress(modules);
    renderModules(modules);
    renderKnowledgeHubStats();

    const stepLabels = {
      previous: t(language, 'guide.previous'),
      next: t(language, 'guide.next'),
      finish: t(language, 'guide.finish'),
      close: t(language, 'guide.close'),
    };

    initializeGuide({
      triggerId: 'start-home-tour',
      steps: [
        {
          title: t(language, 'home.tour.step1Title'),
          description: t(language, 'home.tour.step1Description'),
          selector: '#home-progress-panel',
          labels: { ...stepLabels, stepMeta: t(language, 'guide.stepMeta', { current: 1, total: 4 }) },
        },
        {
          title: t(language, 'home.tour.step3Title'),
          description: t(language, 'home.tour.step3Description'),
          selector: '#home-assets-panel',
          labels: { ...stepLabels, stepMeta: t(language, 'guide.stepMeta', { current: 2, total: 4 }) },
        },
        {
          title: t(language, 'home.tour.step2Title'),
          description: t(language, 'home.tour.step2Description'),
          selector: '#home-route-panel',
          labels: { ...stepLabels, stepMeta: t(language, 'guide.stepMeta', { current: 3, total: 4 }) },
        },
        {
          title: t(language, 'home.tour.step4Title'),
          description: t(language, 'home.tour.step4Description'),
          selector: '#home-workflow-panel',
          labels: { ...stepLabels, stepMeta: t(language, 'guide.stepMeta', { current: 4, total: 4 }) },
        },
      ],
    });

    let lastProgressHash = '';

    const observeProgressChanges = () => {
      const progress = JSON.stringify(loadProgress());
      if (progress !== lastProgressHash) {
        lastProgressHash = progress;
        renderKnowledgeHubStats();
      }
    };

    window.addEventListener('focus', observeProgressChanges);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        observeProgressChanges();
      }
    });
  })
  .catch((error) => renderError(error.message));

applyStaticTranslations();
applyLanguageSelector('language-switch', language);
