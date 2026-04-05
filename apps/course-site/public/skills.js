import { markResourceCompleted, markResourceInProgress } from './progress.js';
import { applyLanguageSelector, buildUrl, getCurrentLanguage, setLanguagePreference } from './lang.js';

const language = setLanguagePreference(getCurrentLanguage());
markResourceInProgress('skills');
const SELECTED_SKILL_STORAGE_KEY = 'course-site-selected-skill-v1';
const SKILL_SECTION_PROGRESS_STORAGE_KEY = 'course-site-skill-section-progress-v1';

const TEXT = {
  es: {
    pageTitle: 'Índice de skills del workflow',
    badge: 'Skill Explorer',
    title: 'Índice de skills del workflow',
    subtitle: 'Explora cada skill, su archivo, propósito, errores comunes y cómo usarlo en el flujo real.',
    listTitle: 'Skills disponibles',
    footer: 'Cada skill reduce incertidumbre cuando se usa en el momento correcto.',
    backHome: '← Volver al inicio',
    openLesson: 'Abrir lección relacionada',
    file: 'Archivo',
    category: 'Categoría',
    whenToUse: 'Cuándo usarlo',
    whatItDoes: 'Qué hace',
    checklist: 'Checklist operativo',
    purpose: 'Propósito',
    pitfalls: 'Errores comunes',
    suggestions: 'Sugerencias senior',
    improvements: 'Mejoras sugeridas',
    playground: 'Playground por proyecto',
    playgroundScenario: 'Escenario',
    playgroundTweak: 'Prueba este ajuste',
    playgroundImpact: 'Impacto esperado',
    languageLabel: 'Idioma',
    noResults: 'No hay skills para este filtro.',
    menuLabel: 'Menú de skills',
    searchPlaceholder: 'Buscar skill o palabra clave',
    searchAria: 'Buscar skill',
    quickPlanTitle: 'Plantilla rápida por proyecto',
    quickPlanDescription: 'Selecciona un tipo de proyecto y genera un mini plan accionable para este skill.',
    sectionProgressLabel: 'Progreso de bloques',
    blockDone: 'Completado',
    blockPending: 'Pendiente',
    markBlockDone: 'Marcar bloque como completado',
    markBlockPending: 'Marcar bloque como pendiente',
    syllabusOverview: 'Resumen del skill',
    projectTypeLabel: 'Tipo de proyecto',
    projectTypes: {
      api: 'API / Backend',
      webapp: 'Web App / Frontend',
      data: 'Data / Analytics',
      automation: 'Automation / Scripts',
    },
    generatePlan: 'Generar mini plan',
    quickPlanOutput: 'Mini plan sugerido',
    filters: {
      all: 'Todos',
      planning: 'Planificación',
      execution: 'Ejecución',
      quality: 'Calidad',
    },
  },
  en: {
    pageTitle: 'Workflow skill index',
    badge: 'Skill Explorer',
    title: 'Workflow skill index',
    subtitle: 'Explore each skill, its file, purpose, common mistakes, and practical usage.',
    listTitle: 'Available skills',
    footer: 'Each skill reduces uncertainty when used at the right moment.',
    backHome: '← Back to home',
    openLesson: 'Open related lesson',
    file: 'File',
    category: 'Category',
    whenToUse: 'When to use',
    whatItDoes: 'What it does',
    checklist: 'Operational checklist',
    purpose: 'Purpose',
    pitfalls: 'Common pitfalls',
    suggestions: 'Senior suggestions',
    improvements: 'Suggested improvements',
    playground: 'Project playground',
    playgroundScenario: 'Scenario',
    playgroundTweak: 'Try this tweak',
    playgroundImpact: 'Expected impact',
    languageLabel: 'Language',
    noResults: 'No skills found for this filter.',
    menuLabel: 'Skill menu',
    searchPlaceholder: 'Search skill or keyword',
    searchAria: 'Search skill',
    quickPlanTitle: 'Quick template by project type',
    quickPlanDescription: 'Choose a project type and generate an actionable mini plan for this skill.',
    sectionProgressLabel: 'Section progress',
    blockDone: 'Completed',
    blockPending: 'Pending',
    markBlockDone: 'Mark block as completed',
    markBlockPending: 'Mark block as pending',
    syllabusOverview: 'Skill overview',
    projectTypeLabel: 'Project type',
    projectTypes: {
      api: 'API / Backend',
      webapp: 'Web App / Frontend',
      data: 'Data / Analytics',
      automation: 'Automation / Scripts',
    },
    generatePlan: 'Generate mini plan',
    quickPlanOutput: 'Suggested mini plan',
    filters: {
      all: 'All',
      planning: 'Planning',
      execution: 'Execution',
      quality: 'Quality',
    },
  },
};

