/* Trajectoire V2 — application client : aucune clé, aucun envoi de données. */
(() => {
  'use strict';
  const E = window.TrajectoireEngine;
  const STORAGE_KEY = 'trajectoire.v2.plan';
  const $ = id => document.getElementById(id);
  let plan = null;
  let activeView = 'overview';
  let toastTimer;

  const escapeHTML = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const fmt = text => escapeHTML(text);
  function safeUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '#';
    } catch { return '#'; }
  }
  function notify(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3700);
  }
  function validatePlan(value) {
    return !!(value && value.schema === 2 && value.profile &&
      typeof value.profile.goal === 'string' && value.profile.goal.length < 250 &&
      Array.isArray(value.weeks) && value.weeks.length >= 1 && value.weeks.length <= 120 &&
      value.weeks.every(w => Array.isArray(w.tasks) && w.tasks.length <= 5 && w.tasks.every(t =>
        typeof t.id === 'string' && typeof t.title === 'string' && typeof t.completed === 'boolean')) &&
      Array.isArray(value.resources) && value.resources.length <= 30 &&
      Array.isArray(value.milestones) && Array.isArray(value.alerts));
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      notify('Stockage local indisponible. Exporte une sauvegarde JSON.');
    }
  }
  function restore() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (validatePlan(raw)) plan = raw;
    } catch { /* les anciennes sauvegardes ne cassent pas l'application */ }
  }
  function selectView(view) {
    if (!plan) {
      notify('Crée ton objectif pour accéder à ton espace.');
      $('goal').focus();
      return;
    }
    activeView = ['overview', 'roadmap', 'resources', 'book'].includes(view) ? view : 'overview';
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const selected = btn.dataset.view === activeView;
      btn.classList.toggle('current', selected);
      if (selected) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    document.querySelectorAll('.panel-view').forEach(el => { el.hidden = el.id !== 'view-' + activeView; });
    if (activeView === 'book') renderBook();
    if (activeView === 'roadmap') renderRoadmap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function showWorkspace() {
    $('setup').hidden = !!plan;
    $('workspace').hidden = !plan;
    if (!plan) return;
    renderAll();
  }
  function taskCard(task, week) {
    const isLate = !task.completed && week.dueDate < new Date().toISOString().slice(0,10);
    return `<label class="task-row ${task.completed ? 'done' : ''}">
      <input type="checkbox" data-task="${fmt(task.id)}" ${task.completed ? 'checked' : ''} aria-label="Marquer ${fmt(task.title)} comme terminée">
      <span class="task-copy"><strong>${fmt(task.title)}</strong><p>${fmt(task.description)}</p>
      <small>Preuve : ${fmt(task.evidence)} · ${fmt(task.estimatedHours)} h · Semaine ${fmt(week.number)} ${isLate ? '<span class="warning">· Échéance dépassée</span>' : ''}</small></span>
    </label>`;
  }
  function renderSummary() {
    $('dash-title').textContent = plan.profile.goal;
    $('dash-subtitle').textContent = plan.track + ' · ' + plan.profile.months + ' mois · ' + plan.profile.hoursPerWeek + ' h / semaine';
    const c = E.completion(plan);
    $('metric-progress').textContent = c.percent + ' %';
    $('progress-fill').style.width = c.percent + '%';
    $('metric-done').textContent = c.done + ' / ' + c.total;
    $('metric-hours').textContent = plan.totalHours + ' h';
    $('metric-revision').textContent = 'v' + plan.revision;
    $('review-hours').value = plan.profile.hoursPerWeek;
    $('revision-date').textContent = 'Mise à jour ' + new Date(plan.updatedAt).toLocaleDateString('fr-FR');
    const actions = E.nextActions(plan, 3);
    $('next-actions').innerHTML = actions.length ? actions.map(t => {
      const week = plan.weeks.find(w => w.number === t.week);
      return taskCard(t, week);
    }).join('') : '<p>Bravo ! Toutes les actions du parcours sont cochées. Réévalue tes acquis et prépare la suite.</p>';
    $('plan-insights').innerHTML = plan.alerts.length ?
      plan.alerts.map(a => '<div class="insight">' + fmt(a) + '</div>').join('') :
      '<div class="insight">Le rythme prévu est une estimation, à ajuster selon tes résultats réels.</div>';
    $('milestones').innerHTML = plan.milestones.map(m =>
      '<div class="milestone"><span>SEMAINE ' + fmt(m.week) + '</span><strong>' + fmt(m.title) + '</strong></div>'
    ).join('');
  }
  function renderRoadmap() {
    if (!plan) return;
    const filter = $('week-filter').value;
    let weeks = plan.weeks;
    if (filter === 'next') {
      const start = weeks.findIndex(w => w.tasks.some(t => !t.completed));
      weeks = start < 0 ? [] : weeks.slice(start, start + 4);
    } else if (filter === 'incomplete') {
      weeks = weeks.filter(w => w.tasks.some(t => !t.completed));
    }
    $('roadmap-list').innerHTML = weeks.length ? weeks.map(w => `
      <article class="week-card">
        <div class="week-header"><div><span>SEMAINE ${fmt(w.number)}</span><h3>${fmt(w.phase)}</h3><small>Échéance indicative : ${fmt(w.dueDate)}</small></div>
        <span class="tag">${w.tasks.filter(t => t.completed).length} / ${w.tasks.length} terminées</span></div>
        ${w.tasks.map(t => taskCard(t,w)).join('')}
      </article>`).join('') : '<div class="surface">Il n’y a pas d’action à afficher avec ce filtre.</div>';
  }
  function renderResources() {
    $('resource-list').innerHTML = plan.resources.map(r => `
      <article class="resource-card"><span class="resource-type">${fmt(r.type)} · ACCÈS GRATUIT À VÉRIFIER</span>
      <h3>${fmt(r.title)}</h3><p>${fmt(r.why)}</p>
      <a href="${fmt(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">Ouvrir la ressource ↗</a></article>`).join('');
    $('catalog-note').textContent = 'Catalogue éditorial : ' + plan.catalogVersion +
      '. Les liens ne sont pas vérifiés automatiquement. Des contenus tiers peuvent évoluer ou proposer des options payantes.';
  }
  function renderBook() {
    if (!plan) return;
    const c = E.completion(plan);
    const p = plan.profile;
    $('book-preview').innerHTML = `
      <header class="cover"><span>TRAJECTOIRE · MON CARNET PERSONNALISÉ</span>
        <h2>${fmt(p.goal)}</h2><p>Édition n° ${fmt(plan.revision)} · ${fmt(plan.updatedAt.slice(0,10))} · ${fmt(plan.track)}</p>
        <p>Un programme de ${fmt(p.months)} mois, conçu pour ${fmt(p.hoursPerWeek)} h par semaine.</p></header>
      <section><h3>01. Mon point de départ</h3><p><strong>Niveau :</strong> ${fmt(p.level)} · <strong>Situation :</strong> ${fmt(p.situation || "autre")} · <strong>Âge :</strong> ${fmt(p.age)} · <strong>Budget :</strong> ${fmt(p.budget)} €</p>
        <p><strong>Compétences :</strong> ${fmt(p.skills || 'Non renseignées')}<br><strong>Contraintes :</strong> ${fmt(p.constraints || 'Non renseignées')}</p></section>
      <section><h3>02. Ma progression</h3><p><strong>${c.done} actions sur ${c.total}</strong> terminées, soit ${c.percent} % de la feuille de route.</p></section>
      <section><h3>03. Points de vigilance</h3>${plan.alerts.map(a => '<p class="book-note">' + fmt(a) + '</p>').join('') || '<p>Réévalue régulièrement ton temps disponible et la difficulté des actions.</p>'}</section>
      <section><h3>04. Le programme semaine par semaine</h3>
        ${plan.weeks.map(w => '<h4>Semaine ' + fmt(w.number) + ' · ' + fmt(w.phase) + ' · ' + fmt(w.dueDate) + '</h4>' +
          w.tasks.map(t => '<div class="book-task"><span>' + (t.completed ? '☑' : '☐') + '</span><div><strong>' +
            fmt(t.title) + '</strong> — ' + fmt(t.description) + '<br><small>Preuve : ' + fmt(t.evidence) + '</small></div></div>').join('')).join('')}
      </section>
      ${Array.isArray(plan.checkins) && plan.checkins.length ? '<section><h3>Bilans de progression</h3>' +
        plan.checkins.map(c => '<p><strong>' + fmt(c.date) + '</strong> · ' + fmt(c.hoursPerWeek) +
        ' h/semaine · ' + fmt(c.obstacle || 'Aucun obstacle renseigné') + '</p>').join('') + '</section>' : ''}
      <section><h3>05. Jalons à atteindre</h3><ul>${plan.milestones.map(m =>
        '<li>Semaine ' + fmt(m.week) + ' : ' + fmt(m.title) + '</li>').join('')}</ul></section>
      <section><h3>06. Ressources pour avancer</h3><ul>${plan.resources.map(r =>
        '<li><a href="' + fmt(safeUrl(r.url)) + '">' + fmt(r.title) + '</a> — ' + fmt(r.why) + '</li>').join('')}</ul></section>
      <p><small>${fmt(plan.note)} Catalogue mis à jour éditorialement le ${fmt(plan.catalogVersion)}. Le document reflète tes actions enregistrées, pas des informations Web en direct.</small></p>`;
  }
  function renderAll() {
    renderSummary();
    renderResources();
    renderRoadmap();
    if (activeView === 'book') renderBook();
    selectView(activeView);
  }
  function saveFile(text, filename, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $('profile-form').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      if (data.track === 'auto') delete data.track;
      const fresh = E.buildPlan(data);
      if (plan && !window.confirm('Remplacer le plan actuel ? Exporte une sauvegarde pour conserver ton suivi.')) return;
      plan = fresh;
      persist();
      activeView = 'overview';
      showWorkspace();
      notify('Parcours créé. Ta première action est prête !');
    } catch (error) { notify(error.message || 'Impossible de créer le plan.'); }
  });
  $('new-goal').addEventListener('click', () => {
    if (plan && !window.confirm('Créer un autre parcours ? Pense à sauvegarder ton plan actuel en JSON.')) return;
    plan = null;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    $('workspace').hidden = true;
    $('setup').hidden = false;
    $('goal').focus();
  });
  document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => selectView(el.dataset.view)));
  document.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', () => selectView(el.dataset.goto)));
  document.addEventListener('change', event => {
    const target = event.target;
    if (!plan || !target || !target.matches('[data-task]')) return;
    try {
      plan = E.toggle(plan, target.dataset.task, target.checked);
      persist();
      renderAll();
      notify(target.checked ? 'Une preuve de plus. Ebook actualisé !' : 'Action réouverte. Le carnet est actualisé.');
    } catch (error) { notify(error.message || 'Erreur de mise à jour.'); }
  });
  $('review-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!plan) return;
    const hours = $('review-hours').value;
    const obstacle = $('review-obstacle').value;
    try {
      plan = E.review(plan, hours, obstacle);
      persist();
      $('review-obstacle').value = '';
      renderAll();
      notify('Échéances adaptées. Ton ebook est passé en version ' + plan.revision + '.');
    } catch (error) { notify(error.message || 'Révision impossible.'); }
  });
  $('week-filter').addEventListener('change', renderRoadmap);
  $('backup-btn').addEventListener('click', () => {
    if (!plan) return;
    saveFile(JSON.stringify(plan,null,2), 'trajectoire-sauvegarde-v' + plan.revision + '.json', 'application/json;charset=utf-8');
    notify('Sauvegarde exportée : conserve ce fichier en lieu sûr.');
  });
  $('import-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 1000000) { notify('Fichier trop volumineux (limite : 1 Mo).'); event.target.value=''; return; }
    try {
      const imported = JSON.parse(await file.text());
      if (!validatePlan(imported)) throw new Error('Format de sauvegarde invalide.');
      if (plan && !window.confirm('Remplacer ton plan local par cette sauvegarde ?')) return;
      plan = imported; activeView = 'overview';
      persist(); showWorkspace(); notify('Sauvegarde restaurée.');
    } catch (error) { notify(error.message || 'Import impossible.'); }
    finally { event.target.value = ''; }
  });
  $('md-btn').addEventListener('click', () => {
    if (!plan) return;
    saveFile(E.markdown(plan), 'trajectoire-ebook-v' + plan.revision + '.md', 'text/markdown;charset=utf-8');
  });
  $('print-btn').addEventListener('click', () => {
    if (!plan) return;
    selectView('book');
    renderBook();
    window.print();
  });

  $('today').textContent = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  restore();
  showWorkspace();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // La plateforme reste utilisable sans installation hors ligne.
    });
  }
})();