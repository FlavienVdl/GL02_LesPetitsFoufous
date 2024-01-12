const fs = require('fs');
const path = require('path');

let listeSalles = () => {
// function listeSalles() {
    const repertoire = '../exemple_data';
    const fichierSortie = '../liste_salles.txt';

    // on stocke tous les fichiers du repertoire passé en parametre dans une variable
    const fichiersCru = lireFichiersCruDansRepertoire(repertoire);

    // initialisation de la liste des salles à vide
    let salles = [];

    // on parcourt chaque fichier present dans le repertoire passé en parametre
    fichiersCru.forEach(fichier => {
        // on conserve uniquement les fichiers au bon format .cru
        if (path.extname(fichier) === '.cru') {
            // on lit le contenu de chaque fichier .cru
            const contenu = fs.readFileSync(fichier, 'utf-8');
            //on extrait les salles du contenu de chaque fichier lu
            const sallesDuFichier = extraitSallesDuContenu(contenu);
            // on ajoute les salles à la liste générale
            salles = salles.concat(sallesDuFichier);
        }
    });

    // on supprime les potentiels doublons en regardant les 5 premiers caracteres des salles
    // salles = [...new Set(salles)];
    salles = Array.from(new Set(salles.map(salle => salle.substring(0, 4))));

    // on ecrit la liste des salles dans le fichier de sortie
    fs.writeFileSync(fichierSortie, salles.join('\n'), 'utf-8');

    // console.log(`La liste des salles a été générée dans le fichier ${fichierSortie}`);

    return salles;
}

// on utilise une fonction récursive pour lire tous les fichiers .cru des sous-répertoires
let lireFichiersCruDansRepertoire = (repertoire) => {
// function lireFichiersCruDansRepertoire(repertoire) {
    let fichiersCru = [];

    // on liste les fichiers du répertoire
    const fichiersDansRepertoire = fs.readdirSync(repertoire);

    fichiersDansRepertoire.forEach(fichier => {
        const cheminFichier = path.join(repertoire, fichier);

        // on verifie qu'il s'agit bien d'un dossier
        if (fs.statSync(cheminFichier).isDirectory()) {
            // on lit récursivement les fichiers .cru du sous-répertoire
            fichiersCru = fichiersCru.concat(lireFichiersCruDansRepertoire(cheminFichier));
            } else if (path.extname(fichier) === '.cru') {
            // on ajoute le chemin du fichier .cru à la liste
            fichiersCru.push(cheminFichier);
        }
    });
    // on retourne le tableau de tous les fichiers .cru des sous-repertoires
    return fichiersCru;
}

// on extrait les salles du contenu
let extraitSallesDuContenu = (contenu) => {
// function extraitSallesDuContenu(contenu) {
    const lignes = contenu.split('\n');
    const salles = [];
    lignes.forEach(ligne => {
        // expression reguliere pour recuperer la valeur entre "S=" et "//", selon la structure des fichiers
        const match = ligne.match(/S=([A-Za-z].*?)\/\//);
        // const match = ligne.match(/S=([A-Za-z][^\/]*[^A-Za-z\/])\//);
        // si il y a match alors la chaine de caracteres relevee est ajoutee au tableau de salles
        if (match && match[1]) {
            salles.push(match[1].trim());
        }
    });
    // on trie les salles dans l'ordre alphabetique
    salles.sort();
    // on retourne le tableau de toutes les salles
    return salles;
}

module.exports = listeSalles;