let allSkills = [];
let activeFilter = 'all';
let activeSkillId = null;
let searchQuery = '';

function t(key) {
  return key.split('.').reduce((acc, part) => acc?.[part], TEXT[language]);
}

function saveSelectedSkill(skillId) {
  localStorage.setItem(SELECTED_SKILL_STORAGE_KEY, skillId);
}

function getSavedSkillId() {
  return localStorage.getItem(SELECTED_SKILL_STORAGE_KEY);
}

function loadSectionProgress() {
  const raw = localStorage.getItem(SKILL_SECTION_PROGRESS_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSectionProgress(progress) {
  localStorage.setItem(SKILL_SECTION_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function isSectionCompleted(skillId, sectionKey) {
  const progress = loadSectionProgress();
  return Boolean(progress?.[skillId]?.[sectionKey]);
}

function toggleSectionCompleted(skillId, sectionKey) {
  const progress = loadSectionProgress();
  progress[skillId] = progress[skillId] || {};
  progress[skillId][sectionKey] = !progress[skillId][sectionKey];
  saveSectionProgress(progress);
}

function getSectionProgress(skillId, sectionKeys) {
  const completed = sectionKeys.filter((key) => isSectionCompleted(skillId, key)).length;
  return { completed, total: sectionKeys.length };
}

async function loadSkills() {
  const contentFile = language === 'en' ? '/content/skills.en.json' : '/content/skills.json';
  const response = await fetch(contentFile);
  if (!response.ok) {
    throw new Error('Unable to load skill index');
  }
  return response.json();
}

function applyStaticText() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');

  const mappings = [
    ['skills-badge', 'badge'],
    ['skills-title', 'title'],
    ['skills-subtitle', 'subtitle'],
    ['skills-list-title', 'listTitle'],
    ['skills-footer', 'footer'],
    ['skills-back-home', 'backHome'],
    ['language-label', 'languageLabel'],
  ];

  mappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(key);
    }
  });

  const home = document.getElementById('skills-back-home');
  if (home) {
    home.href = buildUrl('/index.html', language);
  }

  const menu = document.getElementById('skills-menu');
  if (menu) {
    menu.setAttribute('aria-label', t('menuLabel'));
  }

  const search = document.getElementById('skills-search');
  if (search) {
    search.placeholder = t('searchPlaceholder');
    search.setAttribute('aria-label', t('searchAria'));
  }
}

function renderSkillMenu(skills) {
  const menu = document.getElementById('skills-menu');
  if (!menu) {
    return;
  }

  menu.innerHTML = '';

  if (!skills.length) {
    menu.innerHTML = `<p class="module-meta">${t('noResults')}</p>`;
    renderSkillDetail(null);
    return;
  }

  if (!activeSkillId || !skills.find((skill) => skill.id === activeSkillId)) {
    activeSkillId = getSavedSkillId() || skills[0].id;
  }

  if (!skills.find((skill) => skill.id === activeSkillId)) {
    activeSkillId = skills[0].id;
  }

  skills.forEach((skill) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `skill-menu-item ${activeSkillId === skill.id ? 'is-active' : ''}`;
    button.innerHTML = `<strong>${skill.id}</strong> · ${skill.name}`;

    button.addEventListener('click', () => {
      activeSkillId = skill.id;
      saveSelectedSkill(skill.id);
      renderSkillMenu(skills);
      renderSkillDetail(skill);
    });

    menu.appendChild(button);
  });

  const activeSkill = skills.find((skill) => skill.id === activeSkillId) || skills[0];
  saveSelectedSkill(activeSkill.id);
  renderSkillDetail(activeSkill);
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderPlayground(playground = []) {
  if (!playground.length) {
    return `<p class="module-meta">-</p>`;
  }

  return playground
    .map(
      (entry) => `
      <article class="lesson-section">
        <p><strong>${t('playgroundScenario')}:</strong> ${entry.scenario}</p>
        <p><strong>${t('playgroundTweak')}:</strong> ${entry.tweak}</p>
        <p><strong>${t('playgroundImpact')}:</strong> ${entry.expectedImpact}</p>
      </article>
    `,
    )
    .join('');
}

