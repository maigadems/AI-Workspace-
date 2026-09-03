const principale = document.getElementById("principale");
const liensMenu = document.querySelectorAll(".menu-lien");

const dashboardHTML = principale.innerHTML;

const CLE_HISTORIQUE = "ai-workspace-historique";

function enregistrerHistorique(service, requete, resultat) {
    const historique = lireHistorique();

    historique.unshift({
        id: Date.now(),
        service: service,
        requete: requete,
        resultat: resultat,
        date: new Date().toLocaleString("fr-FR")
    });

    localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique));
}

function lireHistorique() {
    const brut = localStorage.getItem(CLE_HISTORIQUE);
    return brut ? JSON.parse(brut) : [];
}

liensMenu.forEach(lien => {
    lien.addEventListener("click", function (e) {
        e.preventDefault();

        liensMenu.forEach(l => l.classList.remove("actif"));
        this.classList.add("actif");

        const module = this.dataset.module;
        afficherModule(module);
    });
});

function afficherModule(module) {
    if (module === "dashboard") {
        principale.innerHTML = dashboardHTML;
    } else if (module === "resume") {
        afficherResume();
    } else if (module === "traduction") {
        afficherTraduction();
    } else if (module === "chat") {
        afficherChat();
    } else if (module === "prediction") {
        afficherPrediction();
    } else if (module === "historique") {
        afficherHistorique();
    } else {
        principale.innerHTML = `
            <h2 class="page-titre">Module en construction</h2>
            <p class="page-soustitre">Cette section sera bientôt disponible.</p>
        `;
    }
}

function afficherResume() {
    principale.innerHTML = `
        <h2 class="page-titre">Résumé de texte</h2>
        <p class="page-soustitre">Collez un texte pour en obtenir un résumé.</p>

        <div class="carte module-carte">
            <label class="module-label" for="resume-texte">Texte à résumer</label>
            <textarea id="resume-texte" class="module-textarea" rows="8" placeholder="Collez ou saisissez votre texte ici..."></textarea>

            <button id="resume-bouton" class="bouton-primaire">Résumer</button>

            <div class="module-resultat">
                <label class="module-label">Résumé</label>
                <div id="resume-sortie" class="module-sortie">Le résumé apparaîtra ici.</div>
            </div>
        </div>
    `;

    const texte = document.getElementById("resume-texte");
    const bouton = document.getElementById("resume-bouton");
    const sortie = document.getElementById("resume-sortie");

    bouton.addEventListener("click", function () {
        const contenu = texte.value.trim();

        if (contenu === "") {
            sortie.textContent = "Veuillez saisir un texte avant de générer un résumé.";
            return;
        }

        sortie.textContent = "Génération du résumé...";

        setTimeout(function () {
            const resultat = genererResumeSimule(contenu);
            sortie.textContent = resultat;
            enregistrerHistorique("Résumé de texte", contenu, resultat);
        }, 600);
    });
}

function genererResumeSimule(texte) {
    const phrases = texte.split(/(?<=[.!?])\s+/).filter(p => p.trim() !== "");

    if (phrases.length <= 2) {
        return texte.trim();
    }

    const nbPhrases = Math.max(1, Math.ceil(phrases.length / 3));
    return phrases.slice(0, nbPhrases).join(" ");
}

function afficherTraduction() {
    principale.innerHTML = `
        <h2 class="page-titre">Traduction</h2>
        <p class="page-soustitre">Saisissez un texte et choisissez une langue cible.</p>

        <div class="carte module-carte">
            <label class="module-label" for="traduction-texte">Texte à traduire</label>
            <textarea id="traduction-texte" class="module-textarea" rows="6" placeholder="Saisissez votre texte ici..."></textarea>

            <label class="module-label" for="traduction-langue">Langue cible</label>
            <select id="traduction-langue" class="module-select">
                <option value="en">Anglais</option>
                <option value="es">Espagnol</option>
                <option value="de">Allemand</option>
                <option value="ar">Arabe</option>
                <option value="zh">Chinois</option>
            </select>

            <button id="traduction-bouton" class="bouton-primaire">Traduire</button>

            <div class="module-resultat">
                <label class="module-label">Traduction</label>
                <div id="traduction-sortie" class="module-sortie">La traduction apparaîtra ici.</div>
            </div>
        </div>
    `;

    const texte = document.getElementById("traduction-texte");
    const langue = document.getElementById("traduction-langue");
    const bouton = document.getElementById("traduction-bouton");
    const sortie = document.getElementById("traduction-sortie");

    bouton.addEventListener("click", function () {
        const contenu = texte.value.trim();

        if (contenu === "") {
            sortie.textContent = "Veuillez saisir un texte avant de traduire.";
            return;
        }

        const nomLangue = langue.options[langue.selectedIndex].text;
        sortie.textContent = "Traduction en cours...";

        setTimeout(function () {
            const resultat = genererTraductionSimulee(contenu, nomLangue, langue.value);
            sortie.textContent = resultat;
            enregistrerHistorique("Traduction", contenu, resultat);
        }, 600);
    });
}

