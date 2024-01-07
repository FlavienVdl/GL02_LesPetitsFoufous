const fs = require("fs");
const readline = require("readline");

const ical = (parser, usager, date_debut, date_fin) => {

    function addEvent(creneau, date, horaire) {
        let debut = horaire[3].split(":");
        date.setHours(debut[0], debut[1]);
        debut = date.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";

        let fin = horaire[4].split(":");
        date.setHours(fin[0], fin[1]);
        fin = date.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
        const uid = [creneau.ue, creneau.salle, creneau.horaire, date.getTime()].join("-").replace(" ", "_");
        data += "BEGIN:VEVENT\n" +
            "UID:" + uid + "\n" +
            "SUMMARY:" + creneau.ue + "\n" +
            "DTSTAMP:" + debut + "\n" +
            "DTSTART:" + debut + "\n" +
            "DTEND:" + fin + "\n" +
            "LOCATION:" + creneau.salle + "\n" +
            "ATTENDEE:" + usager + "\n" +
            "END:VEVENT\n";
    }

    function getDay(day) {
        switch (day) {
            case "L":
                return ["Lundi", 1];
            case "MA":
                return ["Mardi", 2];
            case "ME":
                return ["Mercredi", 3];
            case "J":
                return ["Jeudi", 4];
            case "V":
                return ["Vendredi", 5];
            case "S":
                return ["Samedi", 6];
            case "D":
                return ["Dimanche", 0];
        }
    }

    function parseHoraire(horaire) {
        horaire = horaire.split(" ");
        [horaire[0], horaire[2]] = getDay(horaire[0]);
        [horaire[3], horaire[4]] = horaire[1].split("-");
        return horaire;
    }

    function generateFile() {
        data += "END:VCALENDAR\n";
        fs.writeFileSync("./mon_edt.ics", data);
    }

    function choixHoraire(creneaux, horaires) {
        rl.question("A quelle horaire ?\n", resp => {
            if (resp === "exit") {
                choixCours();
                return;
            }

            resp = parseInt(resp);
            if (isNaN(resp)) {
                console.log("Ce n'est pas un chiffre !")
                choixHoraire(creneaux, horaires);
                return;
            }

            if (resp > creneaux.size || resp < 1) {
                console.log("Ce n'est pas un chiffre valide");
                choixHoraire(creneaux, horaires);
                return;
            }

            let i = 0;
            for (let creneau of creneaux) {
                if (resp === i + 1) {
                    for (let date = new Date(date_debut); date < date_fin; date.setDate(date.getDate() + 1)) {
                        if (horaires[i][2] === date.getDay()) {
                            addEvent(creneau, date, horaires[i]);
                        }
                    }
                    choixCours();
                    return;
                }
                i++;
            }
        });
    }

    function choixCours() {
        rl.question("Quel cours as-tu ? ( exit pour arrêter la sélection )\n", resp => {
            if (resp === "exit") {
                rl.question("Souhaitez-vous générer le fichier iCalendar ? (Oui/Non)\n", resp => {
                    if (resp.toLowerCase() === "oui" || resp.toLowerCase() === "yes") {
                        generateFile();
                    } else {
                        console.log("Création du calendrier annulée. Les choix sont oubliés.");
                    }
                    rl.close();
                });
                return;
            }

            const creneaux = parser.parsedCreneaux.getCreneauxUE(resp);
            if (creneaux.size === 0) {
                console.log("Ce cours n'existe pas !");
                choixCours();
                return;
            }

            const horaires = [];
            let i = 0;
            creneaux.forEach(creneau => {
                horaires[i] = parseHoraire(creneau.horaire);
                console.log((i + 1) + ". " + horaires[i].slice(0, 2).join(" "));
                i++;
            });
            choixHoraire(creneaux, horaires);
        });
    }

    let data = "BEGIN:VCALENDAR\nVERSION:2.0\n" +
        "PRODID:-//LesPetitsFoufous//NONSGML v1.0.0//FR\n";
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    choixCours();
}

module.exports = ical;