function renderSyllabusSection(skillId, sectionKey, title, bodyHtml, open = false) {
  const done = isSectionCompleted(skillId, sectionKey);
  return `
    <details class="syllabus-section" ${open ? 'open' : ''}>
      <summary>
        <span>${title}</span>
        <span class="syllabus-status ${done ? 'done' : 'pending'}">${done ? t('blockDone') : t('blockPending')}</span>
      </summary>
      <div class="syllabus-content">
        ${bodyHtml}
        <button
          type="button"
          class="secondary-button syllabus-toggle"
          data-section-key="${sectionKey}"
        >
          ${done ? t('markBlockPending') : t('markBlockDone')}
        </button>
      </div>
    </details>
  `;
}

function attachSectionProgressListeners(skill) {
  const buttons = document.querySelectorAll('.syllabus-toggle');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-section-key');
      if (!key) {
        return;
      }

      toggleSectionCompleted(skill.id, key);
      markResourceCompleted('skills');
      renderSkillDetail(skill);
    });
  });
}

function renderSkillDetail(skill) {
  const detail = document.getElementById('skill-detail');
  if (!detail) {
    return;
  }

  if (!skill) {
    detail.innerHTML = `<p class="module-meta">${t('noResults')}</p>`;
    return;
  }

  const sectionKeys = ['overview', 'checklist', 'suggestions', 'improvements', 'playground', 'quickPlan'];
  const progress = getSectionProgress(skill.id, sectionKeys);

  detail.innerHTML = `
    <header>
      <h3>${skill.id} · ${skill.name}</h3>
      <p class="module-meta"><strong>${t('sectionProgressLabel')}:</strong> ${progress.completed}/${progress.total}</p>
      <p><strong>${t('category')}:</strong> ${t(`filters.${skill.category}`)}</p>
      <p><strong>${t('file')}:</strong> <code>${skill.file}</code></p>
      <p><strong>${t('purpose')}:</strong> ${skill.purpose}</p>
      <a class="module-link" href="${buildUrl('/lesson.html', language, { id: skill.lessonId })}">${t('openLesson')}</a>
    </header>

    ${renderSyllabusSection(
      skill.id,
      'overview',
      t('syllabusOverview'),
      `
        <h4>${t('whatItDoes')}</h4>
        <p>${skill.whatItDoes}</p>
        <h4>${t('whenToUse')}</h4>
        <p>${skill.whenToUse}</p>
        <h4>${t('pitfalls')}</h4>
        <p>${skill.pitfall}</p>
      `,
      true,
    )}

    ${renderSyllabusSection(skill.id, 'checklist', t('checklist'), renderList(skill.checklist || []))}
    ${renderSyllabusSection(skill.id, 'suggestions', t('suggestions'), renderList(skill.suggestions || []))}
    ${renderSyllabusSection(skill.id, 'improvements', t('improvements'), renderList(skill.improvements || []))}
    ${renderSyllabusSection(skill.id, 'playground', t('playground'), renderPlayground(skill.projectPlayground))}

    ${renderSyllabusSection(
      skill.id,
      'quickPlan',
      t('quickPlanTitle'),
      `
        <p>${t('quickPlanDescription')}</p>
        <label class="module-meta" for="project-type-select">${t('projectTypeLabel')}</label>
        <select id="project-type-select" class="language-select">
          <option value="api">${t('projectTypes.api')}</option>
          <option value="webapp">${t('projectTypes.webapp')}</option>
          <option value="data">${t('projectTypes.data')}</option>
          <option value="automation">${t('projectTypes.automation')}</option>
        </select>
        <div style="margin-top:0.6rem;">
          <button id="generate-quick-plan" type="button" class="secondary-button">${t('generatePlan')}</button>
        </div>
        <div id="quick-plan-output" class="lesson-section" style="margin-top:0.7rem;"></div>
      `,
    )}
  `;

  attachSectionProgressListeners(skill);
  attachQuickPlanListener(skill);
}

