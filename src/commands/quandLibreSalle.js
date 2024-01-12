let quandLibreSalle = (creneaux, salle) => {

    let creneauxPris = [];
    for (let creneau of creneaux.creneaux) {
        if (creneau.salle === salle) {
            creneauxPris.push(creneau.horaire);
        }
    }

    // disponibilités possibles
    let disponibilites = ['L 8h00-20h00', 'MA 8h00-20h00', 'ME 8h00-20h00', 'J 8h00-20h00', 'V 8h00-20h00', 'S 8h00-20h00']

    // ajuster les disponibilités en fonction des créneaux pris
    for (let creneauPris of creneauxPris) {
        disponibilites = ajusterDisponibilites(disponibilites, creneauPris, creneauxPris);
    }

    // on nettoie les disponibilités impossibles qui auraient pu être créées
    clearDispos(disponibilites);

    // on corrige les disponibilités dans le cas d'un créneau qui commence à 8h00 possible
    ajusterDebutDisponibilites(disponibilites, creneauxPris);

    // on nettoie les disponibilités impossibles qui auraient pu être créées
    clearDispos(disponibilites);

    // on trie les disponibilités
    triDispos(disponibilites);

    // On élimine les disponibilitées du style "V 20h00-20h00"
    let disponibilitesFiltrees = [];
    disponibilites.forEach(heure => {
        const plageHoraire = heure.split(' ')[1].split('-');
        if (plageHoraire[0] !== plageHoraire[1]) {
            disponibilitesFiltrees.push(heure);
        }
    });
    disponibilites = disponibilitesFiltrees;

    // on renvoie les disponibilités
    let creneauxLibres = new Set(disponibilites);

    return creneauxLibres;
}

// fonction pour ajuster les disponibilités en fonction des créneaux pris
let ajusterDisponibilites = (disponibilites, creneauPris, creneauxPris) => {

    let jour = creneauPris.split(' ')[0];
    let heurePrise = creneauPris.split(' ')[1].split('-')[1];

    let heurePriseDebut = parseInt(creneauPris.split(' ')[1].split('-')[0].split(':')[0], 10);
    let heurePriseFin = parseInt(creneauPris.split(' ')[1].split('-')[1].split(':')[0], 10);

    // Trouver l'index du jour dans les disponibilités
    let indexJour = disponibilites.findIndex(d => d.startsWith(jour));
    
    // Si l'index est trouvé, ajuster les heures disponibles
    if (indexJour !== -1) {
        disponibilites.push(jour + ' ' + heurePriseFin + 'h00-' + nextDispo(creneauPris, creneauxPris) + 'h00');
    }
    
    return disponibilites;
}

// fonction pour trouver l'heure de début du prochain créneau pris
let nextDispo = (creneauPris, creneauxPris) => {
   
    let jour = creneauPris.split(' ')[0];
    let heurePrise = creneauPris.split(' ')[1].split('-')[1];

    let heurePriseDebut = parseInt(creneauPris.split(' ')[1].split('-')[0].split(':')[0], 10);

    
    let index = creneauxPris.indexOf(creneauPris);
    let next = creneauxPris[index + 1];
    

    if (next === undefined) {
        return 20;
    }

    let nextJour = next.split(' ')[0];

    if (jour !== nextJour) {
        return 20;
    }

    let nextHeurePriseDebut = parseInt(next.split(' ')[1].split('-')[0].split(':')[0], 10);

    return nextHeurePriseDebut;
}


let clearDispos = (disponibilites) => {

    let index = disponibilites.findIndex(d => d.split(' ')[1].split('-')[0] === d.split(' ')[1].split('-')[1]);
    if (index !== -1) {
        disponibilites.splice(index, 1);
    }

    let dispoParJour = new Map();
    for (let dispo of disponibilites) {
        let jour = dispo.split(' ')[0];
        if (!dispoParJour.has(jour)) {
            dispoParJour.set(jour, 1);
        } else {
            dispoParJour.set(jour, dispoParJour.get(jour) + 1);
        }
    }

    for (let [jour, nbDispo] of dispoParJour) {
        if (nbDispo > 1) {
            let index = disponibilites.findIndex(d => d.startsWith(jour + ' 8h00-20h00'));
            if (index !== -1) {
                disponibilites.splice(index, 1);
            }
        }
    }
}


let ajusterDebutDisponibilites = (disponibilites, creneauxPris) => {
    
    let dispoParJour = new Map();
    for (let dispo of disponibilites) {
        let jour = dispo.split(' ')[0];
        if (!dispoParJour.has(jour)) {
            dispoParJour.set(jour, 1);
        } else {
            dispoParJour.set(jour, dispoParJour.get(jour) + 1);
        }
    }

    for (let [jour, nbDispo] of dispoParJour) {
        let index = disponibilites.findIndex(d => d.startsWith(jour + ' 8h00-'));
        if (index === -1) {
            let heureDebut = 20;
            for (let creneauPris of creneauxPris) {
                if (creneauPris.startsWith(jour)) {
                    let heureDebutCreneau = parseInt(creneauPris.split(' ')[1].split('-')[0].split(':')[0], 10);
                    if (heureDebutCreneau < heureDebut) {
                        heureDebut = heureDebutCreneau;
                    }
                }
            }
            disponibilites.push(jour + ' 8h00-' + heureDebut + 'h00');
        }
    }
    
}

let triDispos = (disponibilites) => {
    // Définir l'ordre des jours de la semaine
    const joursOrdre = ['L', 'MA', 'ME', 'J', 'V', 'S'];

    // On trie les disponibilités par jour puis par heure de début
    disponibilites.sort((a, b) => {
        const [jourA, heureA] = a.split(' ');
        const [jourB, heureB] = b.split(' ');

        // Comparer les jours en utilisant l'ordre défini dans le tableau
        const ordreA = joursOrdre.indexOf(jourA);
        const ordreB = joursOrdre.indexOf(jourB);

        if (ordreA < ordreB) {
            return -1;
        } else if (ordreA > ordreB) {
            return 1;
        }

        // Si les jours sont égaux, comparer les heures de début
        const heureDebutA = parseInt(heureA.split('-')[0], 10);
        const heureDebutB = parseInt(heureB.split('-')[0], 10);

        return heureDebutA - heureDebutB;
    });
}

module.exports = quandLibreSalle;