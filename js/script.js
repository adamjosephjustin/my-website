// Local Storage Keys
const USER_NAME_KEY = 'adam_user_name';
const PROGRESS_KEY = 'adam_progress'; // Stores: {L1: true, L2: false, ...}

// --- INITIALIZATION & UTILITIES ---

function initializeUser() {
    let name = localStorage.getItem(USER_NAME_KEY);
    if (!name) {
        name = prompt("Welcome to Adam's World! What is the student's name?");
        if (name) {
            localStorage.setItem(USER_NAME_KEY, name.trim());
        }
    }
    return localStorage.getItem(USER_NAME_KEY) || "Future Coder";
}

function getProgress() {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    return savedProgress ? JSON.parse(savedProgress) : {};
}

function saveProgress(lessonKey) {
    const progress = getProgress();
    progress[lessonKey] = true;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    
    // Auto-update index if on the index page
    if (document.getElementById('status-beginner')) {
        updateCourseIndex();
    }
}

// --- INDEX PAGE LOGIC ---

function updateCourseIndex() {
    const progress = getProgress();
    const totalLessons = 15; // Total lessons defined
    const lessonsPerCert = 5;
    
    // Check certificate status
    const isBeginnerComplete = checkCertCompletion(1, lessonsPerCert, progress);
    const isIntermediateComplete = checkCertCompletion(6, lessonsPerCert * 2, progress);
    const isProComplete = checkCertCompletion(11, totalLessons, progress);

    // Update visibility of certificate buttons
    document.getElementById('cert-beginner').classList.toggle('hidden', !isBeginnerComplete);
    document.getElementById('cert-intermediate').classList.toggle('hidden', !isIntermediateComplete);
    document.getElementById('cert-pro').classList.toggle('hidden', !isProComplete);

    // Update Links and Lock status
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        const lessonNum = index + 1;
        const lessonKey = `L${lessonNum}`;
        const nextLessonKey = `L${lessonNum + 1}`;
        
        let isCompleted = progress[lessonKey];
        let isUnlocked = lessonNum === 1 || progress[nextLessonKey] || progress[`L${lessonNum - 1}`];

        // 1. Update Link Status
        card.classList.remove('locked');
        card.href = `lessons/lesson${lessonNum}.html`;

        // 2. Lock next lessons, but unlock if previous is done
        if (lessonNum > 1 && !progress[`L${lessonNum - 1}`]) {
             card.classList.add('locked');
             card.href = '#';
        }
    });

    // Update Section Headers
    document.getElementById('status-beginner').innerText = isBeginnerComplete ? "Completed! Claim Certificate!" : `Progress: ${countCompleted(1, 5, progress)}/5`;
    document.getElementById('status-intermediate').innerText = isBeginnerComplete ? (isIntermediateComplete ? "Completed! Claim Certificate!" : `Progress: ${countCompleted(6, 10, progress)}/5`) : "Locked: Finish Beginner Course";
    document.getElementById('status-pro').innerText = isIntermediateComplete ? (isProComplete ? "Completed! Claim Certificate!" : `Progress: ${countCompleted(11, 15, progress)}/5`) : "Locked: Finish Intermediate Course";
    
    // Unlock Intermediate/Pro sections if required
    document.getElementById('intermediate-track').style.opacity = isBeginnerComplete ? 1 : 0.5;
    document.getElementById('pro-track').style.opacity = isIntermediateComplete ? 1 : 0.5;
}

function countCompleted(start, end, progress) {
    let count = 0;
    for (let i = start; i <= end; i++) {
        if (progress[`L${i}`]) count++;
    }
    return count;
}

function checkCertCompletion(start, end, progress) {
    for (let i = start; i <= end; i++) {
        if (!progress[`L${i}`]) return false;
    }
    return true;
}

// --- CERTIFICATE MODAL LOGIC ---

function showCertificate(level) {
    const modal = document.getElementById('certificate-modal');
    const content = document.getElementById('certificate-content');
    const studentName = localStorage.getItem(USER_NAME_KEY) || "A Dedicated Student";
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let colorClass = level.toLowerCase();
    
    content.innerHTML = `
        <div class="cert-header">Adam's World 🌎</div>
        <div class="cert-text">PROUDLY PRESENTS THIS</div>
        <div class="cert-level ${colorClass}-color">
            ${level} Certificate
        </div>
        <div class="cert-text">TO</div>
        <div class="cert-name">${studentName}</div>
        <div class="cert-text">For the successful completion of the<br>Junior Coding Academy ${level} Track.</div>
        <div class="cert-footer">Awarded on: ${date}<br>Lead Instructor: Prof. Adam</div>
        <button onclick="window.print()" class="game-button" style="margin-top: 20px;">🖨️ Print Certificate</button>
    `;
    modal.classList.remove('hidden');
}

function hideCertificate() {
    document.getElementById('certificate-modal').classList.add('hidden');
}

// --- LESSON PAGE LOGIC (Called from lessonX.html) ---

function initializeLesson(lessonNum, successCallback) {
    const lessonKey = `L${lessonNum}`;
    
    // Check for user name
    initializeUser();
    
    // Check if already completed
    const progress = getProgress();
    if (progress[lessonKey]) {
        document.getElementById('game-feedback').innerHTML = "✅ **Lesson Already Completed!** Click 'Next Lesson' to continue.";
    }

    // Assign success function to a global variable accessible by the puzzle
    window.lessonSuccess = () => {
        saveProgress(lessonKey);
        document.getElementById('game-feedback').innerHTML = "🎉 **SUCCESS!** You solved the puzzle!";
        document.getElementById('next-btn').classList.remove('hidden');
        if (typeof successCallback === 'function') {
            successCallback();
        }
    };
    
    // Next button setup
    const nextBtn = document.getElementById('next-btn');
    const nextLessonNum = lessonNum + 1;
    if (nextLessonNum <= 15) {
        nextBtn.href = `lesson${nextLessonNum}.html`;
    } else {
        nextBtn.innerText = "Finish Course & Go to Index";
        nextBtn.href = `../index.html`;
    }
    
    // Hide Next button until successful
    if (!progress[lessonKey]) {
        nextBtn.classList.add('hidden');
    }
}
