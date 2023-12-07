class EnsembleCreneaux {
    constructor() {
        this.creneaux = new Set();
    }

    addCreneau = (unNouveauCreneau) => {
        this.creneaux.forEach(unCreneau => {
            if (unNouveauCreneau.estEnConflit(unCreneau)) {
                console.log("ERREUR : Ce créneau est déjà occupé : " + JSON.stringify(unNouveauCreneau));
                return
            }
        });
        this.creneaux.add(unNouveauCreneau);
    };

    hasCreneau = (unAutreCreneau) => {
        let found = false;

        for (let creneau of this.creneaux) {
            if (creneau.egal(unAutreCreneau)) {
                found = true;
                break;
            }
        }

        return found;
    };

    cardCreneaux = () => {
        return this.creneaux.size;
    };

    unionCreneaux = (autreEnsemble) => {
        const newUnionCreneaux = new EnsembleCreneaux();

        this.creneaux.forEach((creneau) => {
            newUnionCreneaux.addCreneau(creneau);
        });

        autreEnsemble.creneaux.forEach((creneau) => {
            if (!newUnionCreneaux.hasCreneau(creneau)) {
                newUnionCreneaux.addCreneau(creneau);
            }
        });

        return newUnionCreneaux;
    }

    interCreneaux = (autreEnsemble) => {
        const newInterCreneaux = new EnsembleCreneaux();

        this.creneaux.forEach((creneau) => {
            if (autreEnsemble.hasCreneau(creneau)) {
                newInterCreneaux.addCreneau(creneau);
            }
        });

        return newInterCreneaux;
    }

    getCreneauxUE = (UE) => {
        const creneauxUE = new EnsembleCreneaux();

        this.creneaux.forEach(creneau => {
            if (creneau.ue === UE) {
                creneauxUE.addCreneau(creneau);
            }
        });

        return creneauxUE.creneaux;
    }

    getCreneaux = () => {
        return this.creneaux;
    }

}

module.exports = EnsembleCreneaux;
