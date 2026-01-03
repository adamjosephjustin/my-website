// ==========================================
// ADAM'S PICTIONARY - GAME LOGIC
// ==========================================

// STATE
let state = {
    name: localStorage.getItem('pictionary_name') || '',
    room: '',
    id: localStorage.getItem('pictionary_player_id') || 'player_' + Math.random().toString(36).substr(2, 9),
    isHost: false,
    settings: { lang: 'EN', diff: 'EASY' },
    isDrawer: false,
    players: [] // Store player order for turns
};

// Save player ID to localStorage so refreshing doesn't create a new player
localStorage.setItem('pictionary_player_id', state.id);

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
    console.log('🎮 [CREATE] Starting game creation...');
    console.log('🎮 [CREATE] Player:', state.name, 'ID:', state.id);

    state.isHost = true;
    state.room = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('🎮 [CREATE] Room code generated:', state.room);

    if (!database) {
        console.error('❌ [CREATE] Firebase database NOT initialized!');
        alert('Firebase connection error! Refresh the page.');
        return;
    }

    const roomRef = database.ref('rooms/' + state.room);
    console.log('🎮 [CREATE] Writing to Firebase...');

    roomRef.set({
        status: "LOBBY",
        settings: state.settings,
        players: {
            [state.id]: { name: state.name, score: 0, isHost: true }
        },
        currentWord: "WAITING",
        drawer: "",
        currentRound: 0,
        totalRounds: 5,
        currentTurn: 0,
        playerOrder: [state.id]
    }).then(() => {
        console.log('✅ [CREATE] Room created successfully!');
        enterGameRoom();
    }).catch(err => {
        console.error('❌ [CREATE] Firebase write FAILED:', err);
        alert('Failed to create room: ' + err.message);
    });
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

            // Add to player order
            database.ref(`rooms/${state.room}/playerOrder`).once('value', orderSnap => {
                const order = orderSnap.val() || [];
                if (!order.includes(state.id)) {
                    order.push(state.id);
                    database.ref(`rooms/${state.room}/playerOrder`).set(order);
                }
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

        // Store player list locally
        state.players = data.playerOrder || [];

        // Update round display
        if (data.status === 'PLAYING') {
            const playerOrder = data.playerOrder || [];
            const players = data.players || {};
            const currentDrawerId = playerOrder[data.currentTurn];
            const currentDrawerName = players[currentDrawerId]?.name || 'Unknown';

            document.getElementById('round-display').innerText = `Round ${data.currentRound}/${data.totalRounds}`;
            document.getElementById('turn-display').innerText = `${currentDrawerName}'s Turn`;
        } else {
            document.getElementById('round-display').innerText = '';
            document.getElementById('turn-display').innerText = '';
        }

        // Show/Hide NEXT button (Host only, during play)
        const nextBtn = document.getElementById('next-turn-btn');
        if (nextBtn) {
            nextBtn.style.display = (state.isHost && data.status === 'PLAYING') ? 'inline-block' : 'none';
        }

        // Drawer Logic
        if (data.drawer === state.id) {
            state.isDrawer = true;
            document.getElementById('word-display').innerText = "YOUR WORD: " + data.currentWord;
        } else {
            state.isDrawer = false;
            if (data.status === 'PLAYING') {
                const drawerName = Object.values(data.players || {}).find(p => data.playerOrder?.[data.currentTurn] === Object.keys(data.players).find(k => data.players[k].name === p.name))?.name || 'Someone';
                document.getElementById('word-display').innerText = `${drawerName} is drawing... (${data.currentWord.replace(/./g, '?')})`;
            } else if (data.status === 'LOBBY') {
                document.getElementById('word-display').innerText = state.isHost ? "Click START when ready!" : "Waiting for host...";
            } else {
                document.getElementById('word-display').innerText = "GAME OVER!";
            }
        }

        // Show/Hide Start Button (Host only, Lobby only)
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.style.display = (state.isHost && data.status === 'LOBBY' && Object.keys(data.players || {}).length >= 2) ? 'block' : 'none';
        }

        // Show/Hide New Game Button
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.style.display = (state.isHost && data.status === 'FINISHED') ? 'block' : 'none';
        }
    });

    // 3. Drawing
    roomRef.child('drawing').on('child_added', data => drawFromRemote(data.val()));
    roomRef.child('action').on('value', s => { if (s.val() === 'CLEAR') clearCanvasUI(); });

    // 4. Chat - Listen and Auto-Check Answers (Host only)
    roomRef.child('chat').on('child_added', snap => {
        const msg = snap.val();
        addChatBubble(msg.name, msg.text, msg.type);

        // Host automatically checks all guesses
        if (state.isHost && msg.type === 'GUESS') {
            console.log('🎯 [HOST] Checking guess:', msg.text, 'from', msg.name);
            checkWinCondition(msg.text, msg.name);
        }
    });
}

function startGame() {
    // Host starts the game
    database.ref(`rooms/${state.room}`).update({
        status: "PLAYING",
        currentRound: 1,
        currentTurn: 0
    });
    nextTurn();
}

