let quellesSallesLibres = (creneaux, creneau, logger) => {
    // creneau est au format ME_10:00-12:00 ou J_10:00-12:00, on cherche les salles libres pour ce créneau

    // Vérifier que les créeneaux existent (pas après 23h59)
    let hr = creneau.split("_")[1].split("-");
    let deb = hr[0];
    let fn = hr[1];
    let debutNum = parseInt(deb.replace(":", ""), 10);
    let finNum = parseInt(fn.replace(":", ""), 10);
    if (debutNum > 2359 || finNum > 2359){
        logger.info("The creneau starts after midnight !".red);
        return new Set("@");
    }

    let creneauSplit = creneau.split("_");
    let jour = creneauSplit[0];
    let horaires = creneauSplit[1].split("-");
    let debut = horaires[0];
    let fin = horaires[1];

    let sallesOccupees = new Set();

    creneaux.creneaux.forEach((creneauItem) => {
        const horairesItem = creneauItem.horaire.split(" ");
        const jourItem = horairesItem[0];
        const horairesPlage = horairesItem[1].split("-");
        const creneauDebutNum = parseInt(horairesPlage[0].replace(":", ""), 10);
        const creneauFinNum = parseInt(horairesPlage[1].replace(":", ""), 10);
        const debutNum = parseInt(debut.replace(":", ""), 10);
        const finNum = parseInt(fin.replace(":", ""), 10);

        if (
            jour === jourItem &&
            (
                (creneauDebutNum < finNum && creneauFinNum > debutNum) ||
                (creneauDebutNum >= debutNum && creneauFinNum <= finNum)
            )
        ) {
            sallesOccupees.add(creneauItem.salle);
        }
    });

    let sallesLibres = new Set();

    // on récupère les salles libres
    creneaux.creneaux.forEach((creneauItem) => {
        if (!sallesOccupees.has(creneauItem.salle)) {
            sallesLibres.add(creneauItem.salle);
        }
    });

    return sallesLibres;
}

module.exports = quellesSallesLibres;