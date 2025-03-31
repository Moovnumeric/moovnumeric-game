document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        { text: "Utiliser un mot de passe complexe", category: "Sécurité des mots de passe" },
        { text: "Ne pas partager ses informations personnelles en ligne", category: "Réseaux sociaux" },
        { text: "Mettre à jour son antivirus régulièrement", category: "Logiciels et antivirus" },
        { text: "Ne pas cliquer sur des liens suspects", category: "Dangers en ligne" },
        { text: "Utiliser l'authentification à deux facteurs", category: "Bonnes pratiques" },
        { text: "Éviter les réseaux Wi-Fi publics pour des connexions sensibles", category: "Dangers en ligne" },
        { text: "Ne jamais réutiliser les mêmes mots de passe", category: "Sécurité des mots de passe" },
        { text: "Activer la mise à jour automatique des logiciels", category: "Bonnes pratiques" },
        { text: "Utiliser un gestionnaire de mots de passe", category: "Sécurité des mots de passe" },
        { text: "Vérifier les paramètres de confidentialité sur les réseaux sociaux", category: "Réseaux sociaux" }
    ];
    
    let score = 0;
    let draggedElement = null;
    const correctSound = new Audio("correct.mp3");
    const wrongSound = new Audio("wrong.mp3");
    
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function startGame() {
        document.getElementById("welcome-message").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        
        document.getElementById("congratulations-message").style.display = "none";
        score = 0;
        updateScore();
        displayQuestions();
    }
    
    function displayQuestions() {
        const questionsContainer = document.getElementById("questions");
        questionsContainer.innerHTML = "";
        shuffle(questions).slice(0, 10).forEach(q => {
            let div = document.createElement("div");
            div.className = "draggable";
            div.textContent = q.text;
            div.draggable = true;
            div.dataset.category = q.category;
            div.addEventListener("dragstart", dragStart);
            questionsContainer.appendChild(div);
        });
    }
    
    function dragStart(event) {
        draggedElement = event.target;
    }

    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("dragover", event => event.preventDefault());
        category.addEventListener("drop", drop);
    });
    
    function drop(event) {
        const targetCategory = event.target.dataset.category;
        if (draggedElement.dataset.category === targetCategory) {
            score += 1;
            updateScore();
            correctSound.play();
            draggedElement.remove();
        } else {
            wrongSound.play();
            setTimeout(() => {
                alert(`Eh non ! La bonne réponse était : ${draggedElement.dataset.category}`);
                draggedElement.remove();
            }, 500);
        }
    }

    function updateScore() {
        document.getElementById("score-display").innerText = "Score: " + score;
    }
    
    function checkAnswers() {
        document.getElementById("game-container").style.display = "none";
        document.getElementById("congratulations-message").style.display = "block";
        document.getElementById("final-score").textContent = score;
    }
    
    function saveScore() {
        let playerName = document.getElementById("player-name").value;
        if (playerName) {
            let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Récupérer le leaderboard existant ou un tableau vide
            leaderboard.push({ name: playerName, score: score });
            localStorage.setItem("leaderboard", JSON.stringify(leaderboard)); // Sauvegarder le leaderboard dans localStorage
    
            // Afficher les scores sauvegardés
            displayLeaderboard(leaderboard);
            restartGame();
        }
    }
    
    function restartGame() {
        document.getElementById("congratulations-message").style.display = "none";
        document.getElementById("welcome-message").style.display = "block";
        score = 0;
        updateScore();
        displayQuestions();
    }

    function displayLeaderboard(leaderboard) {
        let leaderboardList = document.getElementById("leaderboard");
        leaderboardList.innerHTML = ""; // Réinitialiser la liste avant d'afficher les scores
        leaderboard.forEach(entry => {
            let li = document.createElement("li");
            li.textContent = `${entry.name}: ${entry.score} points`;
            leaderboardList.appendChild(li);
        });
    }

    // Lorsque le document est prêt
    document.addEventListener("DOMContentLoaded", () => {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        displayLeaderboard(leaderboard); // Afficher les scores sauvegardés
    });
    
    window.startGame = startGame;
    window.checkAnswers = checkAnswers;
    window.saveScore = saveScore;
});
    