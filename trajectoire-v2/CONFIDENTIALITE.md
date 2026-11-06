# Confidentialité et sécurité — Trajectoire V2

**Date : 6 novembre 2026 — périmètre : prototype statique publié sur GitHub Pages.**

## Où vont les données ?

Trajectoire V2 stocke dans le **navigateur** les objectifs, la situation déclarée, l'âge saisi, le temps disponible, les compétences, les tâches, les notes de sources, les diagnostics et les bilans. Le code public de cette version ne transmet pas ces données à un serveur de Trajectoire.

Les fichiers JSON, Markdown, EPUB et PDF sont créés à la demande sur l'appareil. Une sauvegarde contient potentiellement des informations personnelles : il faut la conserver dans un emplacement privé et ne pas l'envoyer sur des canaux publics.

## Limites importantes

- La synchronisation entre appareils n'est pas activée : il faut exporter/importer le JSON.
- Vider les données du navigateur peut effacer tes objectifs. Sauvegarde-les régulièrement.
- Le site est distribué par **GitHub Pages**. Les journaux techniques de diffusion et la politique de GitHub relèvent de l'hébergeur : https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
- Ouvrir une ressource externe (YouTube, documentations, etc.) te dirige vers son propre site et sa politique de confidentialité.
- Les scripts Python optionnels fonctionnent localement. Le mode extraction `--fetch` contacte uniquement les domaines que l'utilisateur a explicitement autorisés. Les usages d'Ollama sont limités à un serveur local, mais il faut vérifier la configuration de l'ordinateur sur lequel il tourne.

## Supprimer ses données

Dans l'application, le bouton **Supprimer cet objectif** efface son entrée du portfolio local. Répète pour tous les objectifs si nécessaire. Pour supprimer toutes les autres données et caches du site, utilise les réglages de ton navigateur (données du site et service worker). Des sauvegardes JSON déjà téléchargées restent sous le contrôle de leur propriétaire et doivent être supprimées séparément.

## Sécurité des informations générées

- Les conseils relatifs aux revenus, entreprises et métiers ne sont pas des garanties de résultat.
- Les réponses d'un modèle local restent **non vérifiées** tant qu'un humain ne les a pas examinées.
- Aucune commande, transaction, publication ou suppression distante n'est exécutée automatiquement.
- Les URL externes et contenus des notes sont traités comme des **données non fiables**.
- Aucun mot de passe, clé API ou jeton GitHub ne doit être collé dans le formulaire d'objectif ou dans une source.

## Étapes nécessaires avant d'héberger des comptes utilisateurs

Pour passer à une version multiutilisateur synchronisée : choisir un responsable de traitement, documenter la base légale, la conservation, les droits d'accès/suppression, l'authentification, le chiffrement, les journaux et des permissions par utilisateur ; réaliser une revue sécurité et RGPD. **Ces fonctions ne sont pas actives dans la version statique.**
