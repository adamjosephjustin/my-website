// ==========================================
// ADAM'S PICTIONARY - GAME LOGIC
// ==========================================

// STATE
let state = {
    name: localStorage.getItem('pictionary_name') || '',
    room: '',
    id: 'player_' + Math.random().toString(36).substr(2, 9),
    isHost: false,
    settings: { lang: 'EN', diff: 'EASY' },
    isDrawer: false
};

// DOM ELEMENTS
const views = {
    welcome: document.getElementById('view-welcome'),
    mode: document.getElementById('view-mode-select'),
    create: document.getElementById('view-create'),
    join: document.getElementById('view-join'),
    game: document.getElementById('view-game')
};

// INIT
window.onload = () => {
    initFirebase();
    if (state.name) document.getElementById('input-name').value = state.name;
    setupCanvas();

    // Check for rejoin
    const lastRoom = localStorage.getItem('pictionary_last_room');
    if (lastRoom && state.name) {
        const rejoin = confirm(`Hey ${state.name}! You were in room ${lastRoom}. Want to rejoin?`);
        if (rejoin) {
            state.room = lastRoom;
            document.getElementById('input-room-code').value = lastRoom;
            joinGame();
        }
    }
};

// ==========================================
// NAVIGATION "ROUTER"
// ==========================================
function switchView(viewName) {
    // Hide all
    Object.values(views).forEach(el => el.classList.add('hidden'));
    // Show target
    views[viewName].classList.remove('hidden');
}

function submitName() {
    const name = document.getElementById('input-name').value.trim();
    if (!name) return alert("Please tell me your name! 📛");

    state.name = name;
    localStorage.setItem('pictionary_name', name);
    document.getElementById('display-name').innerText = name;
    switchView('mode');
}

function enterCreateMode() {
    switchView('create');
}

function enterJoinMode() {
    switchView('join');
    setTimeout(() => document.getElementById('input-room-code').focus(), 100);
}

function selectSetting(type, value) {
    state.settings[type] = value;
    // Update UI highlights
    document.querySelectorAll(`.toggle-group[data-type="${type}"] .toggle-option`).forEach(el => {
        el.classList.toggle('selected', el.dataset.value === value);
    });
}

// ==========================================
// GAME PLAY (LOBBY)
// ==========================================

function createGame() {
    state.isHost = true;
    state.room = Math.floor(1000 + Math.random() * 9000).toString();

    const roomRef = database.ref('rooms/' + state.room);
    roomRef.set({
        status: "LOBBY",
        settings: state.settings,
        players: {
            [state.id]: { name: state.name, score: 0, isHost: true }
        },
        currentWord: "WAITING",
        drawer: ""
    });

    enterGameRoom();
}

function joinGame() {
    state.room = document.getElementById('input-room-code').value.trim();
    if (state.room.length !== 4) return alert("Room code should be 4 numbers! 🔢");

    const roomRef = database.ref('rooms/' + state.room);
    roomRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            database.ref(`rooms/${state.room}/players/${state.id}`).set({
                name: state.name, score: 0, isHost: false
            });
            enterGameRoom();
        } else {
            alert("Oops! I can't find that room. 🤷‍♂️");
        }
    });
}

function enterGameRoom() {
    document.getElementById('room-badge').innerText = `Room: ${state.room}`;
    localStorage.setItem('pictionary_last_room', state.room); // Save for rejoin
    switchView('game');
    listenToRoom();
}

function exitRoom() {
    if (!confirm('Leave this room?')) return;

    // Remove from Firebase
    if (state.room && state.id) {
        database.ref(`rooms/${state.room}/players/${state.id}`).remove();
    }

    // Clear local state
    localStorage.removeItem('pictionary_last_room');
    state.room = '';
    state.isHost = false;
    state.isDrawer = false;

    // Return to mode select
    switchView('mode');
}

// ==========================================
// REAL-TIME UPDATES
// ==========================================
function listenToRoom() {
    const roomRef = database.ref('rooms/' + state.room);

    // 1. Players & Scores
    roomRef.child('players').on('value', snap => {
        const players = snap.val() || {};
        const list = document.getElementById('players-list');
        list.innerHTML = Object.values(players)
            .map(p => `<div class="player-tag">${p.name} <span class="score">${p.score}</span></div>`)
            .join('');

        // Host Auto-Start Check (Simple V1: Host is drawer if ID matches drawer, else wait)
        if (state.isHost && !state.isDrawer && Object.keys(players).length > 1) {
            // Logic to start game if not started?
            // Keeping it manual for now or auto on 2nd player? 
            // Let's stick to the previous simple logic: Host starts round 1 manually via a button? 
            // Or auto. The previous logic had auto-start.
            // We'll leave the auto-start logic from previous iteration if it works, or add a 'Start' button later.
        }
    });

    // 2. Game State
    roomRef.on('value', snap => {
        const data = snap.val();
        if (!data) return;

        // Drawer Logic
        if (data.drawer === state.id) {
            state.isDrawer = true;
            document.getElementById('word-display').innerText = "DRAW: " + data.currentWord;
        } else {
            state.isDrawer = false;
            document.getElementById('word-display').innerText = data.drawer ? "GUESS THE DRAWING!" : "WAITING FOR PLAYERS...";
        }

        // Toolbar Visibility
        document.querySelector('.canvas-toolbar').classList.toggle('hidden', !state.isDrawer);

        // Lobby -> Playing transition
        if (state.isHost && data.status === "LOBBY" && Object.keys(data.players || {}).length >= 2) {
            startRound();
        }
    });

    // 3. Drawing
    roomRef.child('drawing').on('child_added', data => drawFromRemote(data.val()));
    roomRef.child('action').on('value', s => { if (s.val() === 'CLEAR') clearCanvasUI(); });

    // 4. Chat
    roomRef.child('chat').on('child_added', snap => {
        const msg = snap.val();
        addChatBubble(msg.name, msg.text, msg.type);
    });
}

