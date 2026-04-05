import { markResourceCompleted, markResourceInProgress } from './progress.js';
import { applyLanguageSelector, buildUrl, getCurrentLanguage, setLanguagePreference } from './lang.js';

const language = setLanguagePreference(getCurrentLanguage());
markResourceInProgress('glossary');

const TEXT = {
  es: {
    pageTitle: 'Glosario bilingüe del workflow',
    badge: 'Glosario',
    title: 'Glosario bilingüe del workflow',
    subtitle: 'Términos clave para entender prompts, validación, testing y revisión con lenguaje claro.',
    listTitle: 'Términos',
    footer: 'Entender el vocabulario acelera el aprendizaje técnico.',
    backHome: '← Volver al inicio',
    languageLabel: 'Idioma',
    term: 'Término',
    definition: 'Definición',
    searchPlaceholder: 'Buscar término o definición',
    searchAria: 'Buscar término',
    noResults: 'No hay términos que coincidan con tu búsqueda.',
  },
  en: {
    pageTitle: 'Bilingual workflow glossary',
    badge: 'Glossary',
    title: 'Bilingual workflow glossary',
    subtitle: 'Key terms to understand prompts, validation, testing, and review in plain language.',
    listTitle: 'Terms',
    footer: 'Understanding vocabulary accelerates technical learning.',
    backHome: '← Back to home',
    languageLabel: 'Language',
    term: 'Term',
    definition: 'Definition',
    searchPlaceholder: 'Search term or definition',
    searchAria: 'Search term',
    noResults: 'No glossary terms match your search.',
  },
};

let glossaryEntries = [];

function t(key) {
  return TEXT[language][key];
}

async function loadGlossary() {
  const contentFile = language === 'en' ? '/content/glossary.en.json' : '/content/glossary.json';
  const response = await fetch(contentFile);
  if (!response.ok) {
    throw new Error('Unable to load glossary');
  }
  return response.json();
}

function applyStaticText() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');

  const mappings = [
    ['glossary-badge', 'badge'],
    ['glossary-title', 'title'],
    ['glossary-subtitle', 'subtitle'],
    ['glossary-list-title', 'listTitle'],
    ['glossary-footer', 'footer'],
    ['glossary-back-home', 'backHome'],
    ['language-label', 'languageLabel'],
  ];

  mappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(key);
    }
  });

  const home = document.getElementById('glossary-back-home');
  if (home) {
    home.href = buildUrl('/index.html', language);
  }

  const search = document.getElementById('glossary-search');
  if (search) {
    search.placeholder = t('searchPlaceholder');
    search.setAttribute('aria-label', t('searchAria'));
  }
}

function renderGlossary(entries) {
  const container = document.getElementById('glossary-list');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!entries.length) {
    container.innerHTML = `<p class="module-meta">${t('noResults')}</p>`;
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement('article');
    item.className = 'glossary-entry';

    item.innerHTML = `
      <p class="glossary-term">${entry.term}</p>
      <p class="glossary-definition">${entry.definition}</p>
    `;

    container.appendChild(item);
  });
}

function filterGlossary(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    renderGlossary(glossaryEntries);
    return;
  }

  const filtered = glossaryEntries.filter((entry) => {
    const haystack = `${entry.term} ${entry.definition}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  renderGlossary(filtered);
}

function attachSearchListener() {
  const search = document.getElementById('glossary-search');
  if (!search) {
    return;
  }

  search.addEventListener('input', (event) => {
    const query = event.target.value || '';
    if (query.trim()) {
      markResourceCompleted('glossary');
    }
    filterGlossary(query);
  });
}

applyStaticText();
applyLanguageSelector('language-switch', language);
attachSearchListener();

loadGlossary().then((entries) => {
  glossaryEntries = entries;
  renderGlossary(glossaryEntries);
}).catch((error) => {
  const container = document.getElementById('glossary-list');
  if (container) {
    container.innerHTML = `<p>${error.message}</p>`;
  }
});
