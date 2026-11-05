/* Trajectoire x Regroupement: sources utilisateur, sans scraping ni exécution. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.TrajectoireSources=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const badHosts=/^(localhost|localhost\.localdomain|.*\.localhost|.*\.local|.*\.internal|0\.0\.0\.0)$/i;
  function bounded(s,max){return String(s==null?'':s).trim().slice(0,max);}
  function normalizeUrl(raw){
    const value=bounded(raw,1000);
    if(!value || value.length>800)throw new Error('Lien vide ou trop long (800 caractères maximum).');
    let url;try{url=new URL(value);}catch{throw new Error('URL invalide : utilise une adresse https:// complète.');}
    if(url.protocol!=='https:')throw new Error('Seules les URL HTTPS sont acceptées.');
    if(url.username||url.password)throw new Error('Les identifiants intégrés à l’URL sont interdits.');
    if(url.port&&url.port!=='443')throw new Error('Ports non standards interdits.');
    const host=url.hostname.toLowerCase().replace(/\.$/,'');
    if(badHosts.test(host)||!host.includes('.')||/^(?:\d+\.){3}\d+$/.test(host)||host.startsWith('[')||host.endsWith('.test')||host.endsWith('.example')||host.endsWith('.invalid')){
      throw new Error('Utilise un domaine public HTTPS, pas une adresse locale ou privée.');
    }
    url.hash='';return url.toString();
  }
  function detect(url){
    const h=new URL(url).hostname.toLowerCase();
    if(['youtube.com','www.youtube.com','m.youtube.com','youtu.be'].includes(h))return 'youtube';
    if(/\.pdf(?:\?|$)/i.test(url))return 'pdf';
    return 'web';
  }
  function validPlan(plan){
    if(!plan||plan.schema!==2||!Array.isArray(plan.weeks))throw new Error('Un parcours V2 est nécessaire.');
  }
  function mutate(plan,operation,date=new Date()){
    const copy=JSON.parse(JSON.stringify(plan));operation(copy);
    copy.revision=Number(copy.revision||0)+1;copy.updatedAt=new Date(date).toISOString();return copy;
  }
  function add(plan,input,date=new Date()){
    validPlan(plan);
    if(!input||!input.url)throw new Error('Ajoute un lien HTTPS.');
    const url=normalizeUrl(input.url);
    const current=Array.isArray(plan.sources)?plan.sources:[];
    if(current.length>=20)throw new Error('20 sources maximum par parcours dans ce prototype.');
    if(current.some(s=>s.url===url))throw new Error('Cette source est déjà ajoutée.');
    const title=bounded(input.title,150)||new URL(url).hostname;
    const note=bounded(input.note,1600);
    const id='src-'+(Math.max(0,...current.map(s=>Number(String(s.id||'').match(/src-(\d+)/)?.[1]||0)))+1);
    return mutate(plan,p=>{
      p.sources=Array.isArray(p.sources)?p.sources:[];
      p.sources.push({id,title,url,type:detect(url),note,createdAt:new Date(date).toISOString(),status:note?'notes-utilisateur':'lien-non-analyse',linkedTaskId:null});
    },date);
  }
  function remove(plan,id,date=new Date()){
    validPlan(plan);if(!Array.isArray(plan.sources)||!plan.sources.some(s=>s.id===id))throw new Error('Source inconnue.');
    return mutate(plan,p=>{p.sources=p.sources.filter(s=>s.id!==id);p.weeks.forEach(w=>w.tasks.forEach(t=>{if(Array.isArray(t.sourceIds))t.sourceIds=t.sourceIds.filter(x=>x!==id);}));},date);
  }
  function suggestions(plan){
    validPlan(plan);
    const pending=plan.weeks.flatMap(w=>w.tasks.filter(t=>!t.completed).map(t=>({...t,week:w.number})));
    return (plan.sources||[]).filter(s=>!s.linkedTaskId).map(s=>{
      const words=(s.title+' '+s.note).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-z0-9]{4,}/g)||[];
      let best=null,score=-1;
      for(const t of pending){
        const corpus=(t.title+' '+t.description+' '+t.evidence).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const hits=new Set(words.filter(w=>corpus.includes(w))).size;
        if(hits>score){best=t;score=hits;}
      }
      return {sourceId:s.id,sourceTitle:s.title,sourceType:s.type,suggestedTaskId:best?.id||null,
        suggestedTaskTitle:best?.title||'Aucune tâche disponible',week:best?.week||null,
        reason:score>0?'Correspondance indicative de mots-clés avec une action':'Rapprochement proposé sans correspondance de contenu',
        sourceStatus:s.status,confirmed:false};
    });
  }
  function attach(plan,sourceId,taskId,date=new Date()){
    validPlan(plan);
    const src=(plan.sources||[]).find(s=>s.id===sourceId);
    const task=plan.weeks.flatMap(w=>w.tasks).find(t=>t.id===taskId);
    if(!src||!task)throw new Error('Source ou action inconnue.');
    return mutate(plan,p=>{
      const s=p.sources.find(x=>x.id===sourceId);
      s.linkedTaskId=taskId;
      const t=p.weeks.flatMap(w=>w.tasks).find(x=>x.id===taskId);
      t.sourceIds=Array.isArray(t.sourceIds)?t.sourceIds:[];
      if(!t.sourceIds.includes(sourceId))t.sourceIds.push(sourceId);
    },date);
  }
  function exportManifest(plan){validPlan(plan);return JSON.stringify({schema:'regroupement-trajectoire-v1',objective:plan.profile.goal,
    dry_run:true,auto_execute:false,warning:'Les liens ne sont pas analysés automatiquement depuis Trajectoire.',
    sources:(plan.sources||[]).map(s=>({url:s.url,type:s.type,title:s.title,notes:s.note,status:s.status}))},null,2);}
  return {normalizeUrl,detect,add,remove,suggestions,attach,exportManifest};
});
