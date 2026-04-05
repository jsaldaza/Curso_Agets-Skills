const LANGUAGE_STORAGE_KEY = 'course-site-language-v1';
const SUPPORTED_LANGUAGES = ['es', 'en'];

export const TEXT = {
  es: {
    home: {
      title: 'Aprende agentes AI por skills, desde cero',
      subtitle:
        'Una guía visual para personas con poca o nula experiencia en programación. Empieza básico, avanza con ejemplos reales de este repositorio y entiende el workflow completo.',
      startTour: 'Iniciar demo guiada',
      progressTitle: 'Tu progreso',
      routeTitle: 'Ruta de aprendizaje',
      roadmapTitle: 'Roadmap visual del curso',
      roadmapDescription:
        'Una línea de tiempo simple para saber dónde estás y qué desbloquea cada módulo.',
      assetsTitle: 'Recursos de estudio',
      assetsBadge: 'Centro de conocimiento',
      assetsDescription: 'Atajos para practicar y reforzar conceptos clave del curso desde un solo bloque.',
      hubProgressSummary: ({ completed, total, percent }) => `Completaste ${completed} de ${total} recursos (${percent}%).`,
      assetsRouteTitle: 'Ruta recomendada',
      assetsRouteDescription: 'Sigue este orden para entender primero el mapa, luego practicar y finalmente validar.',
      assetsRoute: [
        {
          title: 'Mapea el sistema',
          description: 'Usa el menú superior para ubicar capas y archivos clave del repositorio.',
        },
        {
          title: 'Practica con skills',
          description: 'Pasa al Skill Lab para aterrizar cómo se usa cada skill.',
        },
        {
          title: 'Aclara vocabulario',
          description: 'Usa glosario y sesión .md cuando necesites contexto fino.',
        },
        {
          title: 'Valida criterio',
          description: 'Cierra con la evaluación final para comprobar comprensión integrada.',
        },
      ],
      assetsLinks: {
        skills: {
          title: 'Skill Lab modular',
          description: 'Menú lateral por skill con detalle, checklist, mejoras y mini-planes por tipo de proyecto.',
          meta: 'Laboratorio práctico',
        },
        glossary: {
          title: 'Glosario bilingüe',
          description: 'Términos clave para comprender el workflow sin perderte en la jerga.',
          meta: 'Consulta rápida',
        },
        mdSession: {
          title: 'Sesión .md y comportamiento del chat',
          description: 'Entiende cómo el chat prioriza markdowns, reglas e instrucciones del repo.',
          meta: 'Jerarquía de instrucciones',
        },
        finalAssessment: {
          title: 'Evaluación final m3+m4+m5',
          description: 'Comprueba si ya integraste skills, testing, review y gobernanza .md.',
          meta: 'Cierre del recorrido',
        },
      },
      workflowTitle: 'Cómo interactúan los agentes',
      workflowDescription:
        'Este diagrama 2D resume el flujo oficial para construir software con menos retrabajo.',
      architectureTitle: 'Arquitectura completa del repositorio',
      architectureDescription:
        'Vista de capas para entender cómo se conectan gobernanza, agentes, runtime, aplicación del curso y validación.',
      architectureDiagramTitle: 'Diagrama de arquitectura',
      architectureRepoDocCta: 'Ver documento de arquitectura completo',
      architectureLayers: [
        {
          title: '1) Capa de gobierno (raíz)',
          description: 'Define reglas, jerarquías y políticas globales del sistema.',
        },
        {
          title: '2) Capa conceptual (.agents)',
          description: 'Modela roles, responsabilidades y protocolos (skills).',
        },
        {
          title: '3) Capa runtime (.codex)',
          description: 'Configura cómo se materializa la ejecución de agentes.',
        },
        {
          title: '4) Capa de producto (course-site)',
          description: 'UI, lógica y contenido pedagógico bilingüe del curso.',
        },
        {
          title: '5) Capa de validación y seguridad',
          description: 'Pruebas, checks automáticos y guardrails para proteger calidad.',
        },
      ],
      practicalTitle: 'Ejemplo práctico del repositorio',
      practicalSteps: [
        'Definir objetivo claro en lenguaje simple.',
        'Planificar validaciones antes de programar.',
        'Implementar cambios pequeños y verificables.',
        'Ejecutar pruebas y revisar riesgos.',
      ],
      footer: 'Hecho para enseñar AI Engineering de forma simple, visual y práctica.',
      progressSummary: ({ completed, total, percent, quizzesPassed }) =>
        `Completaste ${completed} de ${total} módulos (${percent}%) y aprobaste ${quizzesPassed} quizzes.`,
      moduleMeta: {
        level: 'Nivel',
        duration: 'Duración estimada',
        minutes: 'min',
        completed: '✅ Completado',
        pending: '🟡 Pendiente',
        quizApproved: '✅ aprobado',
        quizPending: '📝 pendiente',
        quizLabel: 'Quiz',
        openLesson: 'Abrir lección',
        milestone: 'Hito',
        durationShort: 'Duración',
        roadmapStatus: ({ completed, quizPassed }) =>
          `${completed ? 'Lección completada' : 'Lección pendiente'} · ${quizPassed ? 'Quiz aprobado' : 'Quiz pendiente'}`,
      },
      tour: {
        step1Title: 'Progreso general',
        step1Description: 'Aquí ves cuánto llevas del curso y cuántos quizzes aprobaste.',
        step2Title: 'Ruta de aprendizaje',
        step2Description: 'Estas tarjetas te llevan a cada módulo y muestran su estado actual.',
        step3Title: 'Centro de conocimiento',
        step3Description: 'Aquí tienes accesos directos para práctica, glosario y validación final.',
        step4Title: 'Workflow oficial',
        step4Description: 'Este diagrama explica cómo interactúan los agentes dentro del template.',
      },
    },
    lesson: {
      pageTitle: 'Lección • Curso de Agentes AI',
      backHome: '← Volver al inicio',
      badge: 'Lección guiada',
      startTour: 'Recorrido de esta lección',
      contentTitle: 'Contenido',
      quizTitle: 'Mini quiz',
      quizIntro: 'Comprueba si entendiste las ideas clave del módulo.',
      nextStepTitle: 'Tu siguiente paso',
      completionPending: 'Aún no marcas esta lección como completada.',
      completionDone: '✅ Esta lección ya está completada.',
      completionButtonPending: 'Marcar lección como completada',
      completionButtonDone: 'Lección completada',
      footer: 'Aprender AI paso a paso también es una skill 😄',
      quizNoData: 'Este módulo aún no tiene quiz. Volveremos con maldad pedagógica pronto 😄',
      quizPassedIntro: '✅ Ya aprobaste este quiz. Puedes repasar o seguir avanzando.',
      quizDefaultIntro: 'Responde el quiz para reforzar conceptos.',
      quizSubmit: 'Enviar respuestas',
      quizPassedButton: 'Quiz aprobado',
      quizSaved: 'Resultado guardado: aprobado.',
      quizPerfect: ({ correct, total }) => `✅ ¡Perfecto! Respondiste ${correct}/${total}.`,
      quizRetry: ({ correct, total }) =>
        `Aprobaste ${correct}/${total}. Revisa el módulo y vuelve a intentarlo.`,
      quizCorrectFeedback: (text) => `✅ Correcto. ${text}`,
      quizIncorrectFeedback: (text) => `❌ Aún no. ${text}`,
      feedbackFallback: 'Revisa la explicación del módulo para reforzar esta idea.',
      simulator: {
        fallbackTitle: 'Simulador',
        fallbackDescription: 'Avanza paso a paso para entender el flujo de trabajo.',
        previous: 'Paso anterior',
        next: 'Siguiente paso',
        stepMeta: ({ index, total }) => `Paso ${index} de ${total}`,
        output: 'Salida',
        noSteps: 'No hay pasos configurados para este simulador.',
      },
      navigation: {
        notFound: 'No se encontró la navegación para esta lección.',
        prevEmpty: '← No hay lección anterior',
        nextEmpty: 'No hay siguiente lección →',
      },
      errors: {
        lessonNotFound: 'No se encontró la lección para este módulo.',
        loadLessons: 'No se pudo cargar el contenido de lecciones',
        loadModules: 'No se pudo cargar la ruta del curso',
      },
      tour: {
        step1Title: 'Contenido principal',
        step1Description:
          'Aquí encuentras la explicación del módulo, diagramas y simuladores cuando apliquen.',
        step2Title: 'Mini quiz',
        step2Description: 'Usa este bloque para comprobar comprensión y recibir feedback inmediato.',
        step3Title: 'Cierre del módulo',
        step3Description: 'Marca la lección como completada y avanza al siguiente módulo desde aquí.',
        m2Title: 'Simulador interactivo',
        m2Description: 'Este módulo incluye un simulador paso a paso del workflow completo.',
      },
    },
    guide: {
      stepMeta: ({ current, total }) => `Paso ${current} de ${total}`,
      previous: 'Anterior',
      next: 'Siguiente',
      finish: 'Finalizar',
      close: 'Cerrar',
    },
    language: {
      label: 'Idioma',
      spanish: 'Español',
      english: 'English',
    },
  },
  en: {
    home: {
      title: 'Learn AI agents by skills, from zero',
      subtitle:
        'A visual guide for people with little or no programming experience. Start with the basics, move forward with real repository examples, and understand the full workflow.',
      startTour: 'Start guided demo',
      progressTitle: 'Your progress',
      routeTitle: 'Learning path',
      roadmapTitle: 'Visual course roadmap',
      roadmapDescription: 'A simple timeline to know where you are and what each module unlocks.',
      assetsTitle: 'Learning resources',
      assetsBadge: 'Knowledge hub',
      assetsDescription: 'Quick shortcuts to practice and reinforce key course concepts in one place.',
      hubProgressSummary: ({ completed, total, percent }) => `You completed ${completed} of ${total} resources (${percent}%).`,
      assetsRouteTitle: 'Recommended route',
      assetsRouteDescription: 'Follow this order to understand the map first, then practice, and finally validate.',
      assetsRoute: [
        {
          title: 'Map the system',
          description: 'Use the top menu to locate core repository layers and key files.',
        },
        {
          title: 'Practice with skills',
          description: 'Move to the Skill Lab to ground how each skill is used.',
        },
        {
          title: 'Clarify vocabulary',
          description: 'Use the glossary and .md session when you need finer context.',
        },
        {
          title: 'Validate judgment',
          description: 'Finish with the final assessment to confirm integrated understanding.',
        },
      ],
      assetsLinks: {
        skills: {
          title: 'Modular Skill Lab',
          description: 'Left-menu skill lab with details, checklists, improvements, and mini plans by project type.',
          meta: 'Practical lab',
        },
        glossary: {
          title: 'Bilingual glossary',
          description: 'Key terms to understand the workflow without getting lost in jargon.',
          meta: 'Quick reference',
        },
        mdSession: {
          title: '.md session and chat behavior',
          description: 'Understand how chat prioritizes markdowns, rules, and repository instructions.',
          meta: 'Instruction hierarchy',
        },
        finalAssessment: {
          title: 'Final assessment m3+m4+m5',
          description: 'Check whether you already integrated skills, testing, review, and .md governance.',
          meta: 'End-of-path check',
        },
      },
      workflowTitle: 'How agents interact',
      workflowDescription:
        'This 2D diagram summarizes the official flow for building software with less rework.',
      architectureTitle: 'Complete repository architecture',
      architectureDescription:
        'Layered view to understand how governance, agents, runtime, course application, and validation connect.',
      architectureDiagramTitle: 'Architecture diagram',
      architectureRepoDocCta: 'View full architecture document',
      architectureLayers: [
        {
          title: '1) Governance layer (root)',
          description: 'Defines global rules, priority hierarchy, and safety policies.',
        },
        {
          title: '2) Conceptual layer (.agents)',
          description: 'Models roles, responsibilities, and reusable skill protocols.',
        },
        {
          title: '3) Runtime layer (.codex)',
          description: 'Configures how agent execution is materialized in runtime.',
        },
        {
          title: '4) Product layer (course-site)',
          description: 'UI, logic, and bilingual educational content for learners.',
        },
        {
          title: '5) Validation and safety layer',
          description: 'Tests, automated checks, and guardrails that protect quality.',
        },
      ],
      practicalTitle: 'Practical repository example',
      practicalSteps: [
        'Define a clear goal in simple language.',
        'Plan validation before coding.',
        'Implement small, verifiable changes.',
        'Run tests and review risks.',
      ],
      footer: 'Built to teach AI Engineering in a simple, visual, practical way.',
      progressSummary: ({ completed, total, percent, quizzesPassed }) =>
        `You completed ${completed} of ${total} modules (${percent}%) and passed ${quizzesPassed} quizzes.`,
      moduleMeta: {
        level: 'Level',
        duration: 'Estimated duration',
        minutes: 'min',
        completed: '✅ Completed',
        pending: '🟡 Pending',
        quizApproved: '✅ passed',
        quizPending: '📝 pending',
        quizLabel: 'Quiz',
        openLesson: 'Open lesson',
        milestone: 'Milestone',
        durationShort: 'Duration',
        roadmapStatus: ({ completed, quizPassed }) =>
          `${completed ? 'Lesson completed' : 'Lesson pending'} · ${quizPassed ? 'Quiz passed' : 'Quiz pending'}`,
      },
      tour: {
        step1Title: 'Overall progress',
        step1Description: 'Here you can see course completion and how many quizzes you passed.',
        step2Title: 'Learning path',
        step2Description: 'These cards open each module and show its current status.',
        step3Title: 'Knowledge hub',
        step3Description: 'Use these direct links for practice, glossary lookup, and final validation.',
        step4Title: 'Official workflow',
        step4Description: 'This diagram explains how agents interact in the template.',
      },
    },
    lesson: {
      pageTitle: 'Lesson • AI Agents Course',
      backHome: '← Back to home',
      badge: 'Guided lesson',
      startTour: 'Lesson walkthrough',
      contentTitle: 'Content',
      quizTitle: 'Mini quiz',
      quizIntro: 'Check whether you understood the key ideas of this module.',
      nextStepTitle: 'Your next step',
      completionPending: 'You have not marked this lesson as completed yet.',
      completionDone: '✅ This lesson is already completed.',
      completionButtonPending: 'Mark lesson as completed',
      completionButtonDone: 'Lesson completed',
      footer: 'Learning AI step by step is a skill too 😄',
      quizNoData: 'This module has no quiz yet. We will be back soon 😄',
      quizPassedIntro: '✅ You already passed this quiz. You can review or keep moving.',
      quizDefaultIntro: 'Answer the quiz to reinforce concepts.',
      quizSubmit: 'Submit answers',
      quizPassedButton: 'Quiz passed',
      quizSaved: 'Saved result: passed.',
      quizPerfect: ({ correct, total }) => `✅ Perfect! You answered ${correct}/${total}.`,
      quizRetry: ({ correct, total }) => `You got ${correct}/${total}. Review the module and try again.`,
      quizCorrectFeedback: (text) => `✅ Correct. ${text}`,
      quizIncorrectFeedback: (text) => `❌ Not yet. ${text}`,
      feedbackFallback: 'Review the module explanation to reinforce this concept.',
      simulator: {
        fallbackTitle: 'Simulator',
        fallbackDescription: 'Move step by step to understand the workflow.',
        previous: 'Previous step',
        next: 'Next step',
        stepMeta: ({ index, total }) => `Step ${index} of ${total}`,
        output: 'Output',
        noSteps: 'No steps are configured for this simulator.',
      },
      navigation: {
        notFound: 'Navigation could not be generated for this lesson.',
        prevEmpty: '← No previous lesson',
        nextEmpty: 'No next lesson →',
      },
      errors: {
        lessonNotFound: 'Lesson was not found for this module.',
        loadLessons: 'Could not load lessons content',
        loadModules: 'Could not load course path',
      },
      tour: {
        step1Title: 'Main content',
        step1Description: 'You will find explanations, diagrams, and simulators when applicable.',
        step2Title: 'Mini quiz',
        step2Description: 'Use this section to check understanding with immediate feedback.',
        step3Title: 'Module closure',
        step3Description: 'Mark the lesson as completed and move to the next module.',
        m2Title: 'Interactive simulator',
        m2Description: 'This module includes a step-by-step workflow simulator.',
      },
    },
    guide: {
      stepMeta: ({ current, total }) => `Step ${current} of ${total}`,
      previous: 'Previous',
      next: 'Next',
      finish: 'Finish',
      close: 'Close',
    },
    language: {
      label: 'Language',
      spanish: 'Español',
      english: 'English',
    },
  },
};