function startRound() {
    const list = WORD_LIST[state.settings.lang][state.settings.diff];
    const word = list[Math.floor(Math.random() * list.length)];

    // Pick next drawer? Random for now.
    const playerIds = Object.keys(state.players || {}); // Need to store players locally to pick?
    // Simplified: Host always sets drawer to Self for Test, or Random.
    // Let's just set Host as Drawer for first round.

    database.ref(`rooms/${state.room}`).update({
        status: "PLAYING",
        currentWord: word,
        drawer: state.id, // Host starts
        action: 'CLEAR'
    });
    database.ref(`rooms/${state.room}/drawing`).remove();
}

// ==========================================
// CANVAS & INTERACTION
// ==========================================
let canvas, ctx;
let drawing = false;
let color = '#000';
let lastPos = null;

function setupCanvas() {
    canvas = document.getElementById('main-canvas');
    ctx = canvas.getContext('2d');

    // Mouse & Touch Events
    ['mousedown', 'touchstart'].forEach(evt =>
        canvas.addEventListener(evt, e => startDraw(e)));
    ['mousemove', 'touchmove'].forEach(evt =>
        canvas.addEventListener(evt, e => moveDraw(e)));
    ['mouseup', 'touchend'].forEach(evt =>
        canvas.addEventListener(evt, () => { drawing = false; lastPos = null; }));
}

function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Scale coordinates: canvas internal size vs displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDraw(e) {
    if (!state.isDrawer) return;
    e.preventDefault();
    drawing = true;
    lastPos = getCoords(e);
}

function moveDraw(e) {
    if (!drawing || !state.isDrawer) return;
    e.preventDefault();
    const newPos = getCoords(e);

    // Draw Local
    renderLine(lastPos, newPos, color);

    // Send Remote
    database.ref(`rooms/${state.room}/drawing`).push({
        x0: lastPos.x, y0: lastPos.y,
        x1: newPos.x, y1: newPos.y,
        c: color
    });

    lastPos = newPos;
}

function renderLine(p1, p2, c) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = c;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function drawFromRemote(d) {
    if (!d) return;
    renderLine({ x: d.x0, y: d.y0 }, { x: d.x1, y: d.y1 }, d.c);
}

function clearCanvasUI() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ==========================================
// CHAT
// ==========================================
function submitGuess() {
    const input = document.getElementById('input-guess');
    const txt = input.value.trim();
    if (!txt) return;
    input.value = "";

    // Send Guess
    database.ref(`rooms/${state.room}/chat`).push({
        name: state.name,
        text: txt,
        type: 'GUESS'
    });

    // Check Win (Client-side optimistic check for fun/speed, ideally server-side)
    // Checking against known word "wait" - wait, clients don't know word typically?
    // In this simple version, we trust the client or host logic.
    // Host will check match.
    if (state.isHost) checkWinCondition(txt, state.name);
}

function checkWinCondition(guess, guesserName) {
    // Host Logic
    database.ref(`rooms/${state.room}/currentWord`).once('value', snap => {
        if (guess.toLowerCase() === (snap.val() || "").toLowerCase()) {
            database.ref(`rooms/${state.room}/chat`).push({
                name: "REFEREE", text: `${guesserName} CORRECT! 🎉`, type: 'WIN'
            });
            // Loop round
            setTimeout(startRound, 3000);
        }
    });
}

function addChatBubble(name, text, type) {
    const box = document.getElementById('chat-box');
    const el = document.createElement('div');
    if (type === 'WIN') {
        el.className = 'msg-correct';
        el.innerText = text; // "ADAM CORRECT!"
    } else {
        el.className = 'msg-guess';
        el.innerText = `${name}: ${text}`;
    }
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}

function setColor(c, element) {
    color = c;
    document.querySelectorAll('.color-dot').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
}

window.clearBoard = () => database.ref(`rooms/${state.room}/action`).set('CLEAR');

// Re-expose standard functions to window for HTML onclicks
window.submitName = submitName;
window.enterCreateMode = enterCreateMode;
window.enterJoinMode = enterJoinMode;
window.selectSetting = selectSetting;
window.createGame = createGame;
window.joinGame = joinGame;
window.setColor = setColor;
window.submitGuess = submitGuess;
window.exitRoom = exitRoom;
