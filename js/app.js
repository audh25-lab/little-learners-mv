// js/app.js — UI + Letters (font-first, PNG-preview fallback)
// Keeps things simple and accessible.

(() => {
  // Utilities
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Small "coming soon" for non-implemented features
  const showToast = (msg = 'Feature coming soon') => {
    const tpl = document.getElementById('toastTpl');
    if (!tpl) return alert(msg);
    const clone = tpl.content ? tpl.content.cloneNode(true) : tpl.cloneNode(true);
    const toast = clone.querySelector('.toast') || clone;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // Buttons on homepage that are placeholders
  const storiesBtn = document.getElementById('btn-stories');
  const cardStories = document.getElementById('card-stories');
  const cardActivities = document.getElementById('card-activities');
  const cardAbout = document.getElementById('card-about');

  [storiesBtn, cardStories, cardActivities, cardAbout].forEach(el => {
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Coming soon — Stories & Activities');
    });
  });

  // Letters page logic: create cards A-Z, show font letter by default,
  // if PNG exists at /assets/letters/{LETTER}.png show it in preview.
  const lettersGrid = document.getElementById('lettersGrid');
  const preview = document.getElementById('preview');
  const previewContent = document.getElementById('previewContent');
  const previewClose = document.getElementById('previewClose');

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  function createCard(letter) {
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = 'letter-card';
    wrap.setAttribute('aria-label', `Letter ${letter}`);
    wrap.innerHTML = `<div class="letter">${letter}</div>`;

    wrap.addEventListener('click', async () => {
      await openPreview(letter);
    });

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        wrap.click();
      }
    });

    return wrap;
  }

  function renderLetters(list) {
    if (!lettersGrid) return;
    lettersGrid.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach(letter => frag.appendChild(createCard(letter)));
    lettersGrid.appendChild(frag);
  }

  // Check for PNG existence by attempting to load; returns blob URL or null.
  async function tryLoadLetterImage(letter) {
    const path = `assets/letters/${letter}.png`;
    try {
      const resp = await fetch(path, { method: 'HEAD' });
      if (resp.ok) return path;
      // some hosts don't support HEAD properly — try GET fallback
      const getResp = await fetch(path);
      if (getResp.ok) return path;
    } catch (err) {
      return null;
    }
    return null;
  }

  // Open preview modal: show PNG if exists, otherwise large font letter
  async function openPreview(letter) {
    if (!preview || !previewContent) return;
    preview.setAttribute('aria-hidden', 'false');

    // show spinner while checking
    previewContent.innerHTML = `<div class="letter" aria-hidden="true">${letter}</div>`;

    // attempt to load image quickly
    const imgPath = await tryLoadLetterImage(letter);

    if (imgPath) {
      // show image
      previewContent.innerHTML = `<img src="${imgPath}" alt="Letter ${letter} image" />`;
    } else {
      // show big letter (font)
      previewContent.innerHTML = `<div class="letter" style="font-size:160px">${letter}</div>`;
    }

    // focus close button for accessibility
    if (previewClose) previewClose.focus();
  }

  function closePreview() {
    if (!preview) return;
    previewContent.innerHTML = '';
    preview.setAttribute('aria-hidden', 'true');
  }

  if (previewClose) {
    previewClose.addEventListener('click', closePreview);
  }

  // close on backdrop click
  if (preview) {
    preview.addEventListener('click', (e) => {
      if (e.target === preview) closePreview();
    });
  }

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePreview();
  });

  // Shuffle helper (Fisher–Yates)
  function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Shuffle button
  const shuffleBtn = document.getElementById('shuffle');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const s = shuffleArray([...alphabet]);
      renderLetters(s);
      shuffleBtn.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 240 });
    });
  }

  // Initial render when on Letters page
  if (lettersGrid) renderLetters(alphabet);

  // Service worker registration (optional)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        // ignore registration errors silently
      });
    });
  }
})();