function createQuickPlan(skill, projectType) {
  const projectContext = {
    api: language === 'en' ? 'API endpoint or service contract' : 'endpoint API o contrato de servicio',
    webapp: language === 'en' ? 'user-facing screen or interaction flow' : 'pantalla o flujo de interacción de usuario',
    data: language === 'en' ? 'data pipeline, model, or analytics process' : 'pipeline de datos, modelo o proceso analítico',
    automation: language === 'en' ? 'automation script or operational task' : 'script de automatización o tarea operativa',
  };

  return [
    language === 'en'
      ? `Define the goal for the ${projectContext[projectType]} using ${skill.name}.`
      : `Define el objetivo para el ${projectContext[projectType]} usando ${skill.name}.`,
    language === 'en'
      ? `Apply this checklist first: ${skill.checklist.slice(0, 2).join(' · ')}.`
      : `Aplica primero este checklist: ${skill.checklist.slice(0, 2).join(' · ')}.`,
    language === 'en'
      ? `Guard against this common pitfall: ${skill.pitfall}`
      : `Protege contra este error común: ${skill.pitfall}`,
    language === 'en'
      ? `Use this improvement as next iteration: ${skill.improvements[0] || '-'}`
      : `Usa esta mejora para la siguiente iteración: ${skill.improvements[0] || '-'}`,
  ];
}

function attachQuickPlanListener(skill) {
  const button = document.getElementById('generate-quick-plan');
  const select = document.getElementById('project-type-select');
  const output = document.getElementById('quick-plan-output');

  if (!button || !select || !output) {
    return;
  }

  const renderOutput = () => {
    markResourceCompleted('skills');
    const planItems = createQuickPlan(skill, select.value);
    output.innerHTML = `
      <p><strong>${t('quickPlanOutput')}:</strong></p>
      <ol>${planItems.map((item) => `<li>${item}</li>`).join('')}</ol>
    `;
  };

  button.addEventListener('click', renderOutput);
  renderOutput();
}

function getFilteredSkills() {
  const byCategory = activeFilter === 'all'
    ? allSkills
    : allSkills.filter((skill) => skill.category === activeFilter);

  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return byCategory;
  }

  return byCategory.filter((skill) => {
    const searchable = [
      skill.id,
      skill.name,
      skill.category,
      skill.purpose,
      skill.pitfall,
      skill.whatItDoes,
      skill.whenToUse,
      ...(skill.checklist || []),
      ...(skill.suggestions || []),
      ...(skill.improvements || []),
      ...(skill.projectPlayground || []).flatMap((entry) => [entry.scenario, entry.tweak, entry.expectedImpact]),
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(query);
  });
}

function attachSearchListener() {
  const search = document.getElementById('skills-search');
  if (!search) {
    return;
  }

  search.addEventListener('input', (event) => {
    searchQuery = event.target.value || '';
    renderSkillMenu(getFilteredSkills());
  });
}

function renderFilterButtons() {
  const row = document.getElementById('skills-filter-row');
  if (!row) {
    return;
  }

  row.innerHTML = '';
  const filterKeys = ['all', 'planning', 'execution', 'quality'];

  filterKeys.forEach((key) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-chip ${activeFilter === key ? 'is-active' : ''}`;
    button.textContent = t(`filters.${key}`);

    button.addEventListener('click', () => {
      activeFilter = key;
      renderFilterButtons();
      renderSkillMenu(getFilteredSkills());
    });

    row.appendChild(button);
  });
}

applyStaticText();
applyLanguageSelector('language-switch', language);
renderFilterButtons();
attachSearchListener();

loadSkills().then((skills) => {
  allSkills = skills;
  renderSkillMenu(getFilteredSkills());
}).catch((error) => {
  const menu = document.getElementById('skills-menu');
  if (menu) {
    menu.innerHTML = `<p>${error.message}</p>`;
  }
  renderSkillDetail(null);
});
