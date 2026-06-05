window.addEventListener('scroll', () => {
    document.querySelector('.top-btn').classList.toggle('visible', window.scrollY > 400);
});

const tracks = [
    document.getElementById('bgMusic0'),
    document.getElementById('bgMusic1'),
    document.getElementById('bgMusic2'),
];
const buttons = document.querySelectorAll('.music-btn');
let currentTrack = -1;

buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if (currentTrack === i && !tracks[i].paused) {
            tracks[i].pause();
            btn.textContent = '▶';
            currentTrack = -1;
            return;
        }
        buttons.forEach((b, j) => {
            tracks[j].pause();
            tracks[j].currentTime = 0;
            b.textContent = '▶';
        });
        if (tracks[i].src) {
            tracks[i].play();
            btn.textContent = '⏹';
            currentTrack = i;
        }
    });
});

const quizData = [
    {q: "Was bedeutet Infrastructure as Code (IaC)?", a: ["Manuelle Serverkonfiguration", "Automatisierte Bereitstellung von Infrastruktur durch Code", "Eine Programmiersprache für Cloud-Anwendungen", "Ein Tool zur Netzwerküberwachung"], c: 1},
    {q: "Welches Cloud-Modell bietet dem Kunden die meiste Kontrolle?", a: ["SaaS", "PaaS", "IaaS", "FaaS"], c: 2},
    {q: "Was ist ein Transformer in der KI?", a: ["Ein Hardware-Baustein", "Ein neuronales Netzwerkarchitektur-Modell", "Eine Datenbank-Technologie", "Ein Verschlüsselungsalgorithmus"], c: 1},
    {q: "Wofür steht die Abkürzung ML?", a: ["Machine Language", "Multi-Layer", "Machine Learning", "Markup Language"], c: 2},
    {q: "Was ist eine DDoS-Attacke?", a: ["Diebstahl von Datenbanken", "Überlastung eines Dienstes durch viele Anfragen", "Eindringen in ein Netzwerk", "Phishing von Passwörtern"], c: 1},
    {q: "Was bedeutet Zero Trust?", a: ["Keine Passwörter verwenden", "Standardmäßig keinem Benutzer oder System vertrauen", "Vollständige Netzwerkverschlüsselung", "Verzicht auf Firewalls"], c: 1},
    {q: "Was kennzeichnet eine Microservices-Architektur?", a: ["Ein monolithischer Code-Ansatz", "Aufteilung in kleine, unabhängige Dienste", "Eine spezielle Datenbank-Architektur", "Ein reines Cloud-Modell"], c: 1},
    {q: "Was ist ein API-Gateway?", a: ["Ein Tool zum Testen von APIs", "Ein zentraler Einstiegspunkt für API-Anfragen", "Eine Datenbank für API-Endpunkte", "Ein Sicherheitsprotokoll"], c: 1},
    {q: "Was ist Kubernetes?", a: ["Ein Betriebssystem", "Eine Container-Orchestrierungsplattform", "Eine Cloud-Datenbank", "Ein Monitoring-Tool"], c: 1},
    {q: "Was beschreibt Overfitting beim maschinellen Lernen?", a: ["Das Modell lernt zu viele irrelevante Details aus Trainingsdaten", "Das Modell trainiert zu langsam", "Das Modell benötigt zu viele Daten", "Das Modell ist zu einfach"], c: 0},
    {q: "Was ist eine Firewall?", a: ["Ein Tool zur Datenkompression", "Ein Sicherheitssystem zur Netzwerküberwachung und -filterung", "Eine Verschlüsselungssoftware", "Ein Backup-System"], c: 1},
    {q: "Was bedeutet Skalierbarkeit in der IT?", a: ["Die Fähigkeit eines Systems, mit wachsender Last umzugehen", "Die Größe des Datencenters", "Die Geschwindigkeit des Netzwerks", "Die Anzahl der Mitarbeiter"], c: 0},
];

const quizSection = document.getElementById('quizSection');
const quizContainer = document.getElementById('quizContainer');
const quizResult = document.getElementById('quizResult');
const startBtn = document.getElementById('quizStartBtn');
let userAnswers = [];

