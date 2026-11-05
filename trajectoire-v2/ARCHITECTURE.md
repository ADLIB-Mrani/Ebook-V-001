# Architecture cible — Trajectoire

> Document de conception. Ce qui suit décrit **une évolution**, et non des fonctionnalités déjà livrées dans la V2 statique.

## Vision

Un assistant de progression personnel qui transforme un objectif en :
1. Diagnostic initial contextualisé.
2. Plan d'action mesurable et réaliste.
3. Sélection de ressources **sourcées, pertinentes, datées et contrôlées**.
4. Suivi hebdomadaire et révision automatique du plan.
5. Ebook versionné qui reflète le travail réellement accompli et les nouvelles informations vérifiées.

## Principe : jamais de promesse non vérifiable

- Ne jamais annoncer qu'un utilisateur « gagnera 5 000 €/mois » ou « deviendra développeur » à une date certaine.
- Séparer **but**, **probabilité qualitative**, **charge estimée**, **preuves attendues** et **résultat observé**.
- Pour les règles fiscales, juridiques, médicales et les droits des mineurs : utiliser les sources officielles et présenter les limites, sans inventer l'éligibilité.
- Un score de pertinence est un classement éditorial, **pas** une probabilité de réussite calculée scientifiquement.
- L'IA n'invente jamais un URL de ressource : tous les liens externes passent par un registre vérifié.

## Architecture cible

```text
Frontend PWA (état local + offline)
    |
    +-- API authentifiée (quotas, validation, suppression de compte)
          |
          +-- Profil et objectifs (champs minimaux)
          +-- Plans et tâches versionnés (DB)
          +-- Évaluations + bilans de progrès (DB)
          +-- Moteur hybride (règles déterministes + IA optionnelle)
          |      +-- Catalogue de ressources vérifiées
          |      +-- Génération structurée avec schéma JSON
          |      +-- Filtre de faisabilité, heures, contraintes
          |      +-- Explications et citations liées à chaque action
          +-- File de travaux (révisions hebdomadaires)
          +-- Générateur d'ebook (version immuable, MD/HTML/PDF/EPUB)
          +-- Observabilité avec données personnelles expurgées
```

## Modèle des données (proposé)

- `profiles` : user_id, age_range plutôt que date de naissance, situation, pays, niveau, disponibilités, préférences.
- `goals` : id, user_id, texte, métrique de réussite, échéance, statut.
- `plans` : id, goal_id, version, created_at, generator_version, assumptions, confidence_notes.
- `tasks` : id stable, plan_id, ordre, temps prévu, description, preuve attendue, état, report_date.
- `check_ins` : user_id, goal_id, date, temps réellement disponible, obstacle, résultat.
- `resources` : id, title, canonical_url, publisher, topic, verified_at, checked_at, language, cost, licence, access_conditions.
- `plan_resources` : plan_id, resource_id, justification, score de pertinence explicable.
- `ebooks` : plan_version, catalog_snapshot, created_at, checksum, formats exportables.
- `audit_events` : changements utiles sans données sensibles dans les logs.

Chaque ligne utilisateur doit être propriétaire et protégée côté serveur (RLS ou autorisations documentées). Les clés d'administration doivent rester côté backend. Prévoir export et suppression des données.

## Moteur de planification : comment personnaliser vraiment

1. Définir une métrique de réussite concrète (projet livré, clients contactés, compétences testées).
2. Faire un court diagnostic : test pratique pour le développement, entretien de validation pour les projets entrepreneuriaux.
3. Calculer le budget horaire : `heures/semaine × semaines`, moins marge de sécurité.
4. Séparer prérequis, livrables, tâches et preuves.
5. Préférer 1 à 3 actions essentielles par semaine plutôt que des dizaines de conseils vagues.
6. Si le calendrier ne semble pas réaliste, proposer des arbitrages : réduire l'objectif, augmenter la durée, élargir le temps disponible.
7. Replanifier uniquement les tâches restantes après un bilan. Conserver les accomplissements et l'historique.
8. Contrôler la qualité d'un plan avec une grille de tests : faisabilité, pertinence des ressources, précision, sécurité, absence de liens inventés.

La V2 implémente une première approximation déterministe ; elle n'évalue pas objectivement les compétences.

## Recherche et mise à jour des ressources

**Pipeline futur** : liste de domaines autorisés → récupération des pages officielles / flux RSS / APIs autorisées → extraction métadonnées → validation URL + date + pays + coût → score de pertinence → approbation des changements à risque → publication du catalogue versionné.

