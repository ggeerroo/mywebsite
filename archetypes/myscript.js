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


    // Each answer corresponds to a specific archetype based on the index
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

 
  // Archetype info for results.html
  if (window.location.pathname.endsWith('results.html')) {
    const scores = JSON.parse(localStorage.getItem('archetypeScores'));
    const archetypeData = {
      Innocent: {
        "":"The Innocent is not a heroic archetype. When we live in paradise there is no need for goals, fears, tasks, work, etc. The Innocent is both pre- and post- heroic.",
      },
      Orphan: {
        Goals: "Belonging, safety, empathy, realism.",
        "Worst Fear": "Abandonment, exploitation.",
        "Response to the Dragon": "Endure, seek support.",
        Spirituality: "Questions faith, seeks meaning.",
        "Intellect/Education": "Practical, learns from hardship.",
        Relationships: "Wants connection, fears betrayal.",
        Emotions: "Wary, realistic, sometimes pessimistic.",
        "Physical health": "Sensitive to stress.",
        Work: "Cooperative, values teamwork.",
        "Material World": "Seeks stability.",
        "Task/Achievement": "Survive, connect, find safety."
      },
      Wanderer: {
        Goals: "Independence, fulfillment, exploration.",
        "Worst Fear": "Conformity, entrapment.",
        "Response to the Dragon": "Escape, seek new paths.",
        Spirituality: "Spiritual seeker, open-minded.",
        "Intellect/Education": "Curious, loves learning.",
        Relationships: "Values freedom, avoids dependence.",
        Emotions: "Restless, adventurous.",
        "Physical health": "Active, enjoys movement.",
        Work: "Prefers autonomy, creative roles.",
        "Material World": "Minimalist, values experiences.",
        "Task/Achievement": "Find own path, self-discovery."
      },
      Warrior: {
        Goals: "Prove worth, courage, achievement.",
        "Worst Fear": "Weakness, defeat.",
        "Response to the Dragon": "Fight, confront challenges.",
        Spirituality: "Belief in justice, personal strength.",
        "Intellect/Education": "Strategic, competitive.",
        Relationships: "Protective, loyal.",
        Emotions: "Determined, passionate.",
        "Physical health": "Strong, disciplined.",
        Work: "Goal-oriented, thrives on challenge.",
        "Material World": "Seeks victory, status.",
        "Task/Achievement": "Win, achieve, overcome."
      },
      Martyr: {
        Goals: "Help others, self-sacrifice.",
        "Worst Fear": "Selfishness, being unappreciated.",
        "Response to the Dragon": "Suffer for others, endure.",
        Spirituality: "Compassion, service.",
        "Intellect/Education": "Empathetic, values meaning.",
        Relationships: "Gives more than receives.",
        Emotions: "Sensitive, caring.",
        "Physical health": "Neglects own needs.",
        Work: "Service-oriented, supportive.",
        "Material World": "Shares resources.",
        "Task/Achievement": "Make a difference, serve."
      },
      Magician: {
        Goals: "Transformation, growth, vision.",
        "Worst Fear": "Stagnation, evil uses of power.",
        "Response to the Dragon": "Transform, heal.",
        Spirituality: "Mystical, seeks enlightenment.",
        "Intellect/Education": "Visionary, creative.",
        Relationships: "Charismatic, inspiring.",
        Emotions: "Hopeful, imaginative.",
        "Physical health": "Holistic, mind-body connection.",
        Work: "Innovative, change agent.",
        "Material World": "Sees potential everywhere.",
        "Task/Achievement": "Make dreams reality, transform."
      }
    };
    
    const resultsContainer = document.getElementById('resultsContainer');
      if (resultsContainer) {
    let html = '<h2>Your Archetype Scores</h2>';
    if (scores) {
      let active = [];
      let veryActive = [];
      Object.entries(scores).forEach(([archetype, score]) => {
        html += `<p><strong>${archetype}:</strong> ${score}</p>`;
        if (score >= 15) {
          veryActive.push(archetype);
        } else if (score >= 9) {
          active.push(archetype);
        }
      });
      if (veryActive.length > 0) {
        html += `<h3>Very Active Archetypes (15+):</h3><ul>${veryActive.map(a => `<li>${a}</li>`).join('')}</ul>`;
      }
      if (active.length > 0) {
        html += `<h3>Active Archetypes (9+):</h3><ul>${active.map(a => `<li>${a}</li>`).join('')}</ul>`;
      }
      if (veryActive.length === 0 && active.length === 0) {
        html += `<p>No active archetypes (9 or more) identified.</p>`;
      }
    } else {
      html += '<p>No results found. Please complete the test first.</p>';
    }
    resultsContainer.innerHTML = html;
  }

  // Email sending handler
    const sendBtn = document.getElementById('sendResultsButton');
    if (sendBtn) {
      sendBtn.onclick = async function() {
        const email = document.getElementById('userEmail').value;
        const statusDiv = document.getElementById('emailStatus');
        if (!email) {
          statusDiv.textContent = "Please enter a valid email address.";
          return;
        }
        // Prepare results summary
        let summary = "Your Archetype Scores:\n";
        Object.entries(scores).forEach(([archetype, score]) => {
          summary += `${archetype}: ${score}\n`;
        });

        try {
          const response = await fetch('http://localhost:3000/send-results', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, summary})
          });
          if (response.ok) {
            statusDiv.textContent = "Results sent to your email!";
          } else {
            statusDiv.textContent = "Failed to send email. Try again.";
          }
        } catch (err) {
          statusDiv.textContent = "Error sending email.";
        }
      };
    }
   /*  const body = document.body;
    body.innerHTML = '<h2>Your Archetype Scores</h2>';
    if (scores) {
      let active = [];
      let veryActive = [];
      let listHtml = '<ul>';
      Object.entries(scores).forEach(([archetype, score]) => {
        listHtml += `<li><a href="#" class="archetype-info-link" data-archetype="${archetype}"><strong>${archetype}</strong></a>: ${score}</li>`;
        if (score >= 15) {
          veryActive.push(archetype);
        } else if (score >= 9) {
          active.push(archetype);
        }
      });
      listHtml += '</ul>';
      body.innerHTML += listHtml;
      if (veryActive.length > 0) {
        body.innerHTML += `<h3>Very Active Archetypes (15+):</h3><ul>${veryActive.map(a => `<li>${a}</li>`).join('')}</ul>`;
      }
      if (active.length > 0) {
        body.innerHTML += `<h3>Active Archetypes (9+):</h3><ul>${active.map(a => `<li>${a}</li>`).join('')}</ul>`;
      }
      if (veryActive.length === 0 && active.length === 0) {
        body.innerHTML += `<p>No active archetypes (9 or more) identified.</p>`;
      }
      body.innerHTML += `<div id="archetypeInfoModal" style="display:none; border:1px solid #ccc; padding:15px; margin-top:20px; background:#fafafa;"></div>`;
    } else {
      body.innerHTML += '<p>No results found. Please complete the test first.</p>';
    }

    // Add click handlers for archetype info links
    document.querySelectorAll('.archetype-info-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const name = this.dataset.archetype;
        const modal = document.getElementById('archetypeInfoModal');
        const data = archetypeData[name];
        let infoHtml = `<h3>${name}</h3>`;
        if (data) {
          infoHtml += '<ul>';
          Object.entries(data).forEach(([key, value]) => {
            infoHtml += `<li><strong>${key}:</strong> ${value}</li>`;
          });
          infoHtml += '</ul>';
        }
        infoHtml += `<button id="closeArchetypeInfo">Close</button>`;
        modal.innerHTML = infoHtml;
        modal.style.display = 'block';
        modal.scrollIntoView({behavior: "smooth"});
        document.getElementById('closeArchetypeInfo').onclick = function() {
          modal.style.display = 'none';
        };
      });
    });
    return;
  } */
 }
 
});