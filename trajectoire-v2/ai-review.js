/* Only import and review locally generated, non-executed suggestions. No model calls here. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.TrajectoireAIReview=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function limit(x,max){return String(x===undefined||x===null?'':x).trim().slice(0,max);}
  function updated(plan,fn,date=new Date()){
    const p=JSON.parse(JSON.stringify(plan));fn(p);p.revision=Number(p.revision||0)+1;p.updatedAt=new Date(date).toISOString();return p;
  }
  function importProposals(plan,data,date=new Date()){
    if(!plan||plan.schema!==2||!Array.isArray(plan.weeks))throw new Error('Plan Trajectoire invalide.');
    if(!data||data.schema!=='trajectoire-ai-suggestions-v1'||data.source!=='ollama-local'||
       data.dry_run!==true||data.executed!==false||data.approved!==false||!Array.isArray(data.suggestions)||
       data.suggestions.length>4)throw new Error('Les conseils doivent venir du moteur local en mode simulation.');
    if(data.objective!==plan.profile.goal)throw new Error('Les conseils concernent un autre objectif.');
    const ids=new Set(plan.weeks.flatMap(w=>w.tasks.filter(t=>!t.completed).map(t=>t.id)));
    const urls=new Set((plan.sources||[]).map(s=>s.url));
    const seen=new Set(), proposals=[];
    for(const item of data.suggestions){
      if(!item||typeof item.taskId!=='string'||!ids.has(item.taskId)||seen.has(item.taskId)||
         typeof item.advice!=='string'||item.advice.length<12||item.advice.length>500)continue;
      seen.add(item.taskId);
      proposals.push({
        taskId:item.taskId,advice:limit(item.advice,500),reason:limit(item.reason,450),
        sourceUrls:Array.isArray(item.sourceUrls)?item.sourceUrls.filter(u=>urls.has(u)).slice(0,4):[],
        status:'conseil-non-verifie',model:limit(data.model,100)
      });
    }
    if(!proposals.length)throw new Error('Aucun conseil ne correspond aux actions et aux sources actuelles.');
    return updated(plan,p=>{p.aiPending=proposals;},date);
  }
  function decide(plan,taskId,accept,date=new Date()){
    const selected=(plan.aiPending||[]).find(x=>x.taskId===taskId);
    if(!selected)throw new Error('Conseil inconnu ou déjà examiné.');
    return updated(plan,p=>{
      if(accept){
        const task=p.weeks.flatMap(w=>w.tasks).find(t=>t.id===taskId);
        if(!task)throw new Error('Action indisponible.');
        task.aiTip=selected.advice;
        task.aiSourceUrls=selected.sourceUrls;
        task.aiNote='Suggestion locale approuvée manuellement ; vérifier les faits et les liens originaux.';
      }
      p.aiPending=p.aiPending.filter(x=>x.taskId!==taskId);
      p.aiHistory=Array.isArray(p.aiHistory)?p.aiHistory.slice(-19):[];
      p.aiHistory.push({taskId,accepted:Boolean(accept),date:new Date(date).toISOString(),model:selected.model});
    },date);
  }
  return {importProposals,decide};
});
