# Modèle de Cas d'Utilisation - Restaurant Admin

Ce document présente les acteurs et le modèle de cas d'utilisation pour l'application d'administration du restaurant.

## Acteurs

* Administrateur
* Utilisateur anonyme
* Client public
* Système

## Cas d'utilisation

### Administrateur

* Se connecter
* Se déconnecter
* Consulter le tableau de bord
* Gérer les réservations
* Gérer les tables et emplacements
* Gérer les services
* Gérer les dates bloquées
* Gérer le planning / calendrier
* Gérer les rapports
* Gérer les paramètres du restaurant
* Vérifier le profil actuel
* Maintenir le statut des réservations

### Utilisateur anonyme

* S'inscrire
* Demander la réinitialisation du mot de passe
* Réinitialiser le mot de passe
* Vérifier l'adresse e-mail
* Renvoyer l'e-mail de vérification

### Client public

* Consulter les dates bloquées
* Consulter les créneaux disponibles
* Vérifier la disponibilité de réservation

## Diagramme de cas d'utilisation (Mermaid simplifié)

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#f8f0e3', 'edgeLabelBackground':'#ffffff', 'actorBorder':'#9c6644', 'actorTextColor':'#423428', 'textColor':'#423428' }}}%%
usecaseDiagram

actor Administrateur as Admin
actor "Utilisateur anonyme" as Anonymous
actor "Client public" as Guest
actor Système as System

Admin --> (Se connecter)
Admin --> (Se déconnecter)
Admin --> (Consulter le tableau de bord)
Admin --> (Gérer les réservations)
Admin --> (Gérer les tables et emplacements)
Admin --> (Gérer les services)
Admin --> (Gérer les dates bloquées)
Admin --> (Gérer le planning / calendrier)
Admin --> (Gérer les rapports)
Admin --> (Gérer les paramètres du restaurant)
Admin --> (Vérifier le profil actuel)
Admin --> (Maintenir le statut des réservations)

Anonymous --> (S'inscrire)
Anonymous --> (Demander la réinitialisation du mot de passe)
Anonymous --> (Réinitialiser le mot de passe)
Anonymous --> (Vérifier l'adresse e-mail)
Anonymous --> (Renvoyer l'e-mail de vérification)

Guest --> (Consulter les dates bloquées)
Guest --> (Consulter les créneaux disponibles)
Guest --> (Vérifier la disponibilité de réservation)

(Consulter le tableau de bord) ..> (Consulter les réservations récentes) : inclut
(Gérer les réservations) ..> (Voir le détail d'une réservation) : inclut
(Gérer les réservations) ..> (Créer une réservation) : inclut
(Gérer les réservations) ..> (Modifier le statut de réservation) : inclut
(Gérer les réservations) ..> (Affecter une table) : inclut
(Gérer les réservations) ..> (Supprimer une réservation) : inclut
(Gérer les réservations) ..> (Supprimer plusieurs réservations) : inclut
(Gérer les réservations) ..> (Exporter les réservations) : inclut

(Gérer les tables et emplacements) ..> (Ajouter une table) : inclut
(Gérer les tables et emplacements) ..> (Modifier une table) : inclut
(Gérer les tables et emplacements) ..> (Activer / désactiver une table) : inclut
(Gérer les tables et emplacements) ..> (Gérer les emplacements de table) : inclut
(Gérer les emplacements de table) ..> (Ajouter un emplacement) : inclut
(Gérer les emplacements de table) ..> (Modifier un emplacement) : inclut
(Gérer les emplacements de table) ..> (Supprimer un emplacement) : inclut

(Gérer les services) ..> (Ajouter un service) : inclut
(Gérer les services) ..> (Modifier un service) : inclut
(Gérer les services) ..> (Supprimer un service) : inclut
(Gérer les services) ..> (Exporter les services) : inclut

(Gérer les dates bloquées) ..> (Bloquer une date) : inclut
(Gérer les dates bloquées) ..> (Débloquer une date) : inclut
(Gérer les dates bloquées) ..> (Exporter les dates bloquées) : inclut

(Gérer le planning / calendrier) ..> (Voir le calendrier) : inclut
(Gérer le planning / calendrier) ..> (Naviguer dans le calendrier) : inclut
(Gérer le planning / calendrier) ..> (Voir la chronologie des réservations) : inclut
(Gérer le planning / calendrier) ..> (Exporter le planning) : inclut

(Gérer les rapports) ..> (Voir les rapports) : inclut
(Gérer les rapports) ..> (Filtrer les rapports) : inclut
(Gérer les rapports) ..> (Exporter les rapports) : inclut

(Gérer les paramètres du restaurant) ..> (Voir les informations du restaurant) : inclut
(Gérer les paramètres du restaurant) ..> (Modifier les informations du restaurant) : inclut
(Gérer les paramètres du restaurant) ..> (Modifier les notifications) : inclut
(Gérer les paramètres du restaurant) ..> (Modifier les horaires) : inclut
```

## Remarques

- Ce modèle est simplifié pour faciliter le dessin et la lecture.
- Utilisez un visualiseur Mermaid ou un éditeur Markdown compatible pour afficher le diagramme.
