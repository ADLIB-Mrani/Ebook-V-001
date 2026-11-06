# Trajectoire V2 × Regroupement — premiers outils intégrés

**Statut : prototype fonctionnel local, sans clé OpenAI et sans facture.** Cette intégration est volontairement progressive : elle donne un vrai flux de sources tout en séparant les fonctions déjà actives des fonctions futures.

## Déjà disponible dans Trajectoire

Dans le nouvel onglet **Studio de sources** :
- Ajout de sources HTTPS (documentation, tutoriels et YouTube), avec titre et notes personnelles.
- Détection automatique du type de lien ; notes et sources enregistrées localement avec ton plan.
- Propositions d'association des sources aux tâches basées sur des correspondances de mots-clés.
- Validation manuelle indispensable avant de lier une source à une action.
- Références et notes incluses dans l'ebook vivant (PDF via navigateur, Markdown).
- Export d'un manifeste `regroupement-trajectoire-v1`, toujours en `dry_run=true`, `auto_execute=false`.
- Import optionnel d'extraits obtenus avec le script Python décrit ci-dessous ; ils sont affichés comme **non vérifiés**.

**Aucune source n'est automatiquement téléchargée par la PWA** : elle fonctionne hors ligne et ne doit pas prétendre analyser une page sans l'avoir lue.

## Comment utiliser une extraction gratuite

1. Dans Trajectoire : créer un plan, ouvrir **Studio de sources**, ajouter 1 à 20 liens et exporter le manifeste JSON.
2. Installer Python 3 si nécessaire.
3. Sans connexion réseau ni paquet supplémentaire, vérifier/transformer un manifeste :

```sh
python3 trajectoire-v2/tools/regroupement_bridge.py \
  --manifest trajectoire-regroupement-sources.json \
  --output analyse.json
```

Ce premier appel **ne télécharge aucune source** ; c'est volontaire.

4. Pour lancer **manuellement** une vraie extraction de pages publiques, installer les dépendances Python gratuites :

```sh
python3 -m pip install requests beautifulsoup4 youtube-transcript-api
python3 trajectoire-v2/tools/regroupement_bridge.py \
  --manifest trajectoire-regroupement-sources.json \
  --output analyse.json \
  --fetch \
  --allow-host developer.mozilla.org \
  --allow-host www.youtube.com
```

- Ajouter un `--allow-host` pour **chaque domaine** que tu souhaites autoriser.
- Les URL doivent être HTTPS et publiques. Les redirections HTTP sont refusées ; les réponses volumineuses et les formats autres que HTML/texte sont exclus.
- Les vidéos YouTube nécessitent des transcriptions disponibles ; certains contenus sont restreints ou n'ont pas de transcription. Le script signale alors l'échec sans inventer un résumé.
- Le filtrage DNS est un garde-fou préalable, **pas une protection absolue contre les changements DNS** ; exécuter ce script uniquement sur une machine de confiance, avec des domaines de confiance.
- Respecter les conditions des sites, robots.txt, licences et droits d'auteur avant de réutiliser des contenus. Ne pas soumettre des URLs intranet ou contenant des données confidentielles.

5. Revenir dans Trajectoire et cliquer sur **Importer l’extraction** pour sélectionner `analyse.json`. Les extraits correspondants sont associés aux liens du projet, signalés « extrait importé, non vérifié », puis ajoutés à l'ebook.

## Rapport avec le dépôt original

