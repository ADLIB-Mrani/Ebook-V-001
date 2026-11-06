/* Trajectoire V2 — application client : aucune clé, aucun envoi de données. */
(() => {
  'use strict';
  const E = window.TrajectoireEngine;
  const S = window.TrajectoireSources;
  const W = window.TrajectoireWorkspace;
  const D = window.TrajectoireDiagnostic;
  const INDEX_KEY = 'trajectoire.v2.workspace';
  let workspace = W.empty();
  let lastDiagnosticGoal = null;
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
  function saveWorkspace() {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(workspace));
      if(plan) localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      notify('Stockage local indisponible : exporte tes objectifs en JSON.');
    }
  }
  function persist() {
    workspace = W.upsert(workspace, plan);
    saveWorkspace();
  }
  function restore() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      const stored = JSON.parse(localStorage.getItem(INDEX_KEY) || 'null');
      workspace = W.normalize(stored, validatePlan(raw) ? raw : null);
      plan = W.active(workspace);
    } catch { workspace = W.empty(); plan = null; }
  }
  function newId() {
    return 'goal-' + ((window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) || (Date.now() + '-' + Math.floor(Math.random() * 1000000)));
  }
  function renderGoals() {
    if(!plan) return;
    $('goal-switch').innerHTML = workspace.plans.map(item =>
      '<option value="' + fmt(item.id) + '">' + fmt(item.profile.goal.slice(0, 75)) + '</option>').join('');
    $('goal-switch').value = plan.id;
    $('goal-count').textContent = '(' + workspace.plans.length + '/' + W.MAX_GOALS + ')';
  }
  function selectView(view) {
    if (!plan) {
      notify('Crée ton objectif pour accéder à ton espace.');
      $('goal').focus();
      return;
    }
    activeView = ['overview', 'roadmap', 'sources', 'resources', 'book'].includes(view) ? view : 'overview';
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const selected = btn.dataset.view === activeView;
      btn.classList.toggle('current', selected);
      if (selected) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    document.querySelectorAll('.panel-view').forEach(el => { el.hidden = el.id !== 'view-' + activeView; });
    if (activeView === 'book') renderBook();
    if (activeView === 'sources') renderSources();
    if (activeView === 'roadmap') renderRoadmap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function showWorkspace() {
    $('setup').hidden = !!plan;
    $('workspace').hidden = !plan;
    $('return-dashboard').hidden = workspace.plans.length === 0;
    if (!plan) return;
    renderDiagnostic();
    renderAll();
  }
  function taskCard(task, week) {
    const isLate = !task.completed && week.dueDate < new Date().toISOString().slice(0,10);
    return `<label class="task-row ${task.completed ? 'done' : ''}">
      <input type="checkbox" data-task="${fmt(task.id)}" ${task.completed ? 'checked' : ''} aria-label="Marquer ${fmt(task.title)} comme terminée">
      <span class="task-copy"><strong>${fmt(task.title)}</strong><p>${fmt(task.description)}</p>${task.coachingTip ? '<small class="coaching-tip">Conseil après diagnostic : '+fmt(task.coachingTip)+'</small>' : ''}
      <small>Preuve : ${fmt(task.evidence)} · ${fmt(task.estimatedHours)} h · Semaine ${fmt(week.number)} ${isLate ? '<span class="warning">· Échéance dépassée</span>' : ''}</small></span>
    </label>`;
  }
  function renderDiagnostic() {
    if(!plan) return;
    const result = $('diagnostic-result');
    const last = Array.isArray(plan.diagnostics) ? plan.diagnostics.at(-1) : null;
    result.hidden = !last;
    if(last) result.textContent = 'Dernier bilan : ' + last.score + '/' + last.total +
      ' réponses correctes. Niveau de départ suggéré : ' + last.level +
      '. Ceci ne certifie pas un niveau professionnel.';
    if(lastDiagnosticGoal === plan.id && $('diagnostic-questions').childElementCount) return;
    lastDiagnosticGoal = plan.id;
    const quiz = D.quiz(plan.profile.track);
    $('diagnostic-questions').innerHTML = quiz.map((q,i) =>
      '<fieldset class="quiz-question"><legend>' + (i+1) + '. ' + fmt(q.question) + '</legend>' +
      q.options.map((o,j) => '<label class="quiz-option"><input type="radio" name="diag-' + i +
        '" value="' + j + '" required><span>' + fmt(o) + '</span></label>').join('') + '</fieldset>').join('');
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
  function renderSources() {
    if (!plan) return;
    const items = Array.isArray(plan.sources) ? plan.sources : [];
    $('source-list').innerHTML = items.length ? items.map(src => {
      const status = src.status === 'extrait-importé-non-verifie' ? 'Extrait importé, non vérifié' :
        src.status === 'notes-utilisateur' ? 'Notes fournies par l’utilisateur' : 'Lien ajouté sans lecture automatique';
      const action = plan.weeks.flatMap(w => w.tasks).find(t => t.id === src.linkedTaskId);
      return '<article class="source-card"><div><span class="section-kicker">' + fmt(src.type.toUpperCase()) + ' · ' + fmt(status) +
        '</span><h3>' + fmt(src.title) + '</h3><p>' + fmt(src.note || 'Aucune note personnelle enregistrée.') + '</p>' + (src.excerpt ? '<p><strong>Extrait importé :</strong> ' + fmt(src.excerpt) + '</p>' : '<p>Contenu externe non importé.</p>') +
        '<small>' + (action ? 'Associée à : ' + fmt(action.title) : 'En attente d’association à une tâche') +
        '</small><p><a href="' + fmt(safeUrl(src.url)) +
        '" target="_blank" rel="noopener noreferrer">Consulter le lien ↗</a></p></div><button class="button button-outline" type="button" data-source-remove="' +
        fmt(src.id) + '">Supprimer</button></article>';
    }).join('') : '<p>Aucune source enregistrée. Ajoute un lien et des notes pour démarrer.</p>';
    $('source-suggestions').innerHTML = '<p class="source-info">Clique sur « Proposer des associations » pour voir des correspondances éventuelles.</p>';
  }
  function renderSuggestions() {
    const data = S.suggestions(plan);
    $('source-suggestions').innerHTML = data.length ? data.map(item =>
      '<article class="source-card"><div><strong>' + fmt(item.sourceTitle) + '</strong><p>' +
      fmt(item.reason) + '. Action proposée : ' + fmt(item.suggestedTaskTitle) +
      (item.week ? ' (semaine ' + fmt(item.week) + ')' : '') +
      '</p><small>Vérifie le contenu réel et la pertinence de cette association.</small></div>' +
      (item.suggestedTaskId ? '<button class="button button-outline" type="button" data-source-attach="' +
      fmt(item.sourceId) + '" data-target-task="' + fmt(item.suggestedTaskId) +
      '">Valider l’association</button>' : '') + '</article>'
    ).join('') : '<p>Aucune suggestion disponible. Ajoute des sources ou toutes les associations sont déjà validées.</p>';
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
      ${Array.isArray(plan.sources) && plan.sources.length ? '<section><h3>Sources fournies</h3><ul>' +
        plan.sources.map(s => '<li><a href="' + fmt(safeUrl(s.url)) + '">' + fmt(s.title) +
        '</a> — ' + fmt(s.status === 'notes-utilisateur' ? 'notes fournies' : 'contenu non analysé') +
        (s.note ? ' — ' + fmt(s.note) : '') + (s.excerpt ? ' — extrait non vérifié : ' + fmt(s.excerpt) : '') + '</li>').join('') + '</ul></section>' : ''}
      <section><h3>06. Ressources pour avancer</h3><ul>${plan.resources.map(r =>
        '<li><a href="' + fmt(safeUrl(r.url)) + '">' + fmt(r.title) + '</a> — ' + fmt(r.why) + '</li>').join('')}</ul></section>
      <p><small>${fmt(plan.note)} Catalogue mis à jour éditorialement le ${fmt(plan.catalogVersion)}. Le document reflète tes actions enregistrées, pas des informations Web en direct.</small></p>`;
  }
  function renderAll() {
    renderGoals();
    renderDiagnostic();
    renderSummary();
    renderResources();
    renderRoadmap();
    renderSources();
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
      if (workspace.plans.length >= W.MAX_GOALS) throw new Error('Limite de 8 objectifs atteinte. Exporte tes objectifs avant d’en supprimer un.');
      const fresh = E.buildPlan(data);
      fresh.id = newId();
      plan = fresh;
      persist();
      activeView = 'overview';
      showWorkspace();
      notify('Parcours créé. Ta première action est prête !');
    } catch (error) { notify(error.message || 'Impossible de créer le plan.'); }
  });
  $('new-goal').addEventListener('click', () => {
    $('workspace').hidden = true;
    $('setup').hidden = false;
    $('return-dashboard').hidden = workspace.plans.length === 0;
    $('goal').focus();
  });
  $('return-dashboard').addEventListener('click', () => {
    plan = W.active(workspace);
    showWorkspace();
  });
  $('goal-switch').addEventListener('change', event => {
    try {
      workspace = W.choose(workspace, event.target.value);
      plan = W.active(workspace);
      activeView = 'overview';
      lastDiagnosticGoal = null;
      saveWorkspace();
      showWorkspace();
    } catch(error) {notify(error.message || 'Impossible de changer d’objectif.');}
  });
  $('delete-goal').addEventListener('click', () => {
    if(!plan || !window.confirm('Supprimer cet objectif de ce navigateur ? Exporte ta sauvegarde si tu souhaites le conserver.'))return;
    workspace = W.remove(workspace,plan.id);
    plan = W.active(workspace);
    lastDiagnosticGoal = null;
    activeView = 'overview';
    saveWorkspace();
    showWorkspace();
    notify('Objectif supprimé localement.');
  });
  $('backup-all').addEventListener('click',()=>{
    try {
      saveFile(W.exportAll(workspace), 'trajectoire-tous-les-objectifs.json', 'application/json;charset=utf-8');
      notify('Tous tes objectifs ont été sauvegardés dans un fichier JSON.');
    } catch(error){notify(error.message);}
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
  $('diagnostic-form').addEventListener('submit', event => {
    event.preventDefault();
    if(!plan)return;
    try {
      const form = new FormData(event.currentTarget);
      const answers = D.quiz(plan.profile.track).map((_,i)=>Number(form.get('diag-'+i)));
      if(answers.some((_,i)=>!form.has('diag-'+i)))throw new Error('Réponds aux 4 questions.');
      const result = D.grade(plan.profile.track,answers);
      if(!window.confirm('Bilan : ' + result.score + '/' + result.total +
        '. Appliquer les conseils de niveau ' + result.level + ' à ton parcours ?')) return;
      plan = D.apply(plan,result);
      persist();renderAll();
      notify('Conseils adaptés : ton carnet est en version ' + plan.revision + '.');
    }catch(error){notify(error.message || 'Impossible de calculer le bilan.');}
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
  $('source-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!plan) return;
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      plan = S.add(plan, form);
      persist(); renderAll(); event.currentTarget.reset();
      notify('Source enregistrée sans extraction automatique.');
    } catch (error) { notify(error.message || 'Erreur de source.'); }
  });
  $('source-list').addEventListener('click', event => {
    const btn = event.target.closest('[data-source-remove]');
    if (!btn || !plan) return;
    if (!window.confirm('Supprimer cette source et ses associations ?')) return;
    try { plan = S.remove(plan, btn.dataset.sourceRemove); persist(); renderAll(); }
    catch (error) { notify(error.message); }
  });
  $('analyze-sources').addEventListener('click', () => {
    if (!plan) return;
    renderSuggestions();
    notify('Correspondances proposées à partir des titres et de tes notes.');
  });
  $('source-suggestions').addEventListener('click', event => {
    const btn = event.target.closest('[data-source-attach]');
    if (!btn || !plan) return;
    try {
      plan = S.attach(plan, btn.dataset.sourceAttach, btn.dataset.targetTask);
      persist(); renderAll(); renderSuggestions();
      notify('Source reliée à une action ; ebook mis à jour.');
    } catch (error) { notify(error.message || 'Association impossible.'); }
  });
  $('import-analysis').addEventListener('change', async event => {
    const file=event.target.files[0];
    if(!file||!plan)return;
    if(file.size>1000000){notify('Fichier trop volumineux : limite 1 Mo.');event.target.value='';return;}
    try {
      const payload=JSON.parse(await file.text());
      plan=S.importExtraction(plan,payload);
      persist();renderAll();
      notify('Extraits importés, signalés non vérifiés. Ebook mis à jour.');
    } catch(error){notify(error.message||'Extraction non reconnue.');}
    finally{event.target.value='';}
  });
  $('manifest-btn').addEventListener('click', () => {
    if (!plan) return;
    saveFile(S.exportManifest(plan), 'trajectoire-regroupement-sources.json','application/json;charset=utf-8');
    notify('Manifeste exporté en mode simulation, sans exécution.');
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
      if (imported?.schema === 'trajectoire-workspace-v1') {
        const valid = W.normalize(imported);
        if (!valid.plans.length || valid.plans.length !== imported.plans.length) throw new Error('Sauvegarde de plusieurs objectifs invalide.');
        if (!window.confirm('Restaurer tous les objectifs ? Cela remplacera ceux de ce navigateur.')) return;
        workspace = valid;
        plan = W.active(workspace);
        saveWorkspace();
      } else {
        if (!W.isPlan(imported)) throw new Error('Format de sauvegarde invalide.');
        if (workspace.plans.some(p => p.id === imported.id) &&
          !window.confirm('Cet objectif existe déjà. Remplacer sa version locale ?')) return;
        workspace = W.upsert(workspace, imported);
        plan = W.active(workspace);
        saveWorkspace();
      }
      lastDiagnosticGoal = null;
      activeView = 'overview';
      showWorkspace(); notify('Sauvegarde restaurée.');
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