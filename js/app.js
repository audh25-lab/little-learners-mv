// js/app.js — Little Learners MV (enhanced)
(() => {
  // DOM helpers
  const q = (s, el=document) => el.querySelector(s);
  const qa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // UI nav
  qa('.menu button').forEach(btn => btn.addEventListener('click', () => {
    qa('.menu button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    showScreen(btn.dataset.screen);
  }));

  function showScreen(name){
    qa('.screen').forEach(s => s.classList.add('hidden'));
    q('#screen-'+name).classList.remove('hidden');
    if(name==='learn') renderLearn();
    if(name==='games') renderGames();
    if(name==='dhivehi') renderDhivehi();
  }

  // speech helper (TTS)
  function speak(text, lang='en-US'){
    if(window.speechSynthesis){
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang;
      u.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }

  // simple sound generator (no audio files) using WebAudio
  const audioCtx = (window.AudioContext||window.webkitAudioContext) ? new (window.AudioContext||window.webkitAudioContext)() : null;
  function playTone(freq=440, time=0.08){
    if(!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.value=0.12;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); setTimeout(()=>{ o.stop(); }, time*1000);
  }
  function correctSound(){ playTone(880,0.08); playTone(660,0.06); }
  function wrongSound(){ playTone(220,0.12); }

  // RENDER LEARN
  function renderLearn(){
    const area = q('#learn-area');
    area.innerHTML = '';
    const alph = elCard('Alphabets','Tap letters to hear','alphabets-card', ()=> renderAlphabets(area));
    const nums = elCard('Numbers','Tap numbers to hear','numbers-card', ()=> renderNumbers(area));
    const shapes = elCard('Shapes & Colors','Tap to learn','shapes-card', ()=> renderShapes(area));
    const animals = elCard('Animals','Tap animals to hear','animals-card', ()=> renderAnimals(area));
    area.append(alph, nums, shapes, animals);
  }

  function elCard(title,desc,id,click){
    const d = document.createElement('div'); d.className='card'; d.id=id;
    d.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
    d.addEventListener('click',click);
    return d;
  }

  // Alphabets
  function renderAlphabets(container){
    container.innerHTML = '<h2 class="title-sec">Alphabets A–Z</h2>';
    const wrap = document.createElement('div'); wrap.className='grid';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l => {
      const b = document.createElement('button'); b.className='tile letter'; b.textContent=l;
      b.onclick = ()=>{ speak(l); animate(b); correctSound(); };
      wrap.appendChild(b);
    });
    container.appendChild(wrap);
  }

  // Numbers
  function renderNumbers(container){
    container.innerHTML = '<h2 class="title-sec">Numbers 1–20</h2>';
    const wrap = document.createElement('div'); wrap.className='grid';
    for(let i=1;i<=20;i++){
      const b=document.createElement('button'); b.className='tile number'; b.textContent=i;
      b.onclick = ()=>{ speak(i); animate(b); playTone(440 + i*10,0.06); };
      wrap.appendChild(b);
    }
    container.appendChild(wrap);
  }

  // Shapes
  function renderShapes(container){
    container.innerHTML = '<h2 class="title-sec">Shapes</h2>';
    const shapes=['Circle','Square','Triangle','Rectangle','Star','Heart'];
    const wrap=document.createElement('div'); wrap.className='grid';
    shapes.forEach(s=>{
      const b=document.createElement('button'); b.className='tile shape'; b.textContent=s;
      b.onclick = ()=>{ speak(s); animate(b); };
      wrap.appendChild(b);
    });
    container.appendChild(wrap);
  }

  // Animals
  function renderAnimals(container){
    container.innerHTML = '<h2 class="title-sec">Animals</h2>';
    const animals = ['Fish','Crab','Bird','Turtle','Dolphin'];
    const wrap=document.createElement('div'); wrap.className='grid';
    animals.forEach(a=>{
      const b=document.createElement('button'); b.className='tile animal'; b.textContent=a;
      b.onclick = ()=>{ speak(a); animate(b); playTone(500,0.06); };
      wrap.appendChild(b);
    });
    container.appendChild(wrap);
  }

  // Dhivehi (Thaana) — list of example letters
  function renderDhivehi(){
    const area = q('#dhivehi-area');
    area.innerHTML = '<h2 class="title-sec">Dhivehi (Thaana)</h2>';
    const letters = ['ހ','ށ','ނ','ރ','ބ','ޅ','ކ','އ','ވ','މ','ފ','ދ','ތ','ލ','ގ','ޏ','ސ','ޑ','ޒ','ޓ','ޔ','ޕ','ޖ','ޗ','ޘ','ޙ'];
    const wrap=document.createElement('div'); wrap.className='grid';
    letters.forEach(l=>{
      const b=document.createElement('button'); b.className='tile dhivehi'; b.innerHTML=`<span style="font-size:26px">${l}</span>`;
      b.onclick = ()=>{ speak(l,'dv'); animate(b); };
      wrap.appendChild(b);
    });
    area.appendChild(wrap);
  }

  // GAMES
  function renderGames(){
    const area = q('#game-area');
    area.innerHTML = '<p>Choose a game.</p>';
    qa('.game-btn').forEach(btn => btn.addEventListener('click', () => {
      const g = btn.dataset.game;
      if(g==='count') playCountGame(area);
      if(g==='match') playMatchGame(area);
      if(g==='memory') playMemory(area);
    }));
  }

  // Count the fish
  function playCountGame(area){
    area.innerHTML = '';
    const fish = 3 + Math.floor(Math.random()*5);
    const fl = document.createElement('div'); fl.className='game';
    fl.innerHTML = `<div class="fishline">${'🐟 '.repeat(fish)}</div>`;
    const opts = document.createElement('div'); opts.className='grid';
    [fish-1, fish, fish+1].forEach(n=>{
      const b=document.createElement('button'); b.className='tile'; b.textContent=n;
      b.onclick = ()=>{ if(n===fish){ correctSound(); speak('Correct'); alert('Correct!'); } else { wrongSound(); speak('Try again'); alert('Try again'); } };
      opts.appendChild(b);
    });
    fl.appendChild(opts); area.appendChild(fl);
  }

  // Simple match (letter -> word)
  function playMatchGame(area){
    area.innerHTML = ''; 
    const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)];
    const items = ['Apple','Ball','Cat','Dog','Elephant','Fish'];
    const wrap=document.createElement('div'); wrap.className='grid';
    const head = document.createElement('div'); head.innerHTML=`<h2 class="title-sec">${letter} — Match</h2><div style="font-size:48px">${letter}</div>`;
    area.appendChild(head);
    items.slice(0,4).forEach(item=>{
      const b=document.createElement('button'); b.className='tile'; b.textContent=item;
      b.onclick = ()=>{ speak(letter + ' for ' + item); correctSound(); animate(b); };
      wrap.appendChild(b);
    });
    area.appendChild(wrap);
  }

  // Memory pairs
  function playMemory(area){
    area.innerHTML=''; 
    const icons=['🐟','🌴','🐚','🐢'];
    const cards = icons.concat(icons).sort(()=>Math.random()-0.5);
    const wrap=document.createElement('div'); wrap.className='memory';
    cards.forEach((c,i)=>{
      const btn=document.createElement('button'); btn.className='mem'; btn.id='card'+i; btn.textContent='?';
      btn.onclick = ()=> { flipCard(i,c,btn); };
      wrap.appendChild(btn); window['val_'+i]=c;
    });
    area.appendChild(wrap);
    window._mem_first=null; window._mem_locked=false;
  }
  function flipCard(i,val,btn){
    if(window._mem_locked) return;
    btn.textContent=val;
    if(!window._mem_first) window._mem_first={i,val,btn};
    else {
      if(window._mem_first.val===val && window._mem_first.i!==i){
        correctSound(); speak('Match'); btn.style.background='#C7F9CC'; window._mem_first.btn.style.background='#C7F9CC';
        window._mem_first=null;
      } else {
        wrongSound(); window._mem_locked=true; setTimeout(()=>{ btn.textContent='?'; if(window._mem_first) window._mem_first.btn.textContent='?'; window._mem_first=null; window._mem_locked=false; },700);
      }
    }
  }

  // small animation helper
  function animate(el){
    el.style.transform='translateY(-6px) scale(1.02)';
    setTimeout(()=>{ el.style.transform=''; },160);
  }

  // wire initial UI and clicks from index
  document.getElementById('alphabets-card')?.addEventListener('click', ()=> showScreen('learn') || setTimeout(()=> renderAlphabets(q('#learn-area')),50));
  document.getElementById('numbers-card')?.addEventListener('click', ()=> showScreen('learn') || setTimeout(()=> renderNumbers(q('#learn-area')),50));
  document.querySelectorAll('.menu button').forEach(b=>{ if(!b.dataset.screen) b.dataset.screen = (b.textContent.trim().toLowerCase()==='learn'?'learn':b.textContent.trim().toLowerCase()) });

  // create hidden screen wrappers for showScreen logic
  const screens = { learn: '#screen-learn', games: '#screen-games', dhivehi: '#screen-dhivehi', about: '#screen-about' };
  // attach screen id dataset to nav buttons
  qa('.menu button').forEach(b=>{
    const ds = b.getAttribute('data-screen') || b.textContent.trim().toLowerCase();
    b.dataset.screen = ds;
  });

  // initial show
  showScreen('learn');

  // expose speak for debugging
  window.llspeak = speak;

})();