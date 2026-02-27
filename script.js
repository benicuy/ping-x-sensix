// State Management
let currentUser = null;
let selectedServer = 'jakarta';
let currentSettings = {
    sensitivity: {
        camera: 95,
        redDot: 92,
        scope2x: 88,
        scope4x: 72,
        sniper: 55,
        redDotADS: 88,
        scope2xADS: 82,
        scope4xADS: 65
    },
    crosshair: {
        type: 'cross',
        color: '#00ff00',
        size: 25,
        thickness: 2,
        gap: 5,
        opacity: 0.9
    },
    aimassist: {
        aimbot: true,
        autoHS: true,
        noRecoil: true,
        strength: 85,
        hsPriority: 95,
        speed: 8
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Show splash screen for 2 seconds
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        initializeApp();
    }, 2000);
});

function initializeApp() {
    loadSavedSettings();
    updateStats();
    startRealTimeUpdates();
    showNotification('FF SensiX Pro ready!');
    logActivity('System initialized');
}

// ============= LOGIN FUNCTIONS =============
function loginWithFacebook() {
    showLoading('Connecting to Facebook...');
    
    setTimeout(() => {
        currentUser = {
            name: 'Ahmad FF Player',
            id: '87654321',
            level: '67',
            avatar: 'https://i.ibb.co.com/9gQqQ0M/ff-logo.png'
        };
        loginSuccess();
        hideLoading();
    }, 1500);
}

function loginWithGoogle() {
    showLoading('Connecting to Google...');
    
    setTimeout(() => {
        currentUser = {
            name: 'Budi Gamer',
            id: '98765432',
            level: '52',
            avatar: 'https://i.ibb.co.com/9gQqQ0M/ff-logo.png'
        };
        loginSuccess();
        hideLoading();
    }, 1500);
}

function loginWithVK() {
    showLoading('Connecting to VK...');
    
    setTimeout(() => {
        currentUser = {
            name: 'VK Player',
            id: '12345678',
            level: '30',
            avatar: 'https://i.ibb.co.com/9gQqQ0M/ff-logo.png'
        };
        loginSuccess();
        hideLoading();
    }, 1500);
}

function loginAsGuest() {
    showLoading('Creating guest account...');
    
    setTimeout(() => {
        const guestId = 'FF' + Math.floor(100000000 + Math.random() * 900000000);
        currentUser = {
            name: 'Guest Player',
            id: guestId,
            level: '1',
            avatar: 'https://i.ibb.co.com/9gQqQ0M/ff-logo.png'
        };
        loginSuccess();
        hideLoading();
    }, 1000);
}

function manualLogin() {
    const id = document.getElementById('ffId').value;
    const pass = document.getElementById('ffPassword').value;
    
    if(!id || !pass) {
        showNotification('Please enter ID and password!');
        return;
    }
    
    showLoading('Verifying account...');
    
    setTimeout(() => {
        currentUser = {
            name: 'Player ' + id.slice(-4),
            id: id,
            level: '45',
            avatar: 'https://i.ibb.co.com/9gQqQ0M/ff-logo.png'
        };
        loginSuccess();
        hideLoading();
    }, 1500);
}

function loginSuccess() {
    // Update profile display
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileId').textContent = 'ID: ' + currentUser.id;
    document.getElementById('logoutBtn').style.display = 'block';
    
    // Update launch section
    document.getElementById('launchName').textContent = currentUser.name;
    document.getElementById('launchID').textContent = currentUser.id;
    
    // Hide login section
    document.getElementById('loginSection').style.display = 'none';
    
    showNotification('Welcome, ' + currentUser.name + '!');
    logActivity('User logged in: ' + currentUser.name);
}

function logout() {
    currentUser = null;
    
    document.getElementById('profileName').textContent = 'Guest Player';
    document.getElementById('profileId').textContent = 'ID: Not logged in';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('launchName').textContent = 'Not logged in';
    document.getElementById('launchID').textContent = '-';
    
    showNotification('Logged out');
    logActivity('User logged out');
}

// ============= PAGE NAVIGATION =============
function switchPage(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    event.target.closest('.nav-btn').classList.add('active');
    document.getElementById('page-' + page).classList.add('active');
}