function genererTraductionSimulee(texte, nomLangue, code) {
    return `[${code.toUpperCase()}] ${texte}`;
}

function afficherChat() {
    principale.innerHTML = `
        <h2 class="page-titre">Chat IA</h2>
        <p class="page-soustitre">Discutez avec l'assistant.</p>

        <div class="carte chat-carte">
            <div id="chat-fil" class="chat-fil">
                <div class="chat-message chat-ia">
                    <span class="chat-auteur">Assistant</span>
                    <p>Bonjour, comment puis-je vous aider aujourd'hui ?</p>
                </div>
            </div>

            <div class="chat-zone-saisie">
                <input type="text" id="chat-input" class="module-input" placeholder="Écrivez votre message...">
                <button id="chat-envoyer" class="bouton-primaire">Envoyer</button>
            </div>
        </div>
    `;

    const fil = document.getElementById("chat-fil");
    const input = document.getElementById("chat-input");
    const bouton = document.getElementById("chat-envoyer");

    function envoyerMessage() {
        const contenu = input.value.trim();

        if (contenu === "") {
            return;
        }

        ajouterMessage(fil, "user", contenu);
        input.value = "";

        const messageAttente = ajouterMessage(fil, "ia", "L'assistant écrit...");

        setTimeout(function () {
            const reponse = genererReponseSimulee(contenu);
            messageAttente.querySelector("p").textContent = reponse;
            fil.scrollTop = fil.scrollHeight;
            enregistrerHistorique("Chat", contenu, reponse);
        }, 700);

        fil.scrollTop = fil.scrollHeight;
    }

    bouton.addEventListener("click", envoyerMessage);

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            envoyerMessage();
        }
    });
}

function ajouterMessage(fil, auteur, texte) {
    const message = document.createElement("div");
    message.className = auteur === "user" ? "chat-message chat-user" : "chat-message chat-ia";
    message.innerHTML = `
        <span class="chat-auteur">${auteur === "user" ? "Vous" : "Assistant"}</span>
        <p>${texte}</p>
    `;
    fil.appendChild(message);
    return message;
}

function genererReponseSimulee(question) {
    const reponses = [
        "C'est une bonne question, laissez-moi y réfléchir.",
        "D'après les informations disponibles, voici ce que je peux vous dire à ce sujet.",
        "Je peux vous aider avec ça, pouvez-vous préciser un peu plus votre demande ?",
        "Voici une réponse simulée en attendant la connexion à un vrai modèle."
    ];

    const index = question.length % reponses.length;
    return reponses[index];
}

