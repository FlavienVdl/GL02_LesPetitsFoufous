const fs = require("fs");
const colors = require("colors");
const cli = require("@caporal/core").default;

const CreneauParser = require("./utils/CreneauParser");

const findSalles = require("./commands/findSalles");
const capaciteMax = require("./commands/capaciteMax");
const quandLibreSalle = require("./commands/quandLibreSalle");
const quellesSallesLibres = require("./commands/quellesSallesLibres");
const ical = require("./commands/ical");
const visuVegalite = require("./commands/visuVegalite");
const listeSalles = require("./commands/listeSalles");


cli
    .version('lespetitsfoufous-sujet-a')
    .version('1.0.0')

    // readme
    .command('readme', 'Affiche le fichier README')
    .alias('read')
    .action(({args, options, logger}) => {
        fs.readFile('./README.md', 'utf8', function (err, data) {
            if (err) {
                return logger.warn(err);
            }
            console.log(data);
        });
    })


    // SPEC1
    .command('find-salles', 'Trouve les salles associées à un cours')
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .argument('<cours>', 'Le cours à rechercher')
    .alias('fs')
    .action(({args, options, logger}) => {
        let parser = new CreneauParser();
        parser.parse(args.chemin);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }

        let listeSalles = findSalles(parser.parsedCreneaux, args.cours, logger);
        console.log(Array.from(listeSalles).join(", "));
    })

    // SPEC2
    .command('capacite-max', "Capacité max d'une salle")
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .argument('<salle>', 'La salle à rechercher')
    .alias('cm')
    .action(({args, options, logger}) => {
        let parser = new CreneauParser();
        parser.parse(args.chemin);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }

        let capacite = capaciteMax(parser.parsedCreneaux, args.salle);
        console.log(capacite);
    })

    // SPEC3
    .command('verify-emploidutemps', "Vérifie l'emploi du temps")
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .alias('ve')
    .action(({args, options, logger}) => {
        let parser = new CreneauParser();
        parser.parse(args.chemin, true);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }
    })

    // SPEC4
    .command('quand-libre-salle', "Trouve les créneaux libres d'une salle")
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .argument('<salle>', 'La salle à rechercher')
    .action(({args, options, logger}) => {
        let parser = new CreneauParser();
        parser.parse(args.chemin);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }

        let listeCreneaux = quandLibreSalle(parser.parsedCreneaux, args.salle);
        console.log(Array.from(listeCreneaux).join(", "));
    })

    //SPEC4
    .command('liste-salles', "Creer un fichier .txt de la liste des salles existantes")
    .action(({args, options, logger}) => {
        // on appelle la fonction principale
        listeSalles();
    })

    //SPEC5
    .command('quelles-salles-libres', 'Trouve les salles libres pour un créneau donné')
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .argument('<creneau>', 'Le créneau à rechercher (format : J_HH:MM-HH:MM ex: ME_10:00-12:00)')
    .action(({args, options, logger}) => {
        let parser = new CreneauParser();
        parser.parse(args.chemin);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }

        //on vérifie que le créneau est bien au bon format ex: ME_10:00-12:00 ou J_10:00-12:00
        let regex = new RegExp("^(L|MA|ME|J|V|S)_[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$");
        if (!regex.test(args.creneau)) {
            logger.info("The creneau is not at the right format".red);
            return
        }

        let listeSalles = Array.from(quellesSallesLibres(parser.parsedCreneaux, args.creneau, logger)).join(", ");
        // Not existing creneau case
        if (listeSalles === "@") {
            return;
        }
        else if (listeSalles === "") {
            listeSalles = "No room available";
        }
        else {
            console.log(listeSalles);
        }

    })

    // SPEC6
    .command('ical', "Crée un fichier iCal avec l'edt de l'utilisateur")
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .argument('<usager>', "La personne dont on veut l'emploi du temps")
    .argument('<debut>', 'La date de début du calendrier généré, format : 25/11/2023')
    .argument('<fin>', 'La date de fin du calendrier généré, format : 25/11/2023')
    .action(({args, options, logger}) => {
        const parser = new CreneauParser();
        parser.parse(args.chemin);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }

        let date_debut;
        let date_fin;
        try {
            const debut = [];
            args.debut.split("/").forEach((dateArg, i) => debut[i] = parseInt(dateArg, 10));
            const fin = [];
            args.fin.split("/").forEach((dateArg, i) => fin[i] = parseInt(dateArg, 10));
            date_debut = new Date(debut[2], debut[1] - 1, debut[0]);
            date_fin = new Date(fin[2], fin[1] - 1, fin[0]);
        } catch (e) {
            logger.error("Invalid date format".red);
            return;
        }

        if (isNaN(date_debut.getTime()) || isNaN(date_fin.getTime())) {
            logger.error("Invalid date format".red);
            return;
        }

        if (date_debut > date_fin) {
            logger.error("Date de début > à la date de fin".red);
            return;
        }

        ical(parser, args.usager, date_debut, date_fin);
    })

    // SPEC7
    .command('visualisation', "génère un fichier png de la visualisation des données")
    .argument('<chemin>', 'Chemin du fichier ou du dossier contenant les créneaux')
    .argument('<ordre>', 'Ordre croissant (c) ou décroissant (d)')
    .alias('visu')
    .action(({args, options, logger}) => {
        let parser = new CreneauParser();
        parser.parse(args.chemin);

        if (!parser.noErrors) {
            logger.info("The path contains error".red);
            return
        }

        let capacite = visuVegalite(parser.parsedCreneaux, args.ordre);
        //console.log(capacite);
    })


cli.run(process.argv.slice(2));