// ============= SENSITIVITY FUNCTIONS =============
function updateSensiDisplay() {
    currentSettings.sensitivity.camera = parseInt(document.getElementById('cameraSensi').value);
    currentSettings.sensitivity.redDot = parseInt(document.getElementById('redDotSensi').value);
    currentSettings.sensitivity.scope2x = parseInt(document.getElementById('scope2xSensi').value);
    currentSettings.sensitivity.scope4x = parseInt(document.getElementById('scope4xSensi').value);
    currentSettings.sensitivity.sniper = parseInt(document.getElementById('sniperSensi').value);
    currentSettings.sensitivity.redDotADS = parseInt(document.getElementById('redDotADS').value);
    currentSettings.sensitivity.scope2xADS = parseInt(document.getElementById('scope2xADS').value);
    currentSettings.sensitivity.scope4xADS = parseInt(document.getElementById('scope4xADS').value);
    
    document.getElementById('cameraVal').textContent = currentSettings.sensitivity.camera;
    document.getElementById('redDotVal').textContent = currentSettings.sensitivity.redDot;
    document.getElementById('scope2xVal').textContent = currentSettings.sensitivity.scope2x;
    document.getElementById('scope4xVal').textContent = currentSettings.sensitivity.scope4x;
    document.getElementById('sniperVal').textContent = currentSettings.sensitivity.sniper;
    document.getElementById('redDotADSVal').textContent = currentSettings.sensitivity.redDotADS;
    document.getElementById('scope2xADSVal').textContent = currentSettings.sensitivity.scope2xADS;
    document.getElementById('scope4xADSVal').textContent = currentSettings.sensitivity.scope4xADS;
    
    updateDashboardSensi();
}

function loadPreset(preset) {
    const presets = {
        w2e: { camera: 95, redDot: 92, scope2x: 88, scope4x: 72, sniper: 55, redDotADS: 88, scope2xADS: 82, scope4xADS: 65 },
        djalam: { camera: 98, redDot: 95, scope2x: 90, scope4x: 75, sniper: 60, redDotADS: 92, scope2xADS: 85, scope4xADS: 70 },
        n0ari: { camera: 92, redDot: 90, scope2x: 85, scope4x: 70, sniper: 52, redDotADS: 86, scope2xADS: 80, scope4xADS: 68 },
        sultan: { camera: 100, redDot: 98, scope2x: 92, scope4x: 78, sniper: 58, redDotADS: 95, scope2xADS: 88, scope4xADS: 72 }
    };
    
    const p = presets[preset];
    if(!p) return;
    
    document.getElementById('cameraSensi').value = p.camera;
    document.getElementById('redDotSensi').value = p.redDot;
    document.getElementById('scope2xSensi').value = p.scope2x;
    document.getElementById('scope4xSensi').value = p.scope4x;
    document.getElementById('sniperSensi').value = p.sniper;
    document.getElementById('redDotADS').value = p.redDotADS;
    document.getElementById('scope2xADS').value = p.scope2xADS;
    document.getElementById('scope4xADS').value = p.scope4xADS;
    
    updateSensiDisplay();
    showNotification(`Preset ${preset.toUpperCase()} loaded`);
    logActivity(`Loaded preset: ${preset}`);
}

function applySensitivity() {
    updateSensiDisplay();
    saveSettings();
    showNotification('Sensitivity applied!');
    logActivity('Sensitivity settings applied');
}

function saveSensitivity() {
    saveSettings();
    showNotification('Sensitivity saved!');
}

// ============= CROSSHAIR FUNCTIONS =============
function updateCrosshair() {
    const canvas = document.getElementById('crosshairPreview');
    if(!canvas) return;
    
    currentSettings.crosshair.type = document.getElementById('crosshairType').value;
    currentSettings.crosshair.color = document.getElementById('crosshairColor').value;
    currentSettings.crosshair.size = parseInt(document.getElementById('crossSize').value);
    currentSettings.crosshair.thickness = parseInt(document.getElementById('crossThickness').value);
    currentSettings.crosshair.gap = parseInt(document.getElementById('crossGap').value);
    currentSettings.crosshair.opacity = parseFloat(document.getElementById('crossOpacity').value);
    
    document.getElementById('crossSizeVal').textContent = currentSettings.crosshair.size;
    document.getElementById('crossThicknessVal').textContent = currentSettings.crosshair.thickness;
    document.getElementById('crossGapVal').textContent = currentSettings.crosshair.gap;
    document.getElementById('crossOpacityVal').textContent = Math.round(currentSettings.crosshair.opacity * 100) + '%';
    
    drawCrosshair(canvas, 100);
}

