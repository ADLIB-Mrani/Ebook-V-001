# Trajectoire V2 — coach d'objectifs à **0 € obligatoire**

Une V2 isolée du projet `automation-platform/` existant, pour tester un produit fonctionnel sans risquer de casser la V1.

## Déjà utilisable

- Formulaire français : objectif libre, type détecté ou explicite, durée, âge, niveau, compétences, temps disponible, budget, pays, contraintes.
- Moteur déterministe pour **web, création d'entreprise, revenus**, ou un parcours générique pour les autres objectifs.
- Étapes hebdomadaires, livrables vérifiables, échéances, jalons et alerte de faisabilité indicative.
- Suivi par tâche avec sauvegarde **dans le navigateur**, progression et recommandations des prochaines actions.
- Catalogue de ressources éditoriales réelles et liens externes ; elles ne sont **pas validées en temps réel**.
- Ebook HTML mis à jour à chaque changement de tâche, **imprimable en PDF** depuis le navigateur et exportable en Markdown.
- Sauvegarde et import JSON (à conserver en lieu sûr).
- Interface responsive, navigation au clavier, affichage imprimable, sans dépendances JS ni clé API.

### Lancer

Ouvre `index.html` dans le navigateur, ou démarre un serveur local :

```sh
python3 -m http.server 8000
# Ouvrir http://localhost:8000/trajectoire-v2/
```

Les scripts sont entièrement statiques. Pour tester le moteur avec Node.js 18+ :

```sh
node --test trajectoire-v2/engine.test.cjs
node --check trajectoire-v2/app.js
```

## Héberger à coût obligatoire nul

**GitHub Pages** suffit pour cette version. Dans ton dépôt public, ouvre **Settings → Pages**, sélectionne le déploiement de la branche `main` (dossier `/ (root)`) après fusion de la PR. Accède ensuite à :

`https://adlib-mrani.github.io/Ebook-V-001/trajectoire-v2/`

L'URL ne fonctionnera qu'une fois Pages activé et la branche fusionnée. Ne change pas la branche de publication avant d'avoir confirmé le mode de déploiement du dépôt.

**Limites du tout-statique :** localStorage n'est pas un compte multiappareils ; vider les données du navigateur efface le suivi sans sauvegarde. Aucune collecte, recherche web en direct, authentification, découverte automatique des ressources ni notification serveur. L'ebook est **évolutif en fonction des progrès**, pas un ebook qui vérifie seul l'actualité du web.

## Ce que le moteur fait réellement

Il **classe** les objectifs avec des règles simples, choisit un parcours de référence, répartit les semaines en phases puis propose 1–3 actions par semaine selon le temps disponible. Il signale quand le nombre d'heures paraît faible par rapport à un repère pédagogique indicatif. Il n'utilise pas de LLM pour inventer de fausses informations.

Ce n'est **pas** un diagnostic pédagogique personnalisé au sens scientifique, un moteur de recherche en temps réel ou une promesse de salaire ou de création d'entreprise. Les ressources sont sélectionnées manuellement. Les informations juridiques concernent principalement la France et doivent être revalidées avant toute démarche.

## Architecture d'évolution (sans surprise financière)

| Étape | Option | Coût / contrainte |
| --- | --- | --- |
| MVP statique | GitHub Pages + JS local | 0 € tant que les limites Pages sont respectées |
| Synchronisation entre appareils | Appwrite Education ou backend existant + base | Crédit/quotas étudiants : à activer et à surveiller |
| IA pour affiner les plans | Modèle local, ou fournisseur IA via backend sécurisé | Zéro facturation seulement si quotas gratuits confirmés |
| Alertes et rafraîchissement | GitHub Actions + registre de ressources validées | Respecter limites d'exécution et vérifier les sources |
| Observabilité | Sentry étudiant | Instrumentation optionnelle et contrôle des données transmises |
| Vérification navigateurs | BrowserStack étudiant | À activer lorsque l'URL publique de test existe |
| Design | Figma Education si éligible | Design gratuit selon l'offre exacte |

**Ne jamais envoyer une clé IA au navigateur**. Pour ajouter de l'IA multiutilisateurs, l'architecture doit inclure des quotas par utilisateur, une authentification et un proxy serveur avec limites de budget.

## Prochaines améliorations prioritaires

1. Enregistrer les parcours sur un backend avec connexion, suppression des données et sauvegardes (RGPD).
2. Créer un registre versionné de ressources : origine, licence, date de vérification, disponibilité, statut, revue humaine.
3. Ajouter un moteur de recherche documenté qui distingue suggestions, informations vérifiées et liens non vérifiés.
4. Vérifier les compétences via mini-évaluations avant de supprimer des étapes.
5. Réviser le programme en fonction du temps réellement investi et des obstacles rencontrés.
6. Transformer le livre vivant en PDF/Epub plus riche, avec changelog et sources par édition.

## Sécurité et protection des données

Aucune donnée envoyée à un serveur par le code de cette V2. Pas de compte, cookie, publicité, tracker ou analytics. Les champs sont échappés avant insertion HTML. Les liens externes ne sont accessibles qu'en HTTP(S), avec `noopener noreferrer`. Les imports JSON sont limités en taille et validés structurellement. Le contenu d'une sauvegarde reste de la **donnée utilisateur**, pas une instruction système.

Avant une publication grand public, ajouter tests de sécurité, politique de confidentialité complète, revue d'accessibilité, règles de sauvegarde et sécurité d'hébergement.

## Cadre éthique

Une cible comme « gagner 5 000 € par mois » reste un objectif, **jamais un revenu prédit ou garanti**. Les actions proposées privilégient les tests réels, la légalisation de l'activité et des preuves mesurables. Les utilisateurs mineurs reçoivent un rappel des restrictions possibles.
