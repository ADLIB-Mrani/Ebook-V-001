const test=require('node:test');
const assert=require('node:assert/strict');
const Engine=require('./engine.js');
const Sources=require('./sources.js');
const date='2026-11-05T12:00:00.000Z';
const sample=()=>Engine.buildPlan({goal:'Devenir développeur web en 6 mois',months:6,hoursPerWeek:8,situation:'etudiant',age:20},date);

test('source HTTPS catégorisée et stockée sans récupérer de contenu',()=>{
  const p=Sources.add(sample(),{url:'https://developer.mozilla.org/fr/docs/Web/JavaScript',title:'MDN JavaScript',note:'Étudier les fonctions JavaScript et leurs tests'},date);
  assert.equal(p.sources.length,1);
  assert.equal(p.sources[0].type,'web');
  assert.equal(p.sources[0].status,'notes-utilisateur');
  assert.equal(p.sources[0].linkedTaskId,null);
  assert.ok(Engine.markdown(p).includes('Sources personnelles'));
  assert.ok(!sample().sources);
});

test('liens dangereux et doublons rejetés',()=>{
  const p=sample();
  for(const url of ['javascript:alert(1)','file:///etc/passwd','http://example.com','https://localhost/admin','https://127.0.0.1','https://user:secret@example.com/']){
    assert.throws(()=>Sources.add(p,{url}),/URL|HTTPS|public|identifiants/i);
  }
  const a=Sources.add(p,{url:'https://www.youtube.com/watch?v=M7lc1UVf-VE',title:'Vidéo'},date);
  assert.equal(a.sources[0].type,'youtube');
  assert.throws(()=>Sources.add(a,{url:'https://www.youtube.com/watch?v=M7lc1UVf-VE'}),/déjà/);
});

test('suggestion uniquement et association avec validation volontaire',()=>{
  let p=Sources.add(sample(),{url:'https://developer.mozilla.org/',title:'JavaScript',note:'exercices JavaScript'},date);
  const sug=Sources.suggestions(p)[0];
  assert.equal(sug.confirmed,false);
  assert.ok(sug.suggestedTaskId);
  p=Sources.attach(p,sug.sourceId,sug.suggestedTaskId,date);
  assert.equal(p.sources[0].linkedTaskId,sug.suggestedTaskId);
  assert.equal(Sources.suggestions(p).length,0);
  const task=p.weeks.flatMap(w=>w.tasks).find(t=>t.id===sug.suggestedTaskId);
  assert.ok(task.sourceIds.includes(sug.sourceId));
  const out=JSON.parse(Sources.exportManifest(p));
  assert.equal(out.dry_run,true);
  assert.equal(out.auto_execute,false);
  assert.equal(out.sources.length,1);
  p=Sources.remove(p,sug.sourceId,date);
  assert.equal(p.sources.length,0);
  assert.ok(!p.weeks.flatMap(w=>w.tasks).some(t=>(t.sourceIds||[]).includes(sug.sourceId)));
});

test('import extraction revalide le schéma et n’exécute rien',()=>{
  const p=Sources.add(sample(),{url:'https://developer.mozilla.org/fr/docs/',title:'MDN'},date);
  const data={schema:'regroupement-extraction-v1',dry_run:true,executed:false,resources:[
    {url:p.sources[0].url,status:'extrait-non-verifie',excerpt:'La documentation présente les fonctions JavaScript.'}
  ]};
  const imported=Sources.importExtraction(p,data,date);
  assert.equal(imported.sources[0].status,'extrait-importé-non-verifie');
  assert.ok(imported.sources[0].excerpt.includes('fonctions JavaScript'));
  assert.throws(()=>Sources.importExtraction(p,{...data,executed:true}),/sécurisée/);
  assert.equal(p.sources[0].status,'lien-non-analyse');
});
