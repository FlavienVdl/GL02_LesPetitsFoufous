let findSalles = (creneaux, cours, logger) => {
    let result = new Set();

    let coursTrouve = false;
    creneaux.creneaux.forEach(unCreneau => {
        if (unCreneau.ue.includes(cours)) {
            result.add(unCreneau.salle);
            coursTrouve = true;
        }
    });

    if (!coursTrouve) {
        logger.info("Le cours n'a pas été trouvé".red);
    }
    return result;
}

module.exports = findSalles;
