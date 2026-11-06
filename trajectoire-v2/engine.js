/* Trajectoire V2 — moteur local, déterministe, sans API payante.
   Données et liens éditoriaux : pas de recherche Web temps réel. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.TrajectoireEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const CATALOG_VERSION = '2026-11-05';
  const resources = {
    web: [
      { title: 'MDN — Apprendre le développement web', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development', type: 'Documentation', why: 'HTML, CSS, JavaScript et bonnes pratiques', free: true },
      { title: 'freeCodeCamp — Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Exercices', why: 'Pratique progressive et projets', free: true },
      { title: 'The Odin Project', url: 'https://www.theodinproject.com/paths', type: 'Parcours', why: 'Projets guidés de bout en bout', free: true },
      { title: 'GitHub Skills', url: 'https://skills.github.com/', type: 'Exercices', why: 'Git, branches et collaborations', free: true },
      { title: 'web.dev', url: 'https://web.dev/learn', type: 'Documentation', why: 'Performance, accessibilité et déploiement', free: true }
    ],
    business: [
      { title: 'Bpifrance Création', url: 'https://bpifrance-creation.fr/', type: 'Guide officiel', why: 'Étude de marché, business model et étapes', free: true },
      { title: 'Service-Public — Entreprendre', url: 'https://entreprendre.service-public.gouv.fr/', type: 'Information publique', why: 'Vérifier les démarches légales en France', free: true },
      { title: 'Pépite France', url: 'https://www.pepite-france.fr/', type: 'Accompagnement', why: 'Accompagnement pour étudiant entrepreneur', free: true },
      { title: 'HubSpot Academy', url: 'https://academy.hubspot.com/', type: 'Formation', why: 'Marketing, vente et prospection', free: true },
      { title: 'Google Trends', url: 'https://trends.google.com/trends/', type: 'Analyse', why: 'Observer l’intérêt pour un sujet', free: true }
    ],
    income: [
      { title: 'Bpifrance Création', url: 'https://bpifrance-creation.fr/', type: 'Guide', why: 'Construire une offre viable', free: true },
      { title: 'Service-Public — Entreprendre', url: 'https://entreprendre.service-public.gouv.fr/', type: 'Information publique', why: 'Comprendre les obligations liées aux revenus', free: true },
      { title: 'HubSpot Academy', url: 'https://academy.hubspot.com/', type: 'Formation', why: 'Vente, prospection et acquisition', free: true },
      { title: 'Google Skillshop', url: 'https://skillshop.withgoogle.com/', type: 'Formation', why: 'Compétences de marketing numérique', free: true },
      { title: 'GitHub Student Developer Pack', url: 'https://education.github.com/pack', type: 'Avantages étudiants', why: 'Outils offerts sous conditions', free: true }
    ],
    general: [
      { title: 'OpenLearn', url: 'https://www.open.edu/openlearn/', type: 'Cours', why: 'Explorer des compétences transversales', free: true },
      { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/', type: 'Cours', why: 'Cours et supports en libre accès', free: true },
      { title: 'Anki', url: 'https://apps.ankiweb.net/', type: 'Outil', why: 'Révision espacée des notions', free: true },
      { title: 'GitHub Projects', url: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects', type: 'Outil', why: 'Organiser ses tâches et livrables', free: true }
    ]
  };

  const tracks = {
    web: {
      label: 'Développement web', benchmarkHours: 280,
      phases: [
        { title: 'Fondations et diagnostic', ratio: 0.20, outcome: 'Une première page responsive publiée',
          actions: [
            ['Évaluer ses bases', 'Lister 5 notions connues et 5 notions à apprendre', 'Un diagnostic personnel'],
            ['Pratiquer HTML sémantique', 'Créer une page accessible sans framework', 'Une page HTML vérifiable'],
            ['Mettre en forme avec CSS', 'Adapter la page aux petits et grands écrans', 'Une capture mobile et desktop'],
            ['Versionner son travail', 'Créer un dépôt, au moins 3 commits et un README', 'Un lien vers le dépôt']
          ] },
        { title: 'JavaScript et interaction', ratio: 0.27, outcome: 'Une application JavaScript fonctionnelle',
          actions: [
            ['Comprendre JavaScript', 'Pratiquer variables, fonctions et tableaux avec exercices', 'Un dépôt d’exercices corrigés'],
            ['Manipuler le DOM', 'Ajouter un formulaire validé et des interactions clavier', 'Une démo utilisable au clavier'],
            ['Consommer une API publique', 'Gérer états chargement, erreur et succès', 'Une fonctionnalité testable'],
            ['Tester ses fonctions', 'Ajouter au moins 3 tests automatisés', 'Une exécution de tests réussie']
          ] },
        { title: 'Projet et mise en production', ratio: 0.33, outcome: 'Un projet portfolio déployé',
          actions: [
            ['Choisir un problème réel', 'Interroger une personne cible et noter son besoin', 'Une fiche problème utilisateur'],
            ['Développer une fonctionnalité', 'Livrer une petite fonctionnalité bout en bout', 'Une URL de démonstration'],
            ['Vérifier qualité et sécurité', 'Contrôler accessibilité, erreurs et validation des entrées', 'Une checklist de contrôle'],
            ['Déployer et documenter', 'Publier la démo, expliquer installation et limites', 'Une démo publique et son README']
          ] },
        { title: 'Portfolio et opportunités', ratio: 0.20, outcome: 'Démontrer ses compétences avec des preuves',
          actions: [
            ['Rédiger une étude de cas', 'Expliquer problème, décisions, résultat et difficultés', 'Une page étude de cas'],
            ['Faire relire son code', 'Demander une revue et intégrer 2 retours', 'Une liste de corrections'],
            ['Préparer des entretiens', 'Expliquer son architecture en cinq minutes', 'Une simulation enregistrée'],
            ['Candidater avec discernement', 'Identifier et contacter 3 opportunités adaptées', 'Un tableau des démarches']
          ] }
      ]
    },
    business: {
      label: 'Création d’entreprise', benchmarkHours: 120,
      phases: [
        { title: 'Comprendre le problème', ratio: 0.26, outcome: 'Un problème client réellement documenté',
          actions: [
            ['Choisir un public cible', 'Décrire un client précis et son problème prioritaire', 'Une fiche persona'],
            ['Interroger des clients potentiels', 'Réaliser 3 entretiens sans vendre', '3 synthèses anonymisées'],
            ['Cartographier les alternatives', 'Comparer 3 concurrents et solutions actuelles', 'Un tableau de comparaison'],
            ['Énoncer une hypothèse', 'Formuler le problème et un critère de validation', 'Une hypothèse testable']
          ] },
        { title: 'Valider une offre', ratio: 0.29, outcome: 'Une preuve de demande plutôt qu’une simple idée',
          actions: [
            ['Construire une proposition de valeur', 'Rédiger le résultat promis et ses limites', 'Une phrase d’offre claire'],
            ['Tester l’intérêt', 'Présenter une maquette et demander un retour concret', '5 retours exploitables'],
            ['Faire un budget', 'Calculer coûts, prix et seuil de rentabilité', 'Un tableau prévisionnel'],
            ['Mesurer le signal réel', 'Distinguer compliments, inscriptions et intentions d’achat', 'Un bilan de validation']
          ] },
        { title: 'Lancer une version minimale', ratio: 0.30, outcome: 'Une offre minimale mise à l’épreuve',
          actions: [
            ['Construire un MVP réduit', 'Livrer une fonction ou un service central', 'Une démo ou une prestation test'],
            ['Préparer un canal de contact', 'Créer une page de présentation sobre', 'Une page consultable'],
            ['Réaliser un premier test terrain', 'Faire essayer la solution et observer les frictions', 'Un compte rendu de test'],
            ['Vérifier la réglementation', 'Consulter les sources officielles avant toute vente', 'Une liste de démarches à confirmer']
          ] },
        { title: 'Améliorer et décider', ratio: 0.15, outcome: 'Une décision fondée sur des résultats',
          actions: [
            ['Analyser les retours', 'Classer objections et besoins récurrents', 'Un tableau des retours'],
            ['Calculer ses indicateurs', 'Mesurer contacts, conversions et temps investi', 'Un tableau de bord simple'],
            ['Planifier la suite', 'Conserver, modifier ou abandonner l’hypothèse selon les preuves', 'Une décision argumentée']
          ] }
      ]
    },
    income: {
      label: 'Développement de revenus', benchmarkHours: 160,
      phases: [
        { title: 'Compétence et offre', ratio: 0.23, outcome: 'Une offre réaliste et délimitée',
          actions: [
            ['Inventorier ses compétences', 'Lister les services possibles et les preuves existantes', 'Une matrice compétences/preuves'],
            ['Identifier un client cible', 'Décrire une clientèle et un problème solvable', 'Une fiche client'],
            ['Construire une offre', 'Préciser livrable, délai, prix indicatif et exclusions', 'Une page offre'],
            ['Préparer une preuve', 'Réaliser un exemple ou une démo de qualité', 'Un cas pratique']
          ] },
        { title: 'Valider le marché', ratio: 0.27, outcome: 'Des retours clients vérifiables',
          actions: [
            ['Étudier les alternatives', 'Examiner 5 offres comparables sans copier', 'Un tableau comparatif'],
            ['Échanger avec des prospects', 'Mener 3 conversations de découverte', 'Un résumé des besoins'],
            ['Tester son argumentaire', 'Demander un avis sur l’offre et le prix', 'Des objections documentées'],
            ['Améliorer le positionnement', 'Réécrire l’offre selon les retours', 'Une version 2 de l’offre']
          ] },
        { title: 'Prospection éthique', ratio: 0.35, outcome: 'Un processus de vente mesurable',
          actions: [
            ['Préparer des messages personnalisés', 'Écrire un message utile, court et non trompeur', 'Un modèle de message'],
            ['Contacter quelques prospects pertinents', 'Faire 5 prises de contact ciblées sans spam', 'Un journal de prospection'],
            ['Présenter son travail', 'Proposer une démonstration ou un petit pilote', 'Un retour sur la proposition'],
            ['Mesurer les résultats', 'Noter réponses, rendez-vous, refus et conversions', 'Un tableau de suivi']
          ] },
        { title: 'Fiabiliser les revenus', ratio: 0.15, outcome: 'Un processus durable et légal',
          actions: [
            ['Calculer sa rentabilité', 'Distinguer chiffre d’affaires, bénéfice, charges et impôts', 'Un calcul documenté'],
            ['Réduire le temps perdu', 'Standardiser une étape répétitive de livraison', 'Une checklist de prestation'],
            ['Évaluer la suite', 'Mesurer les résultats réels et revoir l’objectif de revenus', 'Une révision du plan']
          ] }
      ]
    },
    general: {
      label: 'Objectif personnel', benchmarkHours: 100,
      phases: [
        { title: 'Clarifier et mesurer', ratio: 0.20, outcome: 'Un objectif mesurable',
          actions: [
            ['Définir un résultat concret', 'Décrire un livrable observable et une date', 'Une définition de réussite'],
            ['Établir son point de départ', 'Tester ses capacités actuelles et noter ses lacunes', 'Un diagnostic initial'],
            ['Découper l’objectif', 'Identifier les trois compétences prioritaires', 'Une liste ordonnée']
          ] },
        { title: 'Apprendre et pratiquer', ratio: 0.35, outcome: 'Des preuves d’apprentissage',
          actions: [
            ['Étudier un concept prioritaire', 'Appliquer le concept à un exercice réel', 'Une note et un exercice'],
            ['Demander un retour', 'Partager son travail à une personne compétente', 'Un retour externe'],
            ['Construire une habitude', 'Réserver ses sessions et documenter le temps réel', 'Un journal d’activité']
          ] },
        { title: 'Réaliser un projet', ratio: 0.30, outcome: 'Un livrable testé',
          actions: [
            ['Construire une première version', 'Réaliser la plus petite preuve de progrès', 'Un prototype'],
            ['Tester son livrable', 'Demander une évaluation selon 3 critères', 'Une grille de retour'],
            ['Itérer', 'Corriger au moins 2 limites', 'Une seconde version']
          ] },
        { title: 'Évaluer et améliorer', ratio: 0.15, outcome: 'Une évaluation claire du résultat',
          actions: [
            ['Comparer avant et après', 'Réaliser le même test que lors du diagnostic', 'Une mesure comparable'],
            ['Documenter les acquis', 'Expliquer ce qui fonctionne et les lacunes', 'Un bilan écrit'],
            ['Préparer la suite', 'Choisir la prochaine étape fondée sur les preuves', 'Un plan de continuation']
          ] }
      ]
    }
  };

  const clamp = (n, min, max, fallback) => {
    const v = Number(n);
    return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
  };
  const short = (v, max = 300) => String(v == null ? '' : v).trim().slice(0, max);
  function classify(goal, explicit) {
    if (tracks[explicit]) return explicit;
    const v = short(goal, 400).toLowerCase();
    if (/développeur|developpeur|programm|javascript|react|site web|web dev|frontend|full.stack|backend/.test(v)) return 'web';
    if (/entreprise|startup|start.up|business|société|societe|entrepren|micro.entreprise|lancer .* activité/.test(v)) return 'business';
    if (/gagn|revenu|€|euro|freelanc|client|chiffre d.affaire|salaire|monétis/.test(v)) return 'income';
    return 'general';
  }
  function normalize(input) {
    if (!input || typeof input !== 'object') throw new Error('Un profil est requis.');
    const goal = short(input.goal, 220);
    if (goal.length < 8) throw new Error('Décris ton objectif en au moins 8 caractères.');
    const months = Math.round(clamp(input.months, 1, 24, 6));
    const hoursPerWeek = clamp(input.hoursPerWeek, 1, 60, 6);
    return {
      goal, track: classify(goal, input.track), months, hoursPerWeek,
      age: Math.round(clamp(input.age, 13, 100, 20)),
      situation: ['etudiant','salarie','recherche','independant','autre'].includes(input.situation) ? input.situation : 'autre',
      level: ['debutant', 'intermediaire', 'avance'].includes(input.level) ? input.level : 'debutant',
      budget: Math.round(clamp(input.budget, 0, 1000000, 0)),
      skills: short(input.skills, 450), constraints: short(input.constraints, 450),
      country: short(input.country || 'France', 80), language: 'fr'
    };
  }
  function allocateWeeks(weeks, phases) {
    const result = phases.map(x => Math.floor(weeks * x.ratio));
    // Au moins une semaine par phase (les parcours font au moins 4 semaines).
    for (let i = 0; i < result.length; i++) result[i] = Math.max(1, result[i]);
    let delta = weeks - result.reduce((a,b) => a+b, 0);
    while (delta > 0) { const i = result.indexOf(Math.min(...result)); result[i]++; delta--; }
    while (delta < 0) { const i = result.indexOf(Math.max(...result)); if (result[i] > 1) { result[i]--; delta++; } else break; }
    return result;
  }
  function isoDate(d) { return d.toISOString().slice(0, 10); }
  function buildPlan(raw, today) {
    const profile = normalize(raw);
    const referenceDate = today ? new Date(today) : new Date();
    if (Number.isNaN(referenceDate.valueOf())) throw new Error('Date invalide.');
    const track = tracks[profile.track];
    const weeksCount = Math.max(4, Math.round(profile.months * 52 / 12));
    const phases = track.phases.map(x => ({ ...x }));
    if (profile.level === 'avance') {
      const weights = [0.10, 0.18, 0.45, 0.27];
      phases.forEach((p,i) => { p.ratio = weights[i]; });
    } else if (profile.level === 'intermediaire') {
      const weights = [0.15, 0.25, 0.35, 0.25];
      phases.forEach((p,i) => { p.ratio = weights[i]; });
    }
    const phaseWeeks = allocateWeeks(weeksCount, phases);
    const start = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate(), 12));
    const weekTasks = Math.max(1, Math.min(3, Math.floor(profile.hoursPerWeek / 3) || 1));
    const weeks = [];
    const milestones = [];
    let weekNumber = 0;
    phases.forEach((phase, phaseIndex) => {
      const count = phaseWeeks[phaseIndex];
      for (let i = 0; i < count; i++) {
        weekNumber++;
        const due = new Date(start.valueOf() + (weekNumber * 7 - 1) * 86400000);
        const tasks = [];
        for (let k = 0; k < weekTasks; k++) {
          const declaredSkills = profile.skills.toLowerCase();
          let skillShift = 0;
          if (profile.track === 'web' && phaseIndex === 0 && /html|css|git/.test(declaredSkills)) skillShift = 2;
          if (profile.track === 'web' && phaseIndex === 1 && /javascript|typescript|react|node/.test(declaredSkills)) skillShift = 2;
          const levelShift = profile.level === 'avance' ? 2 : profile.level === 'intermediaire' ? 1 : 0;
          const index = ((i * weekTasks) + k + Math.max(skillShift,levelShift)) % phase.actions.length;
          const action = phase.actions[index];
          tasks.push({
            id: 'w' + weekNumber + '-t' + k,
            title: action[0], description: action[1],
            evidence: action[2], estimatedHours: Math.round(profile.hoursPerWeek / weekTasks * 10) / 10,
            completed: false
          });
        }
        weeks.push({ number: weekNumber, phase: phase.title, phaseIndex, dueDate: isoDate(due), tasks });
      }
      milestones.push({ week: weekNumber, title: phase.outcome });
    });
    const totalHours = Math.round(weeksCount * profile.hoursPerWeek);
    const alerts = [];
    if (totalHours < track.benchmarkHours && profile.level === 'debutant') {
      alerts.push('Ton temps disponible (' + totalHours + ' h) est inférieur au repère indicatif de ' + track.benchmarkHours + ' h pour ce type d’objectif. Réduis le périmètre, augmente tes heures ou allonge la durée.');
    }
    if (profile.skills) alerts.push('Les compétences déclarées orientent certains exercices, mais elles ne sont pas encore évaluées par un test de niveau.');
    if (profile.track === 'income') alerts.push('Aucun montant de revenus n’est garanti : distingue chiffre d’affaires, bénéfice, charges et temps de travail.');
    if (profile.age < 18) alerts.push('Tu es mineur : vérifie les règles applicables avant tout contrat, activité indépendante ou revenu.');
    if (profile.situation === 'salarie' && ['business','income'].includes(profile.track)) alerts.push('Vérifie les clauses de ton contrat et tes obligations professionnelles avant toute activité complémentaire.');
    if (profile.country.toLowerCase() !== 'france' && ['business','income'].includes(profile.track)) alerts.push('Les ressources juridiques proposées concernent principalement la France ; vérifie les règles de ton pays.');
    if (profile.constraints) alerts.push('Contrainte à prendre en compte dans chaque séance : ' + profile.constraints);
    if (profile.budget === 0) alerts.push('Sélection de ressources sans achat obligatoire ; certaines plateformes affichent aussi des offres payantes.');
    const now = referenceDate.toISOString();
    return {
      schema: 2, id: 'plan-' + isoDate(start) + '-' + profile.track,
      revision: 1, createdAt: now, updatedAt: now, catalogVersion: CATALOG_VERSION,
      profile, track: track.label, totalHours, weeks, milestones, alerts,
      resources: [
        ...resources[profile.track].filter(r => profile.situation === 'etudiant' || r.title !== 'GitHub Student Developer Pack').map(r => ({...r})),
        ...(profile.situation === 'etudiant' && profile.track !== 'income' ? [{
          title: 'GitHub Student Developer Pack', url: 'https://education.github.com/pack',
          type: 'Avantages étudiants', why: 'Avantages à activer selon éligibilité et quotas', free: true
        }] : [])
      ],
      note: 'Plan heuristique et éditorial : ne garantit pas l’atteinte de l’objectif. Ressources non recherchées ni contrôlées en temps réel.'
    };
  }
  function completion(plan) {
    const all = plan.weeks.flatMap(w => w.tasks);
    const done = all.filter(t => t.completed).length;
    return { done, total: all.length, percent: all.length ? Math.round(done * 100 / all.length) : 0 };
  }
  function nextActions(plan, limit = 3) {
    return plan.weeks.flatMap(w => w.tasks.filter(t => !t.completed).map(t => ({ ...t, week: w.number, dueDate: w.dueDate }))).slice(0, limit);
  }
  function toggle(plan, taskId, completed, date = new Date()) {
    const copy = JSON.parse(JSON.stringify(plan));
    const task = copy.weeks.flatMap(w => w.tasks).find(t => t.id === taskId);
    if (!task) throw new Error('Tâche inconnue.');
    task.completed = Boolean(completed);
    task.completedAt = completed ? new Date(date).toISOString() : null;
    copy.revision++;
    copy.updatedAt = new Date(date).toISOString();
    return copy;
  }
  function review(plan, weeklyHours, obstacle, date = new Date()) {
    const hours = Number(weeklyHours);
    if (!Number.isFinite(hours) || hours < 1 || hours > 60) throw new Error('Indique entre 1 et 60 heures par semaine.');
    const at = new Date(date);
    if (Number.isNaN(at.valueOf())) throw new Error('Date de bilan invalide.');
    const copy = JSON.parse(JSON.stringify(plan));
    const before = copy.profile.hoursPerWeek;
    copy.profile.hoursPerWeek = hours;
    const remaining = copy.weeks.filter(w => w.tasks.some(t => !t.completed));
    const start = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate(), 12));
    remaining.forEach((w, index) => {
      w.dueDate = isoDate(new Date(start.valueOf() + (index + 1) * 7 * 86400000));
      const unfinished = w.tasks.filter(t => !t.completed);
      unfinished.forEach(t => { t.estimatedHours = Math.round(hours / unfinished.length * 10) / 10; });
    });
    const completedHours = copy.weeks.flatMap(w => w.tasks).filter(t => t.completed)
      .reduce((sum,t) => sum + t.estimatedHours, 0);
    copy.totalHours = Math.round(completedHours + remaining.length * hours);
    copy.checkins = Array.isArray(copy.checkins) ? copy.checkins.slice(-19) : [];
    copy.checkins.push({ date: isoDate(start), previousHours: before, hoursPerWeek: hours,
      obstacle: short(obstacle, 400), weeksRemaining: remaining.length });
    copy.revision = Number(copy.revision || 0) + 1;
    copy.updatedAt = at.toISOString();
    copy.alerts = copy.alerts.filter(a => !a.startsWith('Ton temps disponible ('));
    copy.alerts.push('Bilan du ' + isoDate(start) + ' : échéances restantes repoussées à raison d’une semaine par bloc. Charge revue à ' + hours + ' h/semaine. Ce calendrier reste indicatif.');
    return copy;
  }
  function markdown(plan) {
    const safe = v => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').replace(/([\\*_\[\]`])/g, '\\$1');
    const p = plan.profile;
    const c = completion(plan);
    const lines = [
      '# Mon carnet de progression — ' + safe(p.goal),
      '', '> Version ' + plan.revision + ' · actualisée le ' + plan.updatedAt.slice(0, 10),
      '> Catalogue de ressources : ' + plan.catalogVersion,
      '', '## Profil et conditions',
      '- Objectif : ' + safe(p.goal), '- Domaine : ' + plan.track,
      '- Durée : ' + p.months + ' mois ; disponibilité : ' + p.hoursPerWeek + ' h/semaine',
      '- Niveau : ' + p.level + ' ; situation : ' + p.situation + ' ; budget : ' + p.budget + ' €',
      '- Compétences existantes : ' + safe(p.skills || 'Non renseignées'),
      '- Contraintes : ' + safe(p.constraints || 'Aucune renseignée'),
      '', '## Progression', c.done + ' / ' + c.total + ' actions (' + c.percent + ' %)',
      '', '## Points de vigilance', ...plan.alerts.map(a => '- ' + safe(a)),
      '', '## Parcours détaillé'
    ];
    for (const week of plan.weeks) {
      lines.push('', '### Semaine ' + week.number + ' — ' + safe(week.phase) + ' (avant le ' + week.dueDate + ')');
      for (const t of week.tasks) lines.push('- [' + (t.completed ? 'x' : ' ') + '] ' + safe(t.title) + ' — ' + safe(t.description) + ' | preuve : ' + safe(t.evidence) + (t.coachingTip ? ' | conseil : ' + safe(t.coachingTip) : '') + (t.aiTip ? ' | conseil IA local accepté : ' + safe(t.aiTip) : ''));
    }
    if (Array.isArray(plan.diagnostics) && plan.diagnostics.length) {
      lines.push('', '## Mini-diagnostics indicatifs');
      for (const d of plan.diagnostics) lines.push('- ' + safe(d.date?.slice(0,10)) + ' : ' +
        d.score + '/' + d.total + ' réponses correctes ; niveau suggéré : ' + safe(d.level) +
        ' ; notions à travailler : ' + safe((d.workOn||[]).map(x=>x.topic).join(', ') || 'approfondir la pratique'));
      lines.push('Ce questionnaire court ne remplace ni un projet pratique ni une validation professionnelle.');
    }
    if (Array.isArray(plan.checkins) && plan.checkins.length) {
      lines.push('', '## Bilans de progression');
      for (const c of plan.checkins) lines.push('- ' + c.date + ' : ' + c.hoursPerWeek + ' h/semaine ; obstacle : ' + safe(c.obstacle || 'aucun signalé'));
    }
    lines.push('', '## Jalons', ...plan.milestones.map(m => '- Semaine ' + m.week + ' : ' + safe(m.title)));
    if (Array.isArray(plan.sources) && plan.sources.length) {
      lines.push('', '## Sources personnelles (à vérifier)');
      for (const src of plan.sources) {
        lines.push('- ' + safe(src.title) + ' — ' + src.url +
          ' ; statut : ' + safe(src.status) + ' ; notes utilisateur : ' + safe(src.note || 'Aucune') + (src.excerpt ? ' ; extrait externe non vérifié : ' + safe(src.excerpt) : ''));
      }
    }
    lines.push('', '## Ressources sélectionnées');
    for (const r of plan.resources) lines.push('- ' + safe(r.title) + ' : ' + r.url + ' — ' + safe(r.why));
    lines.push('', '---', plan.note, 'Ce carnet reflète ton dernier suivi local. La mise à jour automatique des liens et des informations externes n’est pas activée.');
    return lines.join('\n');
  }
  return { buildPlan, normalize, classify, completion, nextActions, toggle, review, markdown, CATALOG_VERSION };
});