function drawCrosshair(canvas, size) {
    const ctx = canvas.getContext('2d');
    canvas.width = size * 2;
    canvas.height = size * 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.globalAlpha = currentSettings.crosshair.opacity;
    ctx.strokeStyle = currentSettings.crosshair.color;
    ctx.lineWidth = currentSettings.crosshair.thickness;
    
    const s = currentSettings.crosshair.size;
    const g = currentSettings.crosshair.gap;
    
    ctx.beginPath();
    
    switch(currentSettings.crosshair.type) {
        case 'dot':
            ctx.arc(0, 0, s/3, 0, Math.PI * 2);
            ctx.fillStyle = currentSettings.crosshair.color;
            ctx.fill();
            break;
            
        case 'cross':
            ctx.moveTo(-s - g, 0);
            ctx.lineTo(-g, 0);
            ctx.moveTo(g, 0);
            ctx.lineTo(s + g, 0);
            ctx.moveTo(0, -s - g);
            ctx.lineTo(0, -g);
            ctx.moveTo(0, g);
            ctx.lineTo(0, s + g);
            ctx.stroke();
            break;
            
        case 'circle':
            ctx.arc(0, 0, s/2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fillStyle = currentSettings.crosshair.color;
            ctx.fill();
            break;
            
        case 't':
            ctx.moveTo(-s/2, -s);
            ctx.lineTo(s/2, -s);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, 0);
            ctx.stroke();
            break;
            
        case 'arrow':
            ctx.moveTo(0, -s);
            ctx.lineTo(0, 0);
            ctx.moveTo(-s/2, -s/2);
            ctx.lineTo(0, -s);
            ctx.lineTo(s/2, -s/2);
            ctx.stroke();
            break;
    }
    
    ctx.restore();
}

function applyCrosshair() {
    updateCrosshair();
    saveSettings();
    showNotification('Crosshair applied!');
}

function saveCrosshair() {
    saveSettings();
    showNotification('Crosshair saved!');
}

// ============= AIM ASSIST FUNCTIONS =============
function updateAimDisplay() {
    currentSettings.aimassist.strength = parseInt(document.getElementById('aimStrength').value);
    currentSettings.aimassist.hsPriority = parseInt(document.getElementById('hsPriority').value);
    currentSettings.aimassist.speed = parseInt(document.getElementById('aimSpeed').value);
    
    document.getElementById('aimStrengthVal').textContent = currentSettings.aimassist.strength + '%';
    document.getElementById('hsPriorityVal').textContent = currentSettings.aimassist.hsPriority + '%';
    document.getElementById('aimSpeedVal').textContent = currentSettings.aimassist.speed + '/10';
    
    document.getElementById('dashboardHS').textContent = currentSettings.aimassist.hsPriority + '%';
}

function applyAimAssist() {
    currentSettings.aimassist.aimbot = document.getElementById('aimbotToggle').checked;
    currentSettings.aimassist.autoHS = document.getElementById('autoHSToggle').checked;
    currentSettings.aimassist.noRecoil = document.getElementById('noRecoilToggle').checked;
    
    updateAimDisplay();
    saveSettings();
    showNotification('Aim Assist applied!');
}

function saveAimAssist() {
    saveSettings();
    showNotification('Aim Assist saved!');
}

