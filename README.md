# Outil de suivi d'occupation des salles de cours | Les Petits Foufous - Projet GL02

Ce projet est à l'initiative de l'Université de la République de Sealand qui souhaite faciliter la gestion de ses locaux et l'organisation des étudiants et des enseignants en leur mettant à disposition un outil numérique commun de suivi d'occupation des salles de cours.

## Installation

Pour installer les dépendances nécessaires au bon fonctionnement de l'outil, veuillez utiliser cette commande dans un terminal :

```bash
npm install
```

## Fonctionnalités
Plusieurs commandes sont mises à votre disposition, vous pouvez avoir plus de détails dessus avec :
```bash
node . -help
```

Pour avoir des détails plus précis sur une certaine commande, il est possible de redemander l'aide sur cette dite commande :

```bash
node . <commande> -help
```

### Fonctionnalité n°1
Demander pour un cours donné les salles associées.
```bash
node . find-salles <chemin> <cours>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux
- `<cours>` Le cours à rechercher

### Fonctionnalité n°2
Récupérer les capacités maximales en termes de nombre de place d'une salle donnée
```bash
node . capacite-max <chemin> <salle>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux
- `<salle>` La salle à rechercher

### Fonctionnalité n°3
Vérifier la qualité des données d'emploi du temps dans la mesure où un créneau dans une salle ne peut être utilisé que par un seul enseignement et sans recouvrement possible.
```bash
node . verify-emploidutemps <chemin>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux

### Fonctionnalité n°4
Voir à quel moment de la semaine une certaine salle est libre
```bash
node . quand-libre-salle <chemin> <salle>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux
- `<salle>` La salle à rechercher

### Fonctionnalité n°5
Voir quelles salles seront libres pour un créneau donné dans la semaine
```bash
node . quelles-salles-libres <chemin> <creneau>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux
- `<creneau>` Le créneau à rechercher (format : J_HH:MM-HH:MM exemple: ME_10:00-12:00)

### Fonctionnalité n°6
 Générer un fichier iCalendar entre deux dates données pour les enseignements (CM, TD ou TP) auxquels il participe
```bash
node . ical <chemin> <usager> <debut> <fin>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux
- `<usager>` La personne dont on veut l'emploi du temps
- `<debut>` La date de début du calendrier généré, format : 25/11/2023
- `<fin>` La date de fin du calendrier généré, format : 25/11/2023

### Fonctionnalité n°7
Génération d'une visualisation synthétique du taux d'occupation des salles et un classement par capacité d'accueil
```bash
node . visualisation <chemin> <ordre>
```
Arguments :
- `<chemin>` Chemin du fichier ou du dossier contenant les créneaux
- `<ordre>` Ordre croissant (c) ou décroissant (d)

### Fonctionnalité n°8
Liste de toutes les salles existantes générée en fichier .txt à partir des fichiers .cru
```bash
node . listeSalles
```
Arguments :
néant

## Test

Pour tester l'outil, des jeu de données sont disponible dans le dossier `exemple_data`.

Exemple :
```bash
node . verify-emploidutemps ./exemple_data/small_exemple.cru
```


## Dépendances

Pour créer cet outil, nous avons utilisé les dépendances suivantes :<br>
- **vega-lite** : outil nous ayant permis de générer des visualisations de données<br>
- **canvas** : permet de retourner une image de la visualisation
- **colors** : permet de rajouter des couleurs dans la console
- **caporal** : permet de faire des commandes utilisables dans le terminal via un fichier

## Explications sur les écarts du cahier des charges

Nous avons modifié la spécification du format des données en ABNF retenue pour les fichiers de génération des informations de réservations par UE :
```abnf
fichier-cru = *(cours)

cours = "+" ue *(creneau)

ue = 4*(%x41-5A / DIGIT) CRLF

creneau = "1," type "," place ",H=" occurence *("/" occurence) "//" CRLF

type = ("C" / "D" / "T") 1*DIGIT

place = "P=" 1*DIGIT

occurence = temps "," indexSousGroupe "," salle

temps = horaire "-" horaire

horaire = (["0" / "1"] DIGIT / "2" %x30-33) ":" %x30-35 DIGIT

indexSousGroupe = "F" DIGIT

salle = "S=" %x41-5A 3DIGIT

DIGIT = %x30-39
CRLF = %x0D %x0A 
```

Nous avons aussi décidé d'ajouter l'ue à la spécification dy type Creneau pour la sémantique des données.

Voici les modifications apportés à certaines fonctionnalités du cahier des charges :

- **SPEC6** : Les actions ont été pensés pour être utilisés dans un GUI, il a donc fallu convertir ces actions en CLI. Quand on choisit l'horaire d'un cours, il est possible à tout moment de revenir en arrière en entrant `exit`. La génération du fichier iCal se fait lors du choix du cours en tapant `exit`. 
- **SPEC7** : Pas de boutons pour faire les démarches car notre outil s'utilise en ligne de commandes. Il n'y a pas de filtre pour choisir croissant et décroissant mais il faut l'indiquer dans la commande<br>

## Liste des contributeurs

**Professeur**
- Matthieu TIXIER

**Équipe Les Petits Foufous**
- Ali MIKOU
- Eyvan FAURE
- Alexis MARECHAL
- Louis HALLEY

**Équipe Les Sealanders**
- Flavien VIDAL
- Olivier BESNARD
- Aurele CHAMBON
- Tifenn NOËL
- Adrien TORRENT
