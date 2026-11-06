const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('./engine.js');
const W=require('./workspace.js');
const D=require('./diagnostic.js');
const mk=(id,goal='Devenir développeur web en 6 mois')=>{
  const p=E.buildPlan({goal,hoursPerWeek:8,months:6,age:20,situation:'etudiant'},'2026-11-06T10:00:00Z');
  p.id=id; return p;
};
test('migrer la sauvegarde originale sans effacer le plan',()=>{
  const old=mk('old');
  const store=W.normalize(null,old);
  assert.equal(store.plans.length,1);
  assert.equal(W.active(store).id,'old');
});
test('plusieurs objectifs, sélection, modifications, suppression et export',()=>{
  const a=mk('goal-a');
  const b=mk('goal-b','Créer une entreprise en 3 mois');
  let store=W.upsert(W.empty(),a);
  store=W.upsert(store,b);
  assert.equal(store.plans.length,2);
  assert.equal(W.active(store).id,'goal-b');
  store=W.choose(store,'goal-a');
  assert.equal(W.active(store).id,'goal-a');
  const changed=E.toggle(a,a.weeks[0].tasks[0].id,true,'2026-11-07T12:00:00Z');
  store=W.upsert(store,changed);
  assert.equal(W.active(store).revision,2);
  assert.equal(JSON.parse(W.exportAll(store)).plans.length,2);
  store=W.remove(store,'goal-a');
  assert.equal(store.plans.length,1);
  assert.equal(store.activeId,'goal-b');
});
test('la sauvegarde de plusieurs objectifs rejette les doublons et les objets invalides',()=>{
  const a=mk('same');
  const duplicate={schema:'trajectoire-workspace-v1',activeId:'same',plans:[a,a]};
  assert.equal(W.normalize(duplicate).plans.length,0);
  assert.throws(()=>W.upsert(W.empty(),{schema:2,profile:{}}),/invalide/);
  assert.throws(()=>W.choose(W.empty(),'absent'),/inconnu/);
});
test('mini-diagnostic ne supprime pas les progrès et conseille les prochaines tâches',()=>{
  let p=mk('goal-a');
  p=E.toggle(p,p.weeks[0].tasks[0].id,true,'2026-11-07T12:00:00Z');
  const q=D.quiz('web');
  assert.equal(q.length,4);
  assert.ok(q[0].options[0].includes('main'));
  const result=D.grade('web',[0,1,2,3]);
  assert.equal(result.score,3);
  assert.equal(result.level,'intermediaire');
  const changed=D.apply(p,result,'2026-11-08T12:00:00Z');
  assert.equal(changed.profile.level,'intermediaire');
  assert.equal(E.completion(changed).done,1);
  assert.equal(changed.diagnostics.length,1);
  assert.ok(changed.weeks.flatMap(w=>w.tasks).some(t=>t.coachingTip));
  assert.ok(E.markdown(changed).includes('Mini-diagnostics'));
  assert.throws(()=>D.grade('web',[0]),/Réponds/);
});