function afficherPrediction() {
    principale.innerHTML = `
        <h2 class="page-titre">Prédiction</h2>
        <p class="page-soustitre">Renseignez un profil pour obtenir une prédiction.</p>

        <div class="carte module-carte">
            <label class="module-label" for="pred-age">Âge</label>
            <input type="number" id="pred-age" class="module-input" placeholder="Ex : 34" min="0">

            <label class="module-label" for="pred-revenu">Revenu mensuel (€)</label>
            <input type="number" id="pred-revenu" class="module-input" placeholder="Ex : 2500" min="0">

            <label class="module-label" for="pred-ville">Ville</label>
            <input type="text" id="pred-ville" class="module-input" placeholder="Ex : Paris">

            <button id="pred-bouton" class="bouton-primaire">Prédire</button>

            <div class="module-resultat">
                <label class="module-label">Résultat de la prédiction</label>
                <div id="pred-sortie" class="module-sortie">La prédiction apparaîtra ici.</div>
            </div>
        </div>
    `;

    const age = document.getElementById("pred-age");
    const revenu = document.getElementById("pred-revenu");
    const ville = document.getElementById("pred-ville");
    const bouton = document.getElementById("pred-bouton");
    const sortie = document.getElementById("pred-sortie");

    bouton.addEventListener("click", function () {
        if (age.value === "" || revenu.value === "" || ville.value.trim() === "") {
            sortie.textContent = "Veuillez renseigner l'âge, le revenu et la ville.";
            return;
        }

        sortie.textContent = "Calcul de la prédiction...";

        setTimeout(function () {
            const resultat = genererPredictionFictive(Number(age.value), Number(revenu.value), ville.value.trim());
            sortie.textContent = resultat;
            enregistrerHistorique("Prédiction", `âge ${age.value}, revenu ${revenu.value}€, ${ville.value.trim()}`, resultat);
        }, 600);
    });
}

function genererPredictionFictive(age, revenu, ville) {
    const score = Math.min(99, Math.round((revenu / 100) + (age % 20) + ville.length));
    const categorie = score >= 70 ? "Profil à fort potentiel" : score >= 40 ? "Profil intermédiaire" : "Profil à faible potentiel";

    return `${categorie} — score de ${score}/100 pour un profil de ${age} ans à ${ville}.`;
}

function afficherHistorique() {
    principale.innerHTML = `
        <h2 class="page-titre">Historique</h2>
        <p class="page-soustitre">Retrouvez toutes vos requêtes précédentes.</p>

        <div class="carte historique-carte">
            <div class="historique-barre">
                <input type="text" id="historique-recherche" class="module-input" placeholder="Rechercher dans l'historique...">
                <button id="historique-vider" class="bouton-secondaire">Vider l'historique</button>
            </div>

            <div id="historique-liste" class="historique-liste"></div>
        </div>
    `;

    const recherche = document.getElementById("historique-recherche");
    const boutonVider = document.getElementById("historique-vider");

    rendreListeHistorique("");

    recherche.addEventListener("input", function () {
        rendreListeHistorique(recherche.value.trim().toLowerCase());
    });

    boutonVider.addEventListener("click", function () {
        if (lireHistorique().length === 0) {
            return;
        }

        const confirmation = confirm("Voulez-vous vraiment supprimer tout l'historique ?");
        if (confirmation) {
            localStorage.removeItem(CLE_HISTORIQUE);
            rendreListeHistorique(recherche.value.trim().toLowerCase());
        }
    });
}

function rendreListeHistorique(filtre) {
    const conteneur = document.getElementById("historique-liste");
    const historique = lireHistorique();

    const items = filtre
        ? historique.filter(item =>
            item.requete.toLowerCase().includes(filtre) ||
            item.resultat.toLowerCase().includes(filtre) ||
            item.service.toLowerCase().includes(filtre))
        : historique;

    if (items.length === 0) {
        conteneur.innerHTML = `<p class="historique-vide">Aucune requête à afficher.</p>`;
        return;
    }

    conteneur.innerHTML = items.map(item => `
        <div class="historique-item" data-id="${item.id}">
            <div class="historique-item-entete">
                <span class="historique-service">${item.service}</span>
                <span class="historique-date">${item.date}</span>
            </div>
            <p class="historique-requete"><strong>Requête :</strong> ${item.requete}</p>
            <p class="historique-resultat"><strong>Résultat :</strong> ${item.resultat}</p>
            <button class="historique-supprimer" data-id="${item.id}">Supprimer</button>
        </div>
    `).join("");

    conteneur.querySelectorAll(".historique-supprimer").forEach(bouton => {
        bouton.addEventListener("click", function () {
            const id = Number(this.dataset.id);
            const nouvelHistorique = lireHistorique().filter(item => item.id !== id);
            localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(nouvelHistorique));

            const rechercheInput = document.getElementById("historique-recherche");
            rendreListeHistorique(rechercheInput.value.trim().toLowerCase());
        });
    });
}