// ============= SERVER FUNCTIONS =============
function selectServer(server) {
    selectedServer = server;
    
    document.querySelectorAll('.server-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.target.closest('.server-btn').classList.add('selected');
    
    const serverNames = {
        jakarta: '3ms',
        bandung: '5ms',
        surabaya: '8ms',
        medan: '15ms'
    };
    
    document.getElementById('dashboardPing').textContent = serverNames[server];
    showNotification(`Server ${server} selected`);
}

// ============= LAUNCH FUNCTIONS =============
function launchFF() {
    if(!currentUser) {
        showNotification('Please login first!');
        switchPage('dashboard');
        return;
    }
    
    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Step 1: Apply settings
    updateLoading(10, 'Applying settings...');
    
    setTimeout(() => {
        applyAllSettings();
        updateLoading(30, 'Optimizing connection...');
        
        setTimeout(() => {
            updateLoading(50, 'Connecting to server...');
            
            setTimeout(() => {
                updateLoading(70, 'Launching game...');
                
                setTimeout(() => {
                    updateLoading(90, 'Almost there...');
                    
                    setTimeout(() => {
                        updateLoading(100, 'Game started!');
                        
                        setTimeout(() => {
                            // Hide loading, show game overlay
                            document.getElementById('loadingOverlay').style.display = 'none';
                            startGame();
                        }, 500);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 500);
}

function launchWithPreset(preset) {
    loadPreset(preset);
    setTimeout(() => {
        launchFF();
    }, 500);
}

function applyAllSettings() {
    // Apply sensitivity
    updateSensiDisplay();
    
    // Apply crosshair
    updateCrosshair();
    
    // Apply aim assist
    currentSettings.aimassist.aimbot = document.getElementById('aimbotToggle').checked;
    currentSettings.aimassist.autoHS = document.getElementById('autoHSToggle').checked;
    currentSettings.aimassist.noRecoil = document.getElementById('noRecoilToggle').checked;
    
    logActivity('All settings applied for game launch');
}

function updateLoading(percent, status) {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('loadingStatus').textContent = status;
    
    const details = document.getElementById('loadingDetails');
    details.innerHTML = `
        Server: ${selectedServer}<br>
        Ping: ${document.getElementById('dashboardPing').textContent}<br>
        HS Rate: ${currentSettings.aimassist.hsPriority}%
    `;
}

function startGame() {
    // Show game overlay
    document.getElementById('gameOverlay').style.display = 'block';
    
    // Update launch button
    document.getElementById('mainLaunchBtn').innerHTML = `
        <span class="launch-icon">🎮</span>
        <span class="launch-text">IN GAME</span>
        <span class="launch-status">Live</span>
    `;
    document.getElementById('gameStatus').textContent = 'In Game';
    
    // Start game loop
    startGameLoop();
    
    showNotification('Game started! Happy gaming!');
    logActivity('Game launched successfully');
    
    // Auto switch to game tab
    switchPage('game');
}

function startGameLoop() {
    // Update game overlay every frame
    setInterval(() => {
        if(document.getElementById('gameOverlay').style.display === 'block') {
            updateGameOverlay();
        }
    }, 16);
}

function updateGameOverlay() {
    const canvas = document.getElementById('gameCrosshair');
    if(canvas) {
        drawCrosshair(canvas, 50);
    }
    
    // Update aim dot position (follow mouse)
    document.addEventListener('mousemove', (e) => {
        const dot = document.getElementById('gameAimDot');
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    });
    
    // Random headshot indicator (simulation)
    if(Math.random() < 0.01) {
        const hs = document.getElementById('gameHSIndicator');
        hs.classList.add('active');
        setTimeout(() => {
            hs.classList.remove('active');
        }, 500);
    }
}

// ============= QUICK OPTIMIZE =============
function quickOptimize() {
    showLoading('Quick optimizing...');
    
    setTimeout(() => {
        // Load best settings
        loadPreset('w2e');
        
        // Set aim assist to max
        document.getElementById('aimStrength').value = 90;
        document.getElementById('hsPriority').value = 98;
        document.getElementById('aimSpeed').value = 9;
        
        // Enable all toggles
        document.getElementById('aimbotToggle').checked = true;
        document.getElementById('autoHSToggle').checked = true;
        document.getElementById('noRecoilToggle').checked = true;
        
        updateAimDisplay();
        
        hideLoading();
        showNotification('⚡ Quick optimize complete!');
        logActivity('Quick optimize applied');
    }, 1500);
}

// ============= UTILITY FUNCTIONS =============
function updateStats() {
    // Update dashboard stats
    document.getElementById('dashboardSensi').textContent = 'W2E Pro';
    document.getElementById('dashboardHS').textContent = currentSettings.aimassist.hsPriority + '%';
    
    // Random ping for demo
    setInterval(() => {
        const ping = Math.floor(8 + Math.random() * 8);
        document.getElementById('dashboardPing').textContent = ping + ' ms';
        document.getElementById('gamePing').textContent = 'Ping: ' + ping + 'ms';
    }, 3000);
    
    // FPS counter
    let fps = 60;
    setInterval(() => {
        fps = Math.floor(55 + Math.random() * 10);
        document.getElementById('gameFPS').textContent = 'FPS: ' + fps;
    }, 1000);
}

function startRealTimeUpdates() {
    // Update time
    setInterval(() => {
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2,'0') + ':' + 
                       now.getMinutes().toString().padStart(2,'0');
        // Could add time display if needed
    }, 1000);
}

function updateDashboardSensi() {
    // Update sensi name based on values
    const camera = currentSettings.sensitivity.camera;
    if(camera >= 98) document.getElementById('dashboardSensi').textContent = 'High Sensi';
    else if(camera >= 90) document.getElementById('dashboardSensi').textContent = 'W2E Pro';
    else document.getElementById('dashboardSensi').textContent = 'Medium';
}

function logActivity(message) {
    const list = document.getElementById('activityList');
    const time = new Date().toLocaleTimeString();
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <span class="activity-time">${time}</span>
        <span class="activity-text">${message}</span>
    `;
    
    list.insertBefore(item, list.firstChild);
    
    // Keep only last 5 activities
    while(list.children.length > 5) {
        list.removeChild(list.lastChild);
    }
}

function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

function showLoading(message) {
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('loadingTitle').textContent = message || 'LOADING...';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function saveSettings() {
    localStorage.setItem('ffSensiXSettings', JSON.stringify(currentSettings));
}

function loadSavedSettings() {
    const saved = localStorage.getItem('ffSensiXSettings');
    if(saved) {
        currentSettings = JSON.parse(saved);
        
        // Restore sensitivity values
        document.getElementById('cameraSensi').value = currentSettings.sensitivity.camera;
        document.getElementById('redDotSensi').value = currentSettings.sensitivity.redDot;
        document.getElementById('scope2xSensi').value = currentSettings.sensitivity.scope2x;
        document.getElementById('scope4xSensi').value = currentSettings.sensitivity.scope4x;
        document.getElementById('sniperSensi').value = currentSettings.sensitivity.sniper;
        document.getElementById('redDotADS').value = currentSettings.sensitivity.redDotADS;
        document.getElementById('scope2xADS').value = currentSettings.sensitivity.scope2xADS;
        document.getElementById('scope4xADS').value = currentSettings.sensitivity.scope4xADS;
        
        // Restore crosshair
        document.getElementById('crosshairType').value = currentSettings.crosshair.type;
        document.getElementById('crosshairColor').value = currentSettings.crosshair.color;
        document.getElementById('crossSize').value = currentSettings.crosshair.size;
        document.getElementById('crossThickness').value = currentSettings.crosshair.thickness;
        document.getElementById('crossGap').value = currentSettings.crosshair.gap;
        document.getElementById('crossOpacity').value = currentSettings.crosshair.opacity;
        
        // Restore aim assist
        document.getElementById('aimbotToggle').checked = currentSettings.aimassist.aimbot;
        document.getElementById('autoHSToggle').checked = currentSettings.aimassist.autoHS;
        document.getElementById('noRecoilToggle').checked = currentSettings.aimassist.noRecoil;
        document.getElementById('aimStrength').value = currentSettings.aimassist.strength;
        document.getElementById('hsPriority').value = currentSettings.aimassist.hsPriority;
        document.getElementById('aimSpeed').value = currentSettings.aimassist.speed;
        
        // Update displays
        updateSensiDisplay();
        updateCrosshair();
        updateAimDisplay();
    }
}

// ============= CLEANUP =============
window.addEventListener('beforeunload', function() {
    saveSettings();
});