export function normalizeLanguage(input) {
  return SUPPORTED_LANGUAGES.includes(input) ? input : 'es';
}

export function getCurrentLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('lang');
  if (SUPPORTED_LANGUAGES.includes(fromQuery)) {
    return fromQuery;
  }

  const fromStorage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.includes(fromStorage)) {
    return fromStorage;
  }

  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function setLanguagePreference(language) {
  const normalized = normalizeLanguage(language);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  return normalized;
}

export function updateCurrentUrlLanguage(language) {
  const normalized = normalizeLanguage(language);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', normalized);
  return url.toString();
}

export function buildUrl(pathname, language, extraParams = {}) {
  const normalized = normalizeLanguage(language);
  const url = new URL(pathname, window.location.origin);
  url.searchParams.set('lang', normalized);

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return `${url.pathname}${url.search}`;
}

export function applyLanguageSelector(selectId, language) {
  const select = document.getElementById(selectId);
  if (!select) {
    return;
  }

  select.value = normalizeLanguage(language);
  select.addEventListener('change', () => {
    const normalized = setLanguagePreference(select.value);
    window.location.href = updateCurrentUrlLanguage(normalized);
  });
}

export function t(language, path, payload) {
  const normalized = normalizeLanguage(language);
  const parts = path.split('.');

  let value = TEXT[normalized];
  for (const part of parts) {
    value = value?.[part];
  }

  if (typeof value === 'function') {
    return value(payload || {});
  }

  return value ?? path;
}
