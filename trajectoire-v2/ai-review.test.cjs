const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('./engine.js');
const S=require('./sources.js');
const A=require('./ai-review.js');
const date='2026-11-06T12:00:00.000Z';
function sample() {
  let p=E.buildPlan({goal:'Devenir développeur web en 6 mois',months:6,hoursPerWeek:8},date);
  p.id='abc';
  return S.add(p,{url:'https://developer.mozilla.org/fr/docs/Web/JavaScript',title:'MDN JavaScript'},date);
}
test('local AI imported suggestions do not alter tasks before approval',()=>{
  const plan=sample(),t=plan.weeks[0].tasks[0];
  const payload={schema:'trajectoire-ai-suggestions-v1',source:'ollama-local',
    model:'qwen2.5:3b',objective:plan.profile.goal,dry_run:true,executed:false,approved:false,
    suggestions:[{taskId:t.id,advice:'Construire une page de démonstration avec une navigation accessible.',
      reason:'Premier livrable vérifiable',sourceUrls:[plan.sources[0].url,'https://example.net/unknown']}]};
  const imported=A.importProposals(plan,payload,date);
  assert.equal(imported.aiPending.length,1);
  assert.equal(imported.aiPending[0].sourceUrls.length,1);
  assert.equal(imported.weeks[0].tasks[0].aiTip,undefined);
  const accepted=A.decide(imported,t.id,true,date);
  assert.ok(accepted.weeks[0].tasks[0].aiTip.includes('démonstration'));
  assert.equal(accepted.aiPending.length,0);
  assert.ok(E.markdown(accepted).includes('conseil IA local accepté'));
});
test('reject or malicious payload does not touch tasks',()=>{
  const plan=sample(),task=plan.weeks[0].tasks[0];
  const payload={schema:'trajectoire-ai-suggestions-v1',source:'ollama-local',model:'local',
    objective:plan.profile.goal,dry_run:true,executed:false,approved:false,
    suggestions:[{taskId:task.id,advice:'Écrire un test fonctionnel et conserver la preuve.',sourceUrls:[]}]};
  const pending=A.importProposals(plan,payload,date);
  const rejected=A.decide(pending,task.id,false,date);
  assert.equal(rejected.weeks[0].tasks[0].aiTip,undefined);
  assert.equal(rejected.aiHistory.length,1);
  assert.throws(()=>A.importProposals(plan,{...payload,executed:true}),/simulation/);
  assert.throws(()=>A.importProposals(plan,{...payload,objective:'Autre objectif'}),/autre objectif/);
});
