const STORAGE_KEY = 'course-site-progress-v1';
const RESOURCE_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

function normalizeResourceProgress(value) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, status]) => Object.values(RESOURCE_STATUS).includes(status)),
  );
}

function normalizeProgress(value) {
  if (!value || typeof value !== 'object') {
    return { completedModules: [], passedQuizzes: [], resourceProgress: {} };
  }

  const completedModules = Array.isArray(value.completedModules) ? value.completedModules : [];
  const passedQuizzes = Array.isArray(value.passedQuizzes) ? value.passedQuizzes : [];
  const resourceProgress = normalizeResourceProgress(value.resourceProgress);

  const normalized = {
    completedModules: [...new Set(completedModules.filter((item) => typeof item === 'string'))],
    passedQuizzes: [...new Set(passedQuizzes.filter((item) => typeof item === 'string'))],
    resourceProgress,
  };

  if (normalized.completedModules.includes('m5')) {
    normalized.resourceProgress.mdSession = RESOURCE_STATUS.COMPLETED;
  }

  return normalized;
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { completedModules: [], passedQuizzes: [], resourceProgress: {} };
    }

    return normalizeProgress(JSON.parse(raw));
  } catch {
    return { completedModules: [], passedQuizzes: [], resourceProgress: {} };
  }
}

export function saveProgress(progress) {
  const normalized = normalizeProgress(progress);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function isCompleted(progress, moduleId) {
  const normalized = normalizeProgress(progress);
  return normalized.completedModules.includes(moduleId);
}

export function markCompleted(moduleId) {
  const current = loadProgress();
  if (!current.completedModules.includes(moduleId)) {
    current.completedModules.push(moduleId);
  }
  return saveProgress(current);
}

export function isQuizPassed(progress, moduleId) {
  const normalized = normalizeProgress(progress);
  return normalized.passedQuizzes.includes(moduleId);
}

export function markQuizPassed(moduleId) {
  const current = loadProgress();
  if (!current.passedQuizzes.includes(moduleId)) {
    current.passedQuizzes.push(moduleId);
  }
  return saveProgress(current);
}

export function getResourceStatus(progress, resourceId) {
  const normalized = normalizeProgress(progress);
  return normalized.resourceProgress[resourceId] || RESOURCE_STATUS.NOT_STARTED;
}

export function markResourceInProgress(resourceId) {
  const current = loadProgress();
  const currentStatus = getResourceStatus(current, resourceId);

  if (currentStatus === RESOURCE_STATUS.NOT_STARTED) {
    current.resourceProgress[resourceId] = RESOURCE_STATUS.IN_PROGRESS;
  }

  return saveProgress(current);
}

export function markResourceCompleted(resourceId) {
  const current = loadProgress();
  current.resourceProgress[resourceId] = RESOURCE_STATUS.COMPLETED;
  return saveProgress(current);
}

export function getProgressStats(modules, progress) {
  const normalized = normalizeProgress(progress);
  const total = modules.length;
  const completed = modules.filter((module) => normalized.completedModules.includes(module.id)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const quizzesPassed = modules.filter((module) => normalized.passedQuizzes.includes(module.id)).length;

  return { total, completed, percent, quizzesPassed };
}

export function getResourceProgressStats(progress) {
  const normalized = normalizeProgress(progress);
  const resourceIds = ['skills', 'glossary', 'mdSession', 'finalAssessment'];
  const completed = resourceIds.filter((id) => normalized.resourceProgress[id] === RESOURCE_STATUS.COMPLETED).length;
  const inProgress = resourceIds.filter((id) => normalized.resourceProgress[id] === RESOURCE_STATUS.IN_PROGRESS).length;
  const total = resourceIds.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, inProgress, percent };
}

export { RESOURCE_STATUS };
