# Trajectoire V2 — coach d'objectifs à **0 € obligatoire**

**Site public : https://adlib-mrani.github.io/Ebook-V-001/trajectoire-v2/**

Une V2 isolée du projet `automation-platform/` existant, pour tester un produit fonctionnel sans risquer de casser la V1.

## Déjà utilisable

- Formulaire français : objectif libre, type détecté ou explicite, durée, âge, niveau, compétences, temps disponible, budget, pays, contraintes.
- Moteur déterministe pour **web, création d'entreprise, revenus**, ou un parcours générique pour les autres objectifs.
- Étapes hebdomadaires, livrables vérifiables, échéances, jalons et alerte de faisabilité indicative.
- Suivi par tâche avec sauvegarde **dans le navigateur**, progression, prochaines actions et bilans pour réorganiser les échéances sans effacer les tâches validées.
- Catalogue de ressources éditoriales réelles et liens externes ; elles ne sont **pas validées en temps réel**.
- **Studio de sources Regroupement** : sources HTTPS (tutoriels, documentations, YouTube), notes utilisateur, rapprochement heuristique avec les tâches, validation manuelle, export de corpus.
- **Script Python facultatif** d'extraction Web ou de transcriptions YouTube sur demande explicite et domaines autorisés, sans OpenAI API ; import des résultats dans le carnet (statut non vérifié).
- **Maquettes Figma éditables** : [Trajectoire V2 UX/UI + Regroupement](https://www.figma.com/design/aNXPdz5Rx7O7X5kEPt6rZ4).
- Ebook HTML mis à jour à chaque changement de tâche, **imprimable en PDF** depuis le navigateur et exportable en Markdown.
- **Jusqu'à 8 objectifs locaux** avec sélection et sauvegarde JSON de l'ensemble (aucun compte ni sync cloud).
- **Mini-diagnostic de 4 questions** par domaine, conseils ciblés, historique dans l'ebook ; résultat indicatif et non certifiant.
- **IA locale facultative** avec Ollama sur ordinateur compatible : suggestions tirées du corpus importé, jamais exécutées ou appliquées sans validation.
- **Ebook EPUB 3 hors ligne**, en plus du Markdown et du PDF via navigateur ; le contenu est généré au moment de l'export.
- Sauvegarde/import JSON (à conserver en lieu sûr).
- Interface responsive, navigation au clavier, affichage imprimable, **PWA installable et utilisable hors ligne après une première visite réussie**, sans dépendances JS ni clé API.

### Lancer

Ouvre `index.html` dans le navigateur, ou démarre un serveur local :

```sh
python3 -m http.server 8000
# Ouvrir http://localhost:8000/trajectoire-v2/
```

Les scripts de l'interface sont entièrement statiques. Pour tester les modules avec Node.js 22+ :

```sh
node --test trajectoire-v2/*.test.cjs
node --check trajectoire-v2/app.js
```

## Tests réels

La suite GitHub Actions **Trajectoire V2 quality** vérifie le moteur, les conseils IA importés et la structure ZIP des EPUB. La suite **Trajectoire V2 browsers** lance Chromium en desktop et mobile émulé pour tester création, progression, persistance, sources, diagnostic et exports. Les tests réels de scraping externe ou de modèle Ollama ne sont pas effectués automatiquement.

Pour lancer Playwright localement sur un PC disposant de Node et Python :

```sh
cd trajectoire-v2
npm install --no-audit --no-fund
npx playwright install chromium
npm run test:e2e
```

La dépendance Playwright est réservée aux **tests** et n'est jamais chargée par le site publié.

## Héberger à coût obligatoire nul

**GitHub Pages** suffit pour cette version. Dans ton dépôt public, ouvre **Settings → Pages**, sélectionne le déploiement de la branche `main` (dossier `/ (root)`) après fusion de la PR. Accède ensuite à :

`https://adlib-mrani.github.io/Ebook-V-001/trajectoire-v2/`

L'URL ne fonctionnera qu'une fois Pages activé et la branche fusionnée. Ne change pas la branche de publication avant d'avoir confirmé le mode de déploiement du dépôt.

**Limites du tout-statique :** plusieurs objectifs ne remplacent pas des comptes. localStorage n'est pas un compte multiappareils ; vider les données du navigateur efface le suivi sans sauvegarde. Aucune collecte, recherche web en direct, authentification, découverte automatique des ressources ni notification serveur. L'ebook est **évolutif en fonction des progrès**, pas un ebook qui vérifie seul l'actualité du web.

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
5. Ajouter un vrai diagnostic de compétences et une adaptation de la difficulté, au-delà des bilans de disponibilité déjà intégrés.
6. Transformer le livre vivant en PDF/Epub plus riche, avec changelog et sources par édition.

## Sécurité et protection des données

Aucune donnée envoyée à un serveur par le code de cette V2. Pas de compte, cookie, publicité, tracker ou analytics. Les champs sont échappés avant insertion HTML. Les liens externes ne sont accessibles qu'en HTTP(S), avec `noopener noreferrer`. Les imports JSON sont limités en taille et validés structurellement. Le contenu d'une sauvegarde reste de la **donnée utilisateur**, pas une instruction système.

Avant une publication grand public, ajouter tests de sécurité, politique de confidentialité complète, revue d'accessibilité, règles de sauvegarde et sécurité d'hébergement.

## Cadre éthique

Une cible comme « gagner 5 000 € par mois » reste un objectif, **jamais un revenu prédit ou garanti**. Les actions proposées privilégient les tests réels, la légalisation de l'activité et des preuves mesurables. Les utilisateurs mineurs reçoivent un rappel des restrictions possibles.


## Intégration Regroupement

Le guide étape par étape est dans [REGROUPEMENT.md](REGROUPEMENT.md). La PWA ne récupère jamais de données sur des URL distantes sans action explicite. Le script local `tools/regroupement_bridge.py` permet une extraction optionnelle ; aucune exécution de commandes ni utilisation payante d'OpenAI n'est activée.


## Option IA locale (aucune facture de fournisseur)

Le script `tools/local_ai_planner.py` accepte l'export des sources et un plan Trajectoire, puis utilise **Ollama sur localhost uniquement**. Il ne télécharge aucun modèle automatiquement et n'envoie rien à OpenAI, Azure ou un autre service. La capacité de ton ordinateur et le modèle installé déterminent si cela fonctionne.

Les conseils générés sont exportés en JSON ; les actions ne changent **qu'après validation explicite** dans le Studio de sources. Voir [REGROUPEMENT.md](REGROUPEMENT.md) pour le mode d'emploi.

## Stockage et confidentialité

Les profils et les objectifs restent dans le stockage local du navigateur. Choisis **Sauvegarder tous** pour pouvoir les restaurer ailleurs. Une sauvegarde JSON peut contenir tes objectifs personnels : ne la publie pas. Aucun suivi multiappareil ni notifications à distance n'est inclus.

Voir [CONFIDENTIALITE.md](CONFIDENTIALITE.md).
