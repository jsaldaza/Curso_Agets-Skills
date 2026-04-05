import { markResourceCompleted, markResourceInProgress } from './progress.js';
import { applyLanguageSelector, buildUrl, getCurrentLanguage, setLanguagePreference } from './lang.js';

const language = setLanguagePreference(getCurrentLanguage());
markResourceInProgress('repoExplorer');

const TEXT = {
  es: {
    pageTitle: 'Explorador del repositorio',
    badge: 'Explorador del repositorio',
    title: 'Mapa navegable del conocimiento del repo',
    subtitle: 'Explora .agents, .codex y los markdowns raíz con una estructura incremental y explicaciones prácticas.',
    sectionTitle: 'Árbol del repositorio',
    footer: 'Entender la estructura del repo acelera el onboarding y evita errores de interpretación.',
    backHome: '← Volver al inicio',
    languageLabel: 'Idioma',
    treeLabel: 'Árbol del repositorio',
    whatItIs: 'Qué es',
    whenToRead: 'Cuándo leerlo',
    whyItMatters: 'Por qué importa',
    commonMistakes: 'Errores comunes',
    empty: 'Selecciona un nodo del árbol para ver el detalle.',
  },
  en: {
    pageTitle: 'Repository explorer',
    badge: 'Repository explorer',
    title: 'Navigable map of repository knowledge',
    subtitle: 'Explore .agents, .codex, and root markdowns through an incremental structure with practical explanations.',
    sectionTitle: 'Repository tree',
    footer: 'Understanding repository structure accelerates onboarding and reduces interpretation mistakes.',
    backHome: '← Back to home',
    languageLabel: 'Language',
    treeLabel: 'Repository tree',
    whatItIs: 'What it is',
    whenToRead: 'When to read it',
    whyItMatters: 'Why it matters',
    commonMistakes: 'Common mistakes',
    empty: 'Select a tree node to view details.',
  },
};

let groups = [];
let activeItemId = null;

function t(key) {
  return TEXT[language][key];
}

async function loadExplorer() {
  const file = language === 'en' ? '/content/repo-explorer.en.json' : '/content/repo-explorer.json';
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error('Unable to load repository explorer');
  }
  return response.json();
}

function applyStaticText() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');

  const mappings = [
    ['repo-badge', 'badge'],
    ['repo-title', 'title'],
    ['repo-subtitle', 'subtitle'],
    ['repo-section-title', 'sectionTitle'],
    ['repo-footer', 'footer'],
    ['repo-back-home', 'backHome'],
    ['language-label', 'languageLabel'],
  ];

  mappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(key);
    }
  });

  const home = document.getElementById('repo-back-home');
  if (home) {
    home.href = buildUrl('/index.html', language);
  }

  const tree = document.getElementById('repo-tree');
  if (tree) {
    tree.setAttribute('aria-label', t('treeLabel'));
  }
}

function renderDetail(item) {
  const detail = document.getElementById('repo-detail');
  if (!detail) {
    return;
  }

  if (!item) {
    detail.innerHTML = `<p class="module-meta">${t('empty')}</p>`;
    return;
  }

  detail.innerHTML = `
    <header>
      <h3>${item.label}</h3>
      <p class="module-meta"><code>${item.path}</code></p>
    </header>
    <section class="lesson-section">
      <h4>${t('whatItIs')}</h4>
      <p>${item.whatItIs}</p>
      <h4>${t('whenToRead')}</h4>
      <p>${item.whenToRead}</p>
      <h4>${t('whyItMatters')}</h4>
      <p>${item.whyItMatters}</p>
    </section>
    <section class="lesson-section">
      <h4>${t('commonMistakes')}</h4>
      <ul>${(item.commonMistakes || []).map((mistake) => `<li>${mistake}</li>`).join('')}</ul>
    </section>
  `;
}

function renderTree() {
  const tree = document.getElementById('repo-tree');
  if (!tree) {
    return;
  }

  tree.innerHTML = '';

  const allItems = groups.flatMap((group) => group.items);
  if (!activeItemId && allItems.length > 0) {
    activeItemId = allItems[0].id;
  }

  groups.forEach((group) => {
    const wrapper = document.createElement('details');
    wrapper.className = 'repo-tree-group';
    wrapper.open = true;

    const summary = document.createElement('summary');
    summary.innerHTML = `<strong>${group.title}</strong><br><span class="module-meta">${group.description}</span>`;
    wrapper.appendChild(summary);

    const list = document.createElement('div');
    list.className = 'repo-tree-items';

    group.items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `repo-tree-item ${activeItemId === item.id ? 'is-active' : ''}`;
      button.textContent = item.label;
      button.addEventListener('click', () => {
        activeItemId = item.id;
        markResourceCompleted('repoExplorer');
        renderTree();
        renderDetail(item);
      });
      list.appendChild(button);
    });

    wrapper.appendChild(list);
    tree.appendChild(wrapper);
  });

  renderDetail(allItems.find((item) => item.id === activeItemId));
}

applyStaticText();
applyLanguageSelector('language-switch', language);

loadExplorer()
  .then((data) => {
    groups = data.groups || [];
    renderTree();
  })
  .catch((error) => {
    const detail = document.getElementById('repo-detail');
    if (detail) {
      detail.innerHTML = `<p>${error.message}</p>`;
    }
  });