function nextTurn() {
    database.ref(`rooms/${state.room}`).once('value', snap => {
        const data = snap.val();
        if (!data) return;

        const playerOrder = data.playerOrder || [];
        let currentTurn = data.currentTurn || 0;
        let currentRound = data.currentRound || 1;

        // Check if round is complete (everyone had a turn)
        if (currentTurn >= playerOrder.length) {
            currentRound++;
            currentTurn = 0;

            // Check if game is finished
            if (currentRound > data.totalRounds) {
                database.ref(`rooms/${state.room}`).update({ status: 'FINISHED' });
                return;
            }
        }

        // Pick word
        const list = WORD_LIST[data.settings.lang][data.settings.diff];
        const word = list[Math.floor(Math.random() * list.length)];

        // Set next drawer
        const drawerId = playerOrder[currentTurn];

        database.ref(`rooms/${state.room}`).update({
            currentWord: word,
            drawer: drawerId,
            currentTurn: currentTurn,
            currentRound: currentRound,
            action: 'CLEAR'
        });
        database.ref(`rooms/${state.room}/drawing`).remove();
    });
}

function newGame() {
    database.ref(`rooms/${state.room}`).update({
        status: 'LOBBY',
        currentRound: 0,
        currentTurn: 0,
        drawer: ''
    });
    // Reset scores
    database.ref(`rooms/${state.room}/players`).once('value', snap => {
        const players = snap.val() || {};
        Object.keys(players).forEach(id => {
            database.ref(`rooms/${state.room}/players/${id}/score`).set(0);
        });
    });
}

// ==========================================
// CANVAS & INTERACTION
// ==========================================
let canvas, ctx;
let drawing = false;
let color = '#000';
let lastPos = null;

function setupCanvas() {
    console.log('🎨 [CANVAS] Setting up canvas...');
    canvas = document.getElementById('main-canvas');

    if (!canvas) {
        console.error('❌ [CANVAS] Canvas element NOT found!');
        return;
    }

    ctx = canvas.getContext('2d');
    console.log('✅ [CANVAS] Canvas initialized:', canvas.width, 'x', canvas.height);

    // Mouse & Touch Events
    ['mousedown', 'touchstart'].forEach(evt =>
        canvas.addEventListener(evt, e => startDraw(e)));
    ['mousemove', 'touchmove'].forEach(evt =>
        canvas.addEventListener(evt, e => moveDraw(e)));
    ['mouseup', 'touchend'].forEach(evt =>
        canvas.addEventListener(evt, () => { drawing = false; lastPos = null; }));

    console.log('✅ [CANVAS] Event listeners attached');
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
    console.log('✏️ [DRAW] Start draw - isDrawer:', state.isDrawer, 'Room:', state.room);

    if (!state.isDrawer) {
        console.warn('✏️ [DRAW] Not allowed to draw (not drawer)');
        return;
    }

    e.preventDefault();
    drawing = true;
    lastPos = getCoords(e);
    console.log('✏️ [DRAW] Drawing started at:', lastPos);
}

function moveDraw(e) {
    if (!drawing || !state.isDrawer) return;
    e.preventDefault();
    const newPos = getCoords(e);

    // Draw Local
    renderLine(lastPos, newPos, color);

    // Send Remote
    if (!database || !state.room) {
        console.error('❌ [DRAW] Cannot save - database:', !!database, 'room:', state.room);
        return;
    }

    database.ref(`rooms/${state.room}/drawing`).push({
        x0: lastPos.x, y0: lastPos.y,
        x1: newPos.x, y1: newPos.y,
        c: color
    }).catch(err => {
        console.error('❌ [DRAW] Failed to save drawing:', err);
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

    console.log('💬 [GUESS] Submitting guess:', txt);

    // Send Guess (Host will auto-check it via chat listener)
    database.ref(`rooms/${state.room}/chat`).push({
        name: state.name,
        text: txt,
        type: 'GUESS'
    });
}

function checkWinCondition(guess, guesserName) {
    console.log('🎯 [CHECK] Validating guess:', guess, 'against word');

    database.ref(`rooms/${state.room}/currentWord`).once('value', snap => {
        const correctWord = snap.val() || "";
        console.log('🎯 [CHECK] Correct word is:', correctWord);

        if (guess.toLowerCase() === correctWord.toLowerCase()) {
            console.log('✅ [WIN] Correct guess! Advancing turn...');

            database.ref(`rooms/${state.room}/chat`).push({
                name: "🎉 GAME",
                text: `${guesserName} guessed it! Next turn...`,
                type: 'WIN'
            });

            // Give points
            database.ref(`rooms/${state.room}/players`).once('value', playersSnap => {
                const players = playersSnap.val() || {};
                const winnerId = Object.keys(players).find(id => players[id].name === guesserName);
                if (winnerId) {
                    database.ref(`rooms/${state.room}/players/${winnerId}/score`).transaction(score => (score || 0) + 10);
                }
            });

            // Next turn after 3s
            setTimeout(nextTurn, 3000);
        } else {
            console.log('❌ [CHECK] Wrong guess');
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

window.clearBoard = () => {
    console.log('🗑️ [CLEAR] Clearing canvas...');
    if (!database || !state.room) {
        console.error('❌ [CLEAR] No database or room');
        return;
    }
    database.ref(`rooms/${state.room}/action`).set('CLEAR').then(() => {
        console.log('✅ [CLEAR] Clear action sent to Firebase');
    }).catch(err => {
        console.error('❌ [CLEAR] Failed:', err);
    });
};

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
window.startGame = startGame;
window.newGame = newGame;
window.nextTurn = nextTurn;
