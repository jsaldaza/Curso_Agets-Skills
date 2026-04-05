import { markResourceCompleted, markResourceInProgress } from './progress.js';
import { applyLanguageSelector, buildUrl, getCurrentLanguage, setLanguagePreference } from './lang.js';

const language = setLanguagePreference(getCurrentLanguage());
markResourceInProgress('finalAssessment');

const TEXT = {
  es: {
    pageTitle: 'Evaluación final · Skill Labs m3+m4+m5',
    badge: 'Evaluación final',
    title: 'Evaluación final · Skill Labs m3+m4+m5',
    subtitle: 'Valida comprensión integrada de planificación, quality gates y gobernanza .md.',
    quizTitle: 'Quiz integrador',
    footer: 'Cierre de curso: demuestra criterio, no solo memoria.',
    backHome: '← Volver al inicio',
    languageLabel: 'Idioma',
    moduleLabel: 'Módulo',
    submit: 'Calificar evaluación',
    perfect: ({ score, total }) => `✅ Excelente: ${score}/${total}. ¡Dominas el workflow!`,
    pass: ({ score, total }) => `✅ Aprobaste: ${score}/${total}. Muy buen criterio técnico.`,
    fail: ({ score, total }) => `🟡 Resultado: ${score}/${total}. Revisa m3, m4 y m5 para consolidar ideas.`,
    feedbackCorrect: (text) => `✅ Correcto. ${text}`,
    feedbackIncorrect: (text) => `❌ No aún. ${text}`,
  },
  en: {
    pageTitle: 'Final assessment · Skill Labs m3+m4+m5',
    badge: 'Final assessment',
    title: 'Final assessment · Skill Labs m3+m4+m5',
    subtitle: 'Validate integrated understanding of planning, quality gates, and .md governance.',
    quizTitle: 'Integrated quiz',
    footer: 'Course closure: demonstrate judgment, not only memory.',
    backHome: '← Back to home',
    languageLabel: 'Language',
    moduleLabel: 'Module',
    submit: 'Grade assessment',
    perfect: ({ score, total }) => `✅ Excellent: ${score}/${total}. You own the workflow!`,
    pass: ({ score, total }) => `✅ Passed: ${score}/${total}. Strong technical judgment.`,
    fail: ({ score, total }) => `🟡 Score: ${score}/${total}. Review m3, m4, and m5 to reinforce concepts.`,
    feedbackCorrect: (text) => `✅ Correct. ${text}`,
    feedbackIncorrect: (text) => `❌ Not yet. ${text}`,
  },
};

function t(key, payload = {}) {
  const value = TEXT[language][key];
  return typeof value === 'function' ? value(payload) : value;
}

async function loadAssessment() {
  const file = language === 'en' ? '/content/final-assessment.en.json' : '/content/final-assessment.json';
  const response = await fetch(file);

  if (!response.ok) {
    throw new Error('Unable to load final assessment');
  }

  return response.json();
}

function applyStaticText() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');

  const mappings = [
    ['assessment-badge', 'badge'],
    ['assessment-title', 'title'],
    ['assessment-subtitle', 'subtitle'],
    ['assessment-quiz-title', 'quizTitle'],
    ['assessment-footer', 'footer'],
    ['assessment-back-home', 'backHome'],
    ['language-label', 'languageLabel'],
  ];

  mappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(key);
    }
  });

  const home = document.getElementById('assessment-back-home');
  if (home) {
    home.href = buildUrl('/index.html', language);
  }
}

function renderAssessment(data) {
  const form = document.getElementById('assessment-form');
  const description = document.getElementById('assessment-description');

  if (!form || !description) {
    return;
  }

  description.textContent = data.description;

  const questionsHtml = data.questions
    .map((question, questionIndex) => {
      const optionsHtml = question.options
        .map(
          (option, optionIndex) => `
            <label class="quiz-option">
              <input type="radio" name="q${questionIndex}" value="${optionIndex}" />
              <span>${option}</span>
            </label>
          `,
        )
        .join('');

      return `
        <fieldset class="quiz-question" data-question-index="${questionIndex}">
          <legend>${questionIndex + 1}. <span class="module-meta">${t('moduleLabel')} ${question.module}</span> · ${question.prompt}</legend>
          ${optionsHtml}
          <p class="quiz-feedback" data-feedback-index="${questionIndex}"></p>
        </fieldset>
      `;
    })
    .join('');

  form.innerHTML = `
    ${questionsHtml}
    <div class="quiz-actions">
      <button type="submit" class="primary-button">${t('submit')}</button>
      <p id="assessment-result" class="quiz-result"></p>
    </div>
  `;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let score = 0;

    data.questions.forEach((question, questionIndex) => {
      const selected = form.querySelector(`input[name="q${questionIndex}"]:checked`);
      const feedback = form.querySelector(`[data-feedback-index="${questionIndex}"]`);

      if (!feedback) {
        return;
      }

      const selectedIndex = selected ? Number(selected.value) : -1;
      const isCorrect = selectedIndex === question.correctIndex;

      if (isCorrect) {
        score += 1;
      }

      feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.textContent = isCorrect
        ? t('feedbackCorrect', question.explanation)
        : t('feedbackIncorrect', question.explanation);
    });

    const result = document.getElementById('assessment-result');
    if (!result) {
      return;
    }

    if (score === data.questions.length) {
      markResourceCompleted('finalAssessment');
      result.textContent = t('perfect', { score, total: data.questions.length });
      return;
    }

    if (score >= data.passScore) {
      markResourceCompleted('finalAssessment');
      result.textContent = t('pass', { score, total: data.questions.length });
      return;
    }

    result.textContent = t('fail', { score, total: data.questions.length });
  });
}

applyStaticText();
applyLanguageSelector('language-switch', language);

loadAssessment().then(renderAssessment).catch((error) => {
  const form = document.getElementById('assessment-form');
  if (form) {
    form.innerHTML = `<p>${error.message}</p>`;
  }
});
