const principale = document.getElementById("principale");
const liensMenu = document.querySelectorAll(".menu-lien");

const dashboardHTML = principale.innerHTML;

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
            sortie.textContent = genererResumeSimule(contenu);
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
            sortie.textContent = genererTraductionSimulee(contenu, nomLangue, langue.value);
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
            messageAttente.querySelector("p").textContent = genererReponseSimulee(contenu);
            fil.scrollTop = fil.scrollHeight;
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
