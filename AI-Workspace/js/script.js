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