Une simple requête HTTP 200 n'est **pas** une preuve que le contenu est vrai ou actuel. Pour les informations importantes (aides, tarifs, conditions), utiliser au minimum une source primaire datée et sauvegarder la date de contrôle.

Refuser la génération d'une référence non présente dans le catalogue, marquer les liens non vérifiés, respecter les licences et conditions d'utilisation. Un plan et son ebook conservent leur propre version du catalogue.

## Ebook vivant

- **Déclencheurs** : tâche cochée, bilan de suivi, nouvelle version de plan, nouvelle ressource validée.
- **Versions** : ne pas écraser une version déjà exportée ; conserver date, numéro, changements et sources.
- **Formats** : Markdown et HTML d'abord ; PDF via navigateur aujourd'hui, puis PDF/EPUB serveur si utile.
- **Révisions** : mettre à jour les recommandations sans supprimer les preuves, remarques et notes passées.

## 0 € à dépenser de sa poche : garde-fous

### Maintenant
- GitHub Pages pour la version statique. Disponible aux dépôts publics selon les conditions GitHub.
- GitHub Actions pour les tests, avec limites et quotas.
- Aucun appel IA payant, base de données, email ou service tiers obligatoire.

### Quand les utilisateurs auront besoin d'un compte
- Étudier Appwrite Education (authentification + base + fonctions) **après vérification de l'offre et de sa durée réelle**.
- Sinon, employer le backend Express/MongoDB existant dans une infrastructure gratuite et plafonnée.
- Vérifier l'hébergement Infomaniak étudiant : confirmer produits inclus, durée, limitations PHP/Node, base de données, CPU, trafic et renouvellement.

### Si une IA doit fonctionner pour tous les utilisateurs
- GitHub Copilot Student aide **le développeur**, pas la production d'une API IA pour tous.
- Utiliser une IA locale facultative (suivant les capacités de l'appareil) ou un modèle sur infrastructure universitaire autorisée.
- Les crédits Azure for Students ou autres offres servent à **prototyper** ; ils expirent et ne garantissent pas une exploitation illimitée.
- Budget technique obligatoire : `max_calls_per_user`, `max_tokens`, plafond par jour, cache, désactivation automatique à épuisement des crédits, aucun dépassement facturé.
- Sans ressource de calcul ou d'inférence gratuite disponible, **l'IA générative illimitée ne peut pas être garantie à 0 €**. Le moteur déterministe continue à fonctionner.

## Qualité et sécurité avant lancement public

1. Tests unitaires, tests d'intégration, tests E2E sur Chrome/Firefox/Safari, tests mobile via BrowserStack lorsque l'URL de staging existe.
2. Test d'accessibilité clavier, lecteur d'écran, contrastes, erreurs de formulaires.
3. Gestion de la confidentialité en Europe : information claire, base légale, export, suppression, rétention, consentement si nécessaire.
4. Authentification robuste, permissions par utilisateur, limites de requêtes, aucune clé dans le code public.
5. Tests de non-régression pour les objectifs à forts enjeux et la génération d'informations fausses.
6. Configuration Sentry sans capturer texte d'objectif, nom, e-mail ni données sensibles par défaut.

## Découpage réaliste du travail

**Itération 1 — réalisée :** prototype indépendant, roadmap, suivi local, ebooks dynamiques, ressources éditoriales, PWA, tests.

**Itération 2 :** maquettes Figma et tests UX réels ; création de compte et stockage serveur ; import des plans locaux ; suppression des données.

**Itération 3 :** registre de ressources avec vérification automatisée des changements et revue humaine ; moteurs de recherche autorisés et citations précises.

**Itération 4 :** évaluation interactive des compétences, IA optionnelle sous quota, planification adaptative plus fine.

**Itération 5 :** multiobjectif, notifications consenties, export EPUB, historique des éditions et outils d'analyse d'efficacité.

## Sources pour vérifier les offres

- GitHub Pages : https://docs.github.com/en/pages/getting-started-with-github-pages
- GitHub Education : https://education.github.com/pack
- Azure for Students : https://azure.microsoft.com/en-us/free/students
- Appwrite : https://appwrite.io/
- Infomaniak : demander les conditions exactes de l'offre obtenue par le titulaire

**Date de rédaction : 5 novembre 2026.** Les avantages, limites et prix peuvent évoluer.