Le dépôt [Regroupement](https://github.com/ADLIB-Mrani/Regroupement) contient un `SourceManager`, un scraper, un module de transcription YouTube, un orchestrateur IA optionnel et un moteur d'exécution.

Ce premier raccord **n'importe pas automatiquement le Python du dépôt Regroupement** et n'exécute aucune commande provenant de ses plans. Il reprend son modèle de corpus et produit un échange JSON sûr et autonome. L'exécution de scripts à partir de contenu Web est trop risquée pour être activée directement.

Pour les évolutions, le backend Regroupement pourra recevoir un adaptateur avec interface stable et contrôle des privilèges, après correction des opérations réseau, mise à jour de la bibliothèque YouTube et évaluation de la qualité du fallback.

## Fonctions encore à développer

| Fonction demandée | État aujourd'hui |
|---|---|
| Sources multiples | Fonctionne : liens HTTPS, titre, notes |
| Scraping Web | Optionnel dans le script local, sur demande explicite |
| Transcriptions YouTube | Optionnel dans le script local, selon disponibilité |
| Plans « fondés sur des sources » | Premiers rapprochements heuristiques et liens aux tâches ; aucune synthèse sémantique IA |
| Génération intelligente OpenAI | Non activée ; nécessite des crédits API non garantis gratuits |
| LLM local ou universitaire | Architecture future, à vérifier selon matériel/quotas |
| Exécution automatique | Désactivée : aucun plan n'est exécuté |
| Déploiement de fichiers / GitHub / infrastructure | À développer séparément, avec permissions limitées et approbation des actions |
| Mise à jour automatique d'ebooks depuis le Web | Non activée ; mise à jour par progrès et imports manuels |

## Préparation de l'exécution future

Le seul chemin raisonnable pour une exécution automatique serait une file d'actions **typées et autorisées**, pas une commande shell générée par IA :
- Action proposée avec source, justification, prévisualisation, ressources modifiées, coût estimé, risque.
- Exécution **simulée** et journal de changements d'abord.
- Validation par l'utilisateur, au besoin action par action ; actions sensibles soumises à autorisation.
- Sandbox isolé, limites CPU/mémoire, réseau restreint, secrets inaccessibles, rollback et audit.
- Interdire par défaut toute commande shell libre, accès aux clés privées, emails sortants, paiement ou publication automatique.
- Faire relire les documents externes avant de les interpréter comme des instructions ; ils sont des données non fiables.

## Lien maquette Figma

[Trajectoire V2 — UX/UI + Regroupement](https://www.figma.com/design/aNXPdz5Rx7O7X5kEPt6rZ4)

Écrans éditables : onboarding, tableau de bord, Studio de sources, parcours, ebook et mobile.

**Coût obligatoire du prototype : 0 €**, hors matériel, électricité et connexion Internet que tu utilises déjà. Les offres étudiantes et services tiers peuvent avoir des plafonds.


## Conseils personnalisés avec IA locale (Ollama, facultatif)

Un **modèle local** peut analyser les notes et extraits précédemment importés sans facture d'API. Cette fonctionnalité nécessite un ordinateur capable d'exécuter Ollama et un modèle déjà téléchargé (le téléchargement d'un modèle consomme de la connexion et de l'espace disque). Cela n'est pas nécessaire pour utiliser Trajectoire.

1. Télécharger et démarrer Ollama depuis https://ollama.com/ (site externe). Installer un modèle compatible en suivant sa documentation. Exemple de modèle à vérifier selon tes ressources : `qwen2.5:3b`.
2. Dans Trajectoire, exporter **un seul objectif** en JSON via « Sauvegarder ». Dans Studio de sources, exporter le manifeste, puis obtenir `analyse.json` avec `regroupement_bridge.py` (en mode sans réseau ou avec extraction explicite).
3. Lancer localement :

```sh
python3 trajectoire-v2/tools/local_ai_planner.py \
  --analysis analyse.json \
  --backup trajectoire-sauvegarde-v1.json \
  --output suggestions.json \
  --model qwen2.5:3b
```

4. Dans Studio de sources, choisir **Importer les conseils IA** et sélectionner `suggestions.json`. Lire chaque suggestion, puis **Accepter** ou **Ignorer**. Les seules URL conservées sont celles du corpus de départ.
5. Les conseils acceptés apparaissent dans les tâches et les éditions Markdown, EPUB et PDF de ton ebook.

Le script ne contacte que `127.0.0.1:11434` ou `localhost:11434`, sans clé API payante. Une **absence de serveur Ollama** produit une erreur explicite ; aucun appel facturable de secours n'est lancé.

**Limites :** les modèles locaux peuvent halluciner, les extraits récupérés restent non vérifiés et les informations Web ne sont pas rafraîchies automatiquement. Les documents sont traités comme des données non fiables, et aucune commande ou manipulation de système n'est exécutée à partir des conseils générés.
