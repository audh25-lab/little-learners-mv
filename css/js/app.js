// js/app.js — Little Learners MV (web)
function showScreen(name) {
  let content = "";

  if (name === "alphabets") {
    content = "<h2>Alphabets</h2>";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letters.forEach(l => {
      content += `<button class="letter" onclick="speak('${l}')">${l}</button> `;
    });
  }

  if (name === "numbers") {
    content = "<h2>Numbers 1–20</h2>";
    for (let i = 1; i <= 20; i++) {
      content += `<button class="number" onclick="speak('${i}')">${i}</button> `;
    }
  }

  if (name === "shapes") {
    content = `
      <h2>Shapes</h2>
      <button class="shape" onclick="speak('Circle')">Circle</button>
      <button class="shape" onclick="speak('Square')">Square</button>
      <button class="shape" onclick="speak('Triangle')">Triangle</button>
      <button class="shape" onclick="speak('Rectangle')">Rectangle</button>
    `;
  }

  if (name === "animals") {
    content = `
      <h2>Animals</h2>
      <button class="animal" onclick="speak('Fish')">Fish</button>
      <button class="animal" onclick="speak('Crab')">Crab</button>
      <button class="animal" onclick="speak('Bird')">Bird</button>
      <button class="animal" onclick="speak('Turtle')">Turtle</button>
    `;
  }

  if (name === "games") {
    content = `
      <h2>Games</h2>
      <p>Choose a simple game below:</p>
      <button onclick="playCountGame()">Count the Fish</button>
      <button onclick="playMemory()">Memory Match</button>
    `;
  }

  document.getElementById("screen").innerHTML = content;
}

function speak(word) {
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(String(word));
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } else {
    alert("Speech not supported on this device/browser.");
  }
}

// Simple Count the Fish game
function playCountGame() {
  const fish = 3 + Math.floor(Math.random() * 5); // 3-7
  let html = `<div class="game"><div class="fishline">${'🐟 '.repeat(fish)}</div><div class="options">`;
  [fish - 1, fish, fish + 1].forEach(n => {
    html += `<button onclick="chooseNumber(${n}, ${fish})">${n}</button>`;
  });
  html += `</div></div>`;
  document.getElementById("screen").innerHTML = html;
}
function chooseNumber(choice, correct) {
  if (choice === correct) { speak('Correct'); alert('Correct!'); }
  else { speak('Try again'); alert('Try again!'); }
}

// Simple memory (pair matching)
function playMemory() {
  const icons = ['🐟','🌴','🐚','🐢'];
  const cards = icons.concat(icons).sort(()=>Math.random()-0.5);
  let html = '<div class="memory">';
  cards.forEach((c, i) => {
    html += `<button class="mem" id="card${i}" onclick="flip(${i})">?</button>`;
    document.getElementById && (window['card_val_'+i] = c);
  });
  html += '</div>';
  document.getElementById("screen").innerHTML = html;
  // small helper in closures
  window._mem_first = null;
  window._mem_locked = false;
}
function flip(i) {
  if (window._mem_locked) return;
  const btn = document.getElementById('card'+i);
  if (!btn) return;
  const val = window['card_val_'+i];
  btn.textContent = val;
  if (!window._mem_first) {
    window._mem_first = { i, val, btn };
  } else {
    if (window._mem_first.val === val && window._mem_first.i !== i) {
      speak('Match');
      btn.style.background = '#C7F9CC';
      window._mem_first.btn.style.background = '#C7F9CC';
      window._mem_first = null;
    } else {
      speak('Try again');
      window._mem_locked = true;
      setTimeout(()=> {
        btn.textContent='?';
        if (window._mem_first && window._mem_first.btn) window._mem_first.btn.textContent='?';
        window._mem_first = null;
        window._mem_locked = false;
      }, 700);
    }
  }
}
