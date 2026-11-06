/* Local multi-objective workspace. No account or network; backward-compatible with V2 single-plan backups. */
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if(root) root.TrajectoireWorkspace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX_GOALS = 8;
  function isPlan(value) {
    return Boolean(value && value.schema === 2 && typeof value.id === 'string' && value.id.length <= 100 &&
      value.profile && typeof value.profile.goal === 'string' && value.profile.goal.length >= 8 &&
      value.profile.goal.length <= 220 && Array.isArray(value.weeks) &&
      value.weeks.length >= 1 && value.weeks.length <= 120 &&
      value.weeks.every(w => Array.isArray(w.tasks) && w.tasks.length > 0 && w.tasks.length <= 6 &&
        w.tasks.every(t => typeof t.id === 'string' && typeof t.title === 'string' &&
          t.title.length <= 300 && typeof t.completed === 'boolean')) &&
      Array.isArray(value.resources) && value.resources.length <= 30 &&
      Array.isArray(value.milestones) && Array.isArray(value.alerts));
  }
  function empty() { return {schema:'trajectoire-workspace-v1', activeId:null, plans:[]}; }
  function normalize(value, legacyPlan) {
    const data = value && typeof value === 'object' ? value : null;
    if(data && data.schema === 'trajectoire-workspace-v1' &&
      Array.isArray(data.plans) && data.plans.length <= MAX_GOALS &&
      data.plans.every(isPlan) && new Set(data.plans.map(p => p.id)).size === data.plans.length) {
      const activeId = data.plans.some(p => p.id === data.activeId) ? data.activeId : data.plans[0]?.id || null;
      return {schema:'trajectoire-workspace-v1',activeId,plans:data.plans};
    }
    if (legacyPlan && isPlan(legacyPlan)) return {schema:'trajectoire-workspace-v1',activeId:legacyPlan.id,plans:[legacyPlan]};
    return empty();
  }
  function upsert(workspace, plan) {
    if(!isPlan(plan)) throw new Error('Plan invalide.');
    const data=normalize(workspace);
    const index=data.plans.findIndex(p=>p.id===plan.id);
    if(index>=0)data.plans[index]=plan;
    else {
      if(data.plans.length>=MAX_GOALS)throw new Error('Limite de 8 objectifs locaux. Exporte tes sauvegardes avant de remplacer un objectif.');
      data.plans.push(plan);
    }
    data.activeId=plan.id;
    return data;
  }
  function choose(workspace,id) {
    const data=normalize(workspace);
    if(!data.plans.some(p=>p.id===id))throw new Error('Objectif inconnu.');
    data.activeId=id;
    return data;
  }
  function remove(workspace,id) {
    const data=normalize(workspace);
    if(!data.plans.some(p=>p.id===id))throw new Error('Objectif inconnu.');
    data.plans=data.plans.filter(p=>p.id!==id);
    if(data.activeId===id)data.activeId=data.plans[0]?.id||null;
    return data;
  }
  function active(workspace) {
    const data=normalize(workspace);
    return data.plans.find(p=>p.id===data.activeId)||null;
  }
  function exportAll(workspace) {
    const data=normalize(workspace);
    if(!data.plans.length)throw new Error('Aucun objectif à sauvegarder.');
    return JSON.stringify(data,null,2);
  }
  return {MAX_GOALS,isPlan,empty,normalize,upsert,choose,remove,active,exportAll};
});
