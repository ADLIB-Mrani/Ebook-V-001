/* Diagnostic pédagogique indicatif, sans IA et sans profilage distant. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.TrajectoireDiagnostic=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const bank={
 web:[
  {q:'Quel élément HTML identifie le contenu principal d’une page ?',options:['<main>','<div> uniquement','<br>','<small>'],answer:0,why:'Une structure HTML sémantique est une base de l’accessibilité.',topic:'html'},
  {q:'Que signifie une conception responsive ?',options:['Une seule taille d’écran','Une interface adaptée à plusieurs tailles d’écran','Un site uniquement mobile','Un site avec des animations'],answer:1,why:'Le responsive adapte la présentation aux différents appareils.',topic:'css'},
  {q:'Comment tester qu’une fonction renvoie le résultat attendu ?',options:['Augmenter la taille de la police','Ajouter un commentaire','Écrire un test avec une entrée et un résultat attendu','Changer le nom du fichier'],answer:2,why:'Les tests rendent les comportements vérifiables.',topic:'tests'},
  {q:'Pourquoi utiliser Git ?',options:['Conserver l’historique des changements','Remplacer HTML','Payer un hébergement','Accélérer le navigateur'],answer:0,why:'Git sert au versionnement et facilite les collaborations.',topic:'git'}
 ],
 business:[
  {q:'Pour vérifier un problème client, il vaut mieux…',options:['Créer un logo','Interroger des personnes concernées sans leur souffler la réponse','Payer des publicités immédiatement','Acheter un nom de domaine'],answer:1,why:'Des entretiens exploratoires testent le besoin avant l’investissement.',topic:'clients'},
  {q:'Quel résultat indique le mieux une demande réelle ?',options:['Des compliments polis','Des vues de réseaux sociaux','Un engagement concret à essayer ou acheter','Le nombre de pages du business plan'],answer:2,why:'Les intentions explicites ou actions comptent plus que les opinions.',topic:'validation'},
  {q:'Un seuil de rentabilité dépend principalement…',options:['Du prix et des coûts','Du nom de l’entreprise','De la couleur du logo','Du nombre de followers seul'],answer:0,why:'Prix, coûts et volume permettent d’évaluer la viabilité.',topic:'budget'},
  {q:'Avant de vendre, il faut…',options:['Ignorer les obligations','Copier les mentions légales d’un concurrent','Vérifier les formalités applicables dans son pays','Promettre des gains garantis'],answer:2,why:'Les obligations varient selon la juridiction et l’activité.',topic:'legal'}
 ],
 income:[
  {q:'5 000 € de chiffre d’affaires correspondent-ils à 5 000 € de bénéfice ?',options:['Oui toujours','Non, il faut soustraire coûts et charges','Seulement le lundi','Oui si le client paie en ligne'],answer:1,why:'Il faut distinguer ventes, charges, bénéfice et revenu disponible.',topic:'budget'},
  {q:'Une offre de service claire doit mentionner…',options:['Un résultat, un livrable et ses limites','Une garantie de richesse','Uniquement une photo','Une liste de 30 hashtags'],answer:0,why:'Une proposition claire facilite l’évaluation par le client.',topic:'offre'},
  {q:'Quelle démarche est la plus pertinente pour démarrer ?',options:['Envoyer 10 000 messages identiques','Acheter des avis','Contacter quelques prospects ciblés avec une offre utile','Garantir des résultats non vérifiés'],answer:2,why:'La prospection ciblée évite le spam et produit des retours qualitatifs.',topic:'prospection'},
  {q:'Quand revoir un prix ?',options:['Jamais','Après mesure du temps, coûts, demande et retours','Uniquement si un ami le propose','Au hasard chaque matin'],answer:1,why:'Un ajustement se fonde sur les marges et signaux du marché.',topic:'prix'}
 ],
 general:[
  {q:'Quel objectif est le plus facile à vérifier ?',options:['Devenir meilleur un jour','Être motivé','Livrer un prototype testé avant une date précise','Faire de son mieux sans échéance'],answer:2,why:'Un livrable observable et une date rendent les progrès évaluables.',topic:'mesure'},
  {q:'Quel est un bon signe de progression ?',options:['Une preuve produite et évaluée','Du temps passé sans résultat','Une citation inspirante','Une application téléchargée'],answer:0,why:'Une preuve concrète apporte un retour plus fiable.',topic:'preuve'},
  {q:'Si un planning devient irréaliste, il faut…',options:['Cacher le retard','Adapter le périmètre, le temps ou l’échéance','Abandonner immédiatement','Multiplier les tâches simultanément'],answer:1,why:'Les plans doivent évoluer en fonction des contraintes observées.',topic:'adaptation'},
  {q:'Pourquoi demander un retour externe ?',options:['Pour ne rien changer','Pour valider la qualité et identifier des difficultés','Pour publier des secrets','Pour obtenir une garantie de réussite'],answer:1,why:'Les retours améliorent l’auto-évaluation.',topic:'feedback'}
 ]
};
function quiz(track){return (bank[bank[track]?track:'general']).map(({q,options,topic},i)=>({id:i,question:q,options:options.slice(),topic}));}
function grade(track,answers){
 const items=bank[bank[track]?track:'general'];
 if(!Array.isArray(answers)||answers.length!==items.length||answers.some(a=>!Number.isInteger(a)||a<0||a>3))throw new Error('Réponds aux 4 questions pour obtenir un bilan.');
 const correct=items.map((q,i)=>q.answer===answers[i]);
 const score=correct.filter(Boolean).length;
 return {track:bank[track]?track:'general',score,total:items.length,
   level:score>=3?'intermediaire':'debutant',
   strengths:items.filter((q,i)=>correct[i]).map(q=>q.topic),
   workOn:items.filter((q,i)=>!correct[i]).map(q=>({topic:q.topic,tip:q.why})),
   note:'Test de découverte de 4 questions : résultat indicatif, ne certifie ni le niveau avancé ni l’employabilité.'};
}
function apply(plan,result,date=new Date()){
 if(!plan||plan.schema!==2||!Array.isArray(plan.weeks))throw new Error('Parcours absent.');
 if(!result||result.track!==plan.profile.track||!Number.isInteger(result.score)||
   ![0,1,2,3,4].includes(result.score)||!['debutant','intermediaire'].includes(result.level))throw new Error('Bilan invalide.');
 const copy=JSON.parse(JSON.stringify(plan));
 copy.diagnostics=Array.isArray(copy.diagnostics)?copy.diagnostics.slice(-9):[];
 copy.diagnostics.push({...result,date:new Date(date).toISOString()});
 copy.profile.level=result.level;
 copy.revision=Number(copy.revision||1)+1;
 copy.updatedAt=new Date(date).toISOString();
 copy.alerts=copy.alerts.filter(a=>!a.startsWith('Mini-diagnostic'));
 copy.alerts.push('Mini-diagnostic : '+result.score+'/'+result.total+' réponses correctes. Niveau de départ suggéré : '+result.level+'. Une pratique réelle reste nécessaire pour confirmer les compétences.');
 const focus=result.workOn.map(t=>t.topic).slice(0,2);
 const next=copy.weeks.flatMap(w=>w.tasks).filter(t=>!t.completed).slice(0,3);
 for(const t of next)t.coachingTip=focus.length?'Réviser en priorité : '+focus.join(', ')+'.':'Consolider les acquis avec un projet et une revue externe.';
 return copy;
}
return {quiz,grade,apply};
});