startBtn.addEventListener('click', () => {
    quizSection.classList.remove('hidden');
    document.getElementById('closeQuiz').style.display = 'block';
    quizSection.scrollIntoView({behavior: 'smooth'});
    renderQuiz();
});

document.getElementById('closeQuiz').addEventListener('click', () => {
    quizSection.classList.add('hidden');
    document.getElementById('closeQuiz').style.display = 'none';
});

function renderQuiz() {
    quizContainer.innerHTML = '';
    quizResult.classList.add('hidden');
    userAnswers = new Array(quizData.length).fill(-1);

    quizData.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'neon-card bg-gray-800 rounded-2xl p-6 text-white';
        card.innerHTML = `<div class="flex items-start gap-4"><span class="text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm" style="background:#3d4f1f;">${i+1}</span><div><p class="font-semibold text-lg mb-4">${item.q}</p><div class="space-y-2" id="options-${i}"></div></div></div>`;

        const optionsDiv = card.querySelector(`#options-${i}`);
        item.a.forEach((opt, j) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option w-full text-left px-4 py-3 rounded-xl bg-gray-700 text-gray-200 text-sm';
            btn.textContent = opt;
            btn.dataset.q = i;
            btn.dataset.idx = j;
            btn.addEventListener('click', () => selectAnswer(i, j));
            optionsDiv.appendChild(btn);
        });

        quizContainer.appendChild(card);
    });

    const submitDiv = document.createElement('div');
    submitDiv.className = 'text-center mt-8';
    submitDiv.innerHTML = '<button id="submitQuiz" class="neon-btn bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-600 transition">Quiz auswerten</button>';
    quizContainer.appendChild(submitDiv);

    document.getElementById('submitQuiz').addEventListener('click', evaluateQuiz);
}

function selectAnswer(qIdx, aIdx) {
    userAnswers[qIdx] = aIdx;
    const options = document.querySelectorAll(`#options-${qIdx} .quiz-option`);
    options.forEach((opt, j) => {
        opt.classList.toggle('selected', j === aIdx);
    });
}

function evaluateQuiz() {
    const unanswered = userAnswers.filter(a => a === -1).length;
    if (unanswered > 0) { alert(`Bitte beantworte alle Fragen (${unanswered} fehlen noch).`); return; }

    let correct = 0;
    quizData.forEach((item, i) => {
        const options = document.querySelectorAll(`#options-${i} .quiz-option`);
        options.forEach((opt, j) => {
            opt.style.pointerEvents = 'none';
            if (j === item.c) opt.classList.add('correct');
            else if (j === userAnswers[i] && j !== item.c) opt.classList.add('wrong');
        });
        if (userAnswers[i] === item.c) correct++;
    });

    const pct = Math.round((correct / quizData.length) * 100);
    let msg, emoji;
    if (pct >= 90) { msg = 'Hervorragend! Du bist ein echter Experte!'; emoji = '🏆'; }
    else if (pct >= 70) { msg = 'Sehr gut! Nur wenig Verbesserungspotenzial.'; emoji = '🌟'; }
    else if (pct >= 50) { msg = 'Solide! Einige Themen könntest du noch vertiefen.'; emoji = '👍'; }
    else if (pct >= 30) { msg = 'Nicht schlecht, aber üben lohnt sich! Versuch es nochmal.'; emoji = '📚'; }
    else { msg = 'Das war wohl nichts – aber Übung macht den Meister! Versuch es nochmal.'; emoji = '💪'; }

    document.getElementById('submitQuiz').remove();
    quizResult.classList.remove('hidden');
    quizResult.innerHTML = `
        <div class="neon-card bg-gray-800 rounded-2xl p-10 text-white inline-block">
            <div class="text-5xl mb-4">${emoji}</div>
            <div class="text-5xl font-extrabold text-indigo-400 mb-2">${pct}%</div>
            <div class="text-lg font-semibold mb-6">${correct} von ${quizData.length} richtig</div>
            <p class="text-gray-300 mb-6">${msg}</p>
            <button onclick="renderQuiz()" class="neon-btn bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-600 transition">Nochmal versuchen</button>
        </div>
    `;
    quizResult.scrollIntoView({behavior: 'smooth'});
}
