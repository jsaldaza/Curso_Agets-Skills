function clearHighlights() {
  document.querySelectorAll('.tour-highlight').forEach((element) => {
    element.classList.remove('tour-highlight');
  });
}

export function initializeGuide({ triggerId, steps = [] }) {
  const trigger = document.getElementById(triggerId);
  if (!trigger) {
    return;
  }

  let overlay;
  let card;
  let currentIndex = 0;

  function closeGuide() {
    clearHighlights();
    overlay?.remove();
    overlay = null;
    card = null;
  }

  function renderStep() {
    if (!overlay || !card || steps.length === 0) {
      return;
    }

    clearHighlights();
    const step = steps[currentIndex];
    const target = step.selector ? document.querySelector(step.selector) : null;

    if (target) {
      target.classList.add('tour-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const labels = step.labels || {};
    const stepMeta = labels.stepMeta || `Paso ${currentIndex + 1} de ${steps.length}`;
    const previousText = labels.previous || 'Anterior';
    const nextText = labels.next || 'Siguiente';
    const finishText = labels.finish || 'Finalizar';
    const closeText = labels.close || 'Cerrar';

    card.innerHTML = `
      <p class="tour-step-meta">${stepMeta}</p>
      <h3>${step.title}</h3>
      <p>${step.description}</p>
      <div class="tour-actions">
        <button type="button" class="secondary-button" data-guide-action="prev">${previousText}</button>
        <button type="button" class="primary-button" data-guide-action="next">${currentIndex === steps.length - 1 ? finishText : nextText}</button>
        <button type="button" class="secondary-button" data-guide-action="close">${closeText}</button>
      </div>
    `;

    const prev = card.querySelector('[data-guide-action="prev"]');
    const next = card.querySelector('[data-guide-action="next"]');
    const close = card.querySelector('[data-guide-action="close"]');

    if (prev) {
      prev.disabled = currentIndex === 0;
      prev.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex -= 1;
          renderStep();
        }
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        if (currentIndex === steps.length - 1) {
          closeGuide();
          return;
        }

        currentIndex += 1;
        renderStep();
      });
    }

    close?.addEventListener('click', closeGuide);
  }

  trigger.addEventListener('click', () => {
    if (steps.length === 0) {
      return;
    }

    closeGuide();
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';

    card = document.createElement('aside');
    card.className = 'tour-card';

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    currentIndex = 0;
    renderStep();
  });
}
