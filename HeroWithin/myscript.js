// Quiz logic for test.html
  const statements = [
    "It's important to be careful. Other people will cheat you if they can.",
    "I find that when I change my attitudes my environment changes.",
    "Most important to me right now are identity issues. I'm not sure who I am.",
    "I push hard to prove myself and to succeed.",
    "The world is good and I am safe and cared for.",
    "I feel very alone, but it gives me satisfaction to see that I can make it on my own.",
    "The most important thing is loving.",
    "I often feel disappointed in or betrayed by other people.",
    "All seeming problems really are illusions, I can assert God's love/the perfection of the universe and once again see that all is well.",
    "I am very competitive and really enjoy winning.",
    "Times have been rough, but I've learned to cope.",
    "I find out about my own shadow self by what upsets me in others.",
    "I use drugs/alcohol to get high and feel better, (Or: I use shopping, work, or frantic activity to divert myself from problems,).",
    "I expect people I meet to be trustworthy.",
    "When challenged, I stand up for myself and, if necessary, fight to defend myself.",
    "I'm in a new job/doing my job differently/undertaking a new course of study.",
    "I expect to be loved and cared for.",
    "I struggle hard for the causes/ideas/values I believe in and against those that are wrong or harmful.",
    "I frequently give people more than I get back.",
    "What I really want is someone to take care of me, but there is no one who will/can really care for me.",
    "When I am betrayed or unjustly treated, it reminds me to take pains to be fair to others.",
    "I love to travel/study/experiment because I find I learn about myself and the world when I do.",
    "I see no evil, hear no evil, speak no evil.",
    "I feel most myself when I'm creating something new.",
    "I want my life to make a difference, to make a mark on the world.",
    "When I stay calm and centered, others seem quieted too.",
    "If others could just see the light, they could have as wonderful a life as I do.",
    "Since I've changed, my world has changed radically, Years ago, I would not have imagined things would turn out so well.",
    "I think I'm justified in feeling superior to other people: I'm smarter, or better educated, or stronger, or more disciplined, or hardworking, or have better values, or because of my sex, my racial or ethnic heritage, my class, my accomplishments, my beliefs.",
    "Tragedies (accidents, illnesses) often happen to me and those around me.",
    "I work hard but do not expect to be rewarded or appreciated adequately for what I do.",
    "If I could only win that jackpot, all my problems would be solved.",
    "I feel good about myself and grateful for my life.",
    "I would like to be more appreciated by others.",
    "I'll do whatever life requires of me, I want to make whatever contribution I can.",
    "I sometimes avoid or sabotage intimacy with others in order to maintain my freedom."
  ];

  let currentStatement = 0;

  let answers = new Array(statements.length); // Initialize answers array with zeros

  

    // Function to calculate the score for each archetype
  function calculateArchetypeScores(answers) {
    const scores = {
      Innocent: 0,
      Orphan: 0,
      Wanderer: 0,
      Warrior: 0,
      Martyr: 0,        
      Magician: 0
    };
    
/*     // Use only valid indices (0–6) for your current statements
    const archetypes = {    
      Innocent: [4],   // e.g. "The world is good..." (index 4)
      Orphan: [0, 5, 7, 8],  // e.g. "It's important to be careful..." (index 0), "I feel very alone..." (index 5)
      Wanderer: [2],   // e.g. "Most important to me right now..." (index 2)
      Warrior: [3],    // e.g. "I push hard to prove myself..." (index 3)
      Martyr: [6],     // e.g. "The most important thing is loving." (index 6)
      Magician: [1, 9, 10]    // e.g. "I find that when I change my attitudes..." (index 1)
    }; */
    
    // Add certain values in the array to one of 6 archetypes: Innocent, Orphan, Wanderer, Warrior, Martyr, Magician
    // Specific answers are to be assigned to each archetype
    const archetypes = {    
    Innocent: [5, 9, 14, 17, 23, 27],
    Orphan: [1, 8, 13, 20, 30, 32],
    Wanderer: [3, 6, 11, 16, 22, 36],
    Warrior: [4, 10, 15, 18, 25, 29],
    Martyr: [7, 19, 21, 31, 34, 35],
    Magician: [2, 12, 24, 26, 28, 33]
    };

    for (const [archetype, indices] of Object.entries(archetypes)) {
      for (const idx of indices) {
        scores[archetype] += answers[idx] || 0;
      }
    }
    return scores;
  };

  document.addEventListener('DOMContentLoaded', function() {
  // Show results on results.html
  if (window.location.pathname.endsWith('results.html')) {
    const scores = JSON.parse(localStorage.getItem('archetypeScores'));
    const body = document.body;
    body.innerHTML = '<h2>Your Archetype Scores</h2>';
    if (scores) {
      let active = [];
      let veryActive = [];
      Object.entries(scores).forEach(([archetype, score]) => {
        body.innerHTML += `<p><strong>${archetype}:</strong> ${score}</p>`;
        if (score >= 15) {
          veryActive.push(archetype);
        } else if (score >= 9) {
          active.push(archetype);
        }
      });
      if (veryActive.length > 0) {
        body.innerHTML += `<h3>Very Active Archetypes (15+):</h3><ul>${veryActive.map(a => `<li>${a}</li>`).join('')}</ul>`;
      }
      if (active.length > 0) {
        body.innerHTML += `<h3>Active Archetypes (9+):</h3><ul>${active.map(a => `<li>${a}</li>`).join('')}</ul>`;
      }
      if (veryActive.length === 0 && active.length === 0) {
        body.innerHTML += `<p>No active archetypes (9 or more) identified.</p>`;
      }
    } else {
      body.innerHTML += '<p>No results found. Please complete the test first.</p>';
    }
    return;
  }

  // Button on index.html
  const startBtn = document.getElementById('startTestButton');
  if (startBtn) {
    startBtn.onclick = function() {
      window.location.href = 'test.html';
    };
  }

  function showStatement(index) {
    const statementText = document.getElementById('statementText');
    if (statementText) statementText.textContent = statements[index];
  }

  const optionButtons = document.querySelectorAll('.optionButton');
  if (optionButtons.length > 0) {
    optionButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const value = parseInt(this.getAttribute('data-value'));
        if (currentStatement < answers.length) {
          answers[currentStatement] = value;
        }
        currentStatement++;
        if (currentStatement < statements.length) {
          showStatement(currentStatement);
        } else {
          // calculate scores for each archetype
          const scores = calculateArchetypeScores(answers);
          // Save scores to localStorage and redirect to results.html
          localStorage.setItem('archetypeScores', JSON.stringify(scores));
          window.location.href = 'results.html';
        }
      });
    });
  }
});