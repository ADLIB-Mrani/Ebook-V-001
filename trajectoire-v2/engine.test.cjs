const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('./engine.js');
const base = { goal: 'Devenir développeur web en 6 mois', months: 6, hoursPerWeek: 8, age: 20, level: 'debutant', budget: 0 };
const date = '2026-11-05T12:00:00.000Z';

test('détection de domaines même avec de vrais objectifs exprimés librement', () => {
  assert.equal(E.classify('Gagner 5000 euros par mois'), 'income');
  assert.equal(E.classify('Créer une entreprise en 3 mois'), 'business');
  assert.equal(E.classify('Devenir développeur web'), 'web');
  assert.equal(E.classify('Apprendre l’espagnol'), 'general');
});

test('création d’un plan de 6 mois, jalons, ressources, échéances', () => {
  const p = E.buildPlan(base, date);
  assert.equal(p.schema, 2);
  assert.equal(p.weeks.length, 26);
  assert.equal(p.milestones.length, 4);
  assert.equal(p.weeks[0].number, 1);
  assert.equal(p.weeks.at(-1).number, 26);
  assert.equal(p.resources.length, 5);
  assert.ok(p.weeks.every(w => w.tasks.length >= 1));
  assert.ok(p.weeks.every(w => w.tasks.every(t => t.evidence && t.id)));
  assert.equal(E.completion(p).percent, 0);
});

test('le plan tient compte d’une faible disponibilité et signale le réalisme', () => {
  const p = E.buildPlan({ ...base, hoursPerWeek: 1, months: 1 }, date);
  assert.equal(p.weeks.length, 4);
  assert.ok(p.alerts.some(a => a.includes('inférieur')));
  assert.ok(p.weeks.every(w => w.tasks.length === 1));
  assert.equal(p.totalHours, 4);
});

test('tâches terminées, prochaine action et carnet vivant', () => {
  const p = E.buildPlan(base, date);
  const id = p.weeks[0].tasks[0].id;
  const updated = E.toggle(p,id,true, '2026-11-06T12:00:00.000Z');
  assert.equal(p.weeks[0].tasks[0].completed, false);
  assert.equal(updated.weeks[0].tasks[0].completed, true);
  assert.equal(updated.revision, 2);
  assert.equal(E.completion(updated).done, 1);
  assert.notEqual(E.nextActions(updated)[0].id, id);
  const book = E.markdown(updated);
  assert.ok(book.includes('Version 2'));
  assert.ok(book.includes('- [x]'));
  assert.ok(book.includes('https://'));
});

test('profils invalides et identifiants inconnus refusés', () => {
  assert.throws(() => E.buildPlan({goal:'oui'}), /objectif/);
  const p = E.buildPlan(base,date);
  assert.throws(() => E.toggle(p,'fake',true), /inconnue/);
  assert.equal(E.normalize({...base, hoursPerWeek: 1000}).hoursPerWeek,60);
});

test('pas de garantie de revenus et prudence pour les mineurs', () => {
  const p = E.buildPlan({ ...base, goal:'Gagner 5000 euros par mois', age:16 }, date);
  assert.ok(p.alerts.some(a => a.includes('garanti')));
  assert.ok(p.alerts.some(a => a.includes('mineur')));
  assert.equal(p.profile.track,'income');
});
