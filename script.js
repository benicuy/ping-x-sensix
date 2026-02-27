// State Management
let overlayState = {
    aimbot: true,
    autoHS: true,
    noRecoil: true,
    enemyOutline: true,
    damageIndicator: true,
    leftFireBtn: true,
    quickGloo: true
};

let aimSettings = {
    strength: 85,
    hsPriority: 95,
    speed: 8,
    lockDistance: 150,
    mode: 'smart'
};

let crosshairSettings = {
    type: 'cross',
    color: '#00ff00',
    size: 25,
    thickness: 2,
    gap: 5,
    opacity: 0.9,
    spreadIndicator: false,
    recoilAnim: false,
    hitMarker: true
};

let sensiSettings = {
    camera: 95,
    redDot: 92,
    scope2x: 88,
    scope4x: 72,
    sniper: 55,
    redDotADS: 88,
    scope2xADS: 82,
    scope4xADS: 65
};

// Enemy simulation
let enemies = [
    { x: 0.3, y: 0.4, distance: 50, health: 100 },
    { x: 0.6, y: 0.7, distance: 80, health: 100 },
    { x: 0.8, y: 0.3, distance: 120, health: 100 },
    { x: 0.4, y: 0.8, distance: 150, health: 100 }
];

// Mouse position
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let lastMouseX = 0, lastMouseY = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startOverlayLoop();
    loadSettings();
    setupDragAndDrop();
});

function initializeApp() {
    logToConsole('FF SensiX Pro initialized');
    logToConsole('Overlay active - Press F1 to hide/show panel');
    
    // Update time
    updateTime();
    setInterval(updateTime, 1000);
    
    // Start FPS counter
    startFPSCounter();
    
    // Initial crosshair render
    updateCrosshair();
    
    // Setup hotkeys
    document.addEventListener('keydown', handleHotkey);
}

function handleHotkey(e) {
    switch(e.key) {
        case 'F1': togglePanel(); break;
        case 'F2': toggleOverlay('aimbot'); break;
        case 'F3': quickHSMode(); break;
        case 'F4': toggleFullscreen(); break;
    }
}

// Start overlay loop
function startOverlayLoop() {
    setInterval(() => {
        updateAimDot();
        updateEnemyIndicators();
        updateHitDetection();
        updateCrosshairPosition();
    }, 16); // 60fps
}

// Update aim dot position
function updateAimDot() {
    const aimDot = document.getElementById('aimDot');
    if(!aimDot) return;
    
    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Find nearest enemy
    let nearestEnemy = null;
    let nearestDist = Infinity;
    
    enemies.forEach(enemy => {
        const enemyX = window.innerWidth * enemy.x;
        const enemyY = window.innerHeight * enemy.y;
        const dx = enemyX - mouseX;
        const dy = enemyY - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if(dist < nearestDist && dist < aimSettings.lockDistance * 5) {
            nearestDist = dist;
            nearestEnemy = { x: enemyX, y: enemyY, distance: enemy.distance };
        }
    });
    
    // Apply aimbot if enabled and enemy in range
    if(overlayState.aimbot && nearestEnemy && nearestDist < aimSettings.lockDistance * 5) {
        const lockFactor = aimSettings.strength / 100;
        const speed = aimSettings.speed / 20;
        
        // Headshot priority
        if(overlayState.autoHS && Math.random() < aimSettings.hsPriority / 100) {
            targetX += (nearestEnemy.x - mouseX) * speed * lockFactor * 1.2;
            targetY += ((nearestEnemy.y - 50) - mouseY) * speed * lockFactor * 1.2; // Aim higher for head
        } else {
            targetX += (nearestEnemy.x - mouseX) * speed * lockFactor;
            targetY += (nearestEnemy.y - mouseY) * speed * lockFactor;
        }
    } else {
        // Follow mouse
        targetX += (mouseX - targetX) * 0.3;
        targetY += (mouseY - targetY) * 0.3;
    }
    
    aimDot.style.left = targetX + 'px';
    aimDot.style.top = targetY + 'px';
}

// Update enemy indicators
function updateEnemyIndicators() {
    const container = document.getElementById('enemyIndicators');
    if(!container) return;
    
    container.innerHTML = '';
    
    enemies.forEach(enemy => {
        const enemyX = window.innerWidth * enemy.x;
        const enemyY = window.innerHeight * enemy.y;
        
        const dx = enemyX - mouseX;
        const dy = enemyY - mouseY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Show if in range
        if(distance < 500) {
            const dot = document.createElement('div');
            dot.className = 'enemy-dot';
            dot.style.left = enemyX + 'px';
            dot.style.top = enemyY + 'px';
            
            const distLabel = document.createElement('span');
            distLabel.className = 'distance';
            distLabel.textContent = Math.round(enemy.distance) + 'm';
            dot.appendChild(distLabel);
            
            container.appendChild(dot);
        }
    });
}

// Update hit detection
function updateHitDetection() {
    // Simulate random hits
    if(Math.random() < 0.01) { // 1% chance per frame
        showHitmarker();
        
        // Headshot chance
        if(overlayState.autoHS && Math.random() < aimSettings.hsPriority / 100) {
            showHeadshot();
            showDamage(Math.round(85 + Math.random() * 30), true);
        } else {
            showDamage(Math.round(45 + Math.random() * 30), false);
        }
    }
}

// Show hitmarker
function showHitmarker() {
    if(!crosshairSettings.hitMarker) return;
    
    const hitmarker = document.getElementById('hitmarker');
    hitmarker.classList.add('active');
    setTimeout(() => {
        hitmarker.classList.remove('active');
    }, 200);
}

// Show headshot indicator
function showHeadshot() {
    const hsIndicator = document.getElementById('hsIndicator');
    hsIndicator.classList.add('active');
    setTimeout(() => {
        hsIndicator.classList.remove('active');
    }, 500);
}

// Show damage number
function showDamage(amount, isHeadshot) {
    const container = document.getElementById('damageNumbers');
    const damage = document.createElement('div');
    damage.className = 'damage-number' + (isHeadshot ? ' headshot' : '');
    damage.textContent = '-' + amount;
    damage.style.left = targetX + 'px';
    damage.style.top = targetY + 'px';
    
    container.appendChild(damage);
    
    setTimeout(() => {
        damage.remove();
    }, 1000);
}

// Update crosshair
function updateCrosshair() {
    const canvas = document.getElementById('overlayCrosshair');
    const previewCanvas = document.getElementById('crosshairPreview');
    
    // Get settings from UI
    crosshairSettings.type = document.getElementById('crosshairType').value;
    crosshairSettings.color = document.getElementById('crosshairColor').value;
    crosshairSettings.size = parseInt(document.getElementById('crossSize').value);
    crosshairSettings.thickness = parseInt(document.getElementById('crossThickness').value);
    crosshairSettings.gap = parseInt(document.getElementById('crossGap').value);
    crosshairSettings.opacity = parseFloat(document.getElementById('crossOpacity').value);
    
    // Update display values
    document.getElementById('crossSizeVal').textContent = crosshairSettings.size;
    document.getElementById('crossThicknessVal').textContent = crosshairSettings.thickness;
    document.getElementById('crossGapVal').textContent = crosshairSettings.gap;
    document.getElementById('crossOpacityVal').textContent = Math.round(crosshairSettings.opacity * 100) + '%';
    
    // Draw main crosshair
    drawCrosshair(canvas, 100, 100);
    
    // Draw preview
    if(previewCanvas) {
        drawCrosshair(previewCanvas, 50, 50);
    }
}

function drawCrosshair(canvas, width, height) {
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = width * 2;
    canvas.height = height * 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.globalAlpha = crosshairSettings.opacity;
    ctx.strokeStyle = crosshairSettings.color;
    ctx.lineWidth = crosshairSettings.thickness;
    
    const size = crosshairSettings.size;
    const gap = crosshairSettings.gap;
    
    ctx.beginPath();
    
    switch(crosshairSettings.type) {
        case 'dot':
            ctx.arc(0, 0, size/3, 0, Math.PI * 2);
            ctx.fillStyle = crosshairSettings.color;
            ctx.fill();
            break;
            
        case 'cross':
            // Horizontal
            ctx.moveTo(-size - gap, 0);
            ctx.lineTo(-gap, 0);
            ctx.moveTo(gap, 0);
            ctx.lineTo(size + gap, 0);
            // Vertical
            ctx.moveTo(0, -size - gap);
            ctx.lineTo(0, -gap);
            ctx.moveTo(0, gap);
            ctx.lineTo(0, size + gap);
            ctx.stroke();
            break;
            
        case 'circle':
            ctx.arc(0, 0, size/2, 0, Math.PI * 2);
            ctx.stroke();
            // Center dot
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fillStyle = crosshairSettings.color;
            ctx.fill();
            break;
            
        case 't':
            ctx.moveTo(-size/2, -size);
            ctx.lineTo(size/2, -size);
            ctx.moveTo(0, -size);
            ctx.lineTo(0, 0);
            ctx.stroke();
            break;
            
        case 'arrow':
            ctx.moveTo(0, -size);
            ctx.lineTo(0, 0);
            ctx.moveTo(-size/2, -size/2);
            ctx.lineTo(0, -size);
            ctx.lineTo(size/2, -size/2);
            ctx.stroke();
            break;
            
        default: // default FF style
            ctx.moveTo(-size, 0);
            ctx.lineTo(size, 0);
            ctx.moveTo(0, -size);
            ctx.lineTo(0, size);
            ctx.stroke();
    }
    
    ctx.restore();
}

function updateCrosshairPosition() {
    const canvas = document.getElementById('overlayCrosshair');
    if(!canvas) return;
    
    // Center crosshair
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
}

// Update aim settings from UI
function updateAimStrength() {
    aimSettings.strength = parseInt(document.getElementById('aimStrength').value);
    document.getElementById('aimStrengthVal').textContent = aimSettings.strength + '%';
}

function updateHSPriority() {
    aimSettings.hsPriority = parseInt(document.getElementById('hsPriority').value);
    document.getElementById('hsPriorityVal').textContent = aimSettings.hsPriority + '%';
    document.getElementById('hsCounter').textContent = aimSettings.hsPriority;
}

function updateAimSpeed() {
    aimSettings.speed = parseInt(document.getElementById('aimSpeed').value);
    document.getElementById('aimSpeedVal').textContent = aimSettings.speed + '/10';
}

function updateLockDistance() {
    aimSettings.lockDistance = parseInt(document.getElementById('lockDistance').value);
    document.getElementById('lockDistanceVal').textContent = aimSettings.lockDistance + 'm';
}

function updateAimMode() {
    aimSettings.mode = document.getElementById('aimMode').value;
    logToConsole('Aim mode changed to: ' + aimSettings.mode);
}

// Toggle functions
function toggleAimbot() {
    overlayState.aimbot = document.getElementById('aimbotToggle').checked;
    logToConsole('Aimbot: ' + (overlayState.aimbot ? 'ON' : 'OFF'));
}

function toggleAutoHS() {
    overlayState.autoHS = document.getElementById('autoHSToggle').checked;
    logToConsole('Auto Headshot: ' + (overlayState.autoHS ? 'ON' : 'OFF'));
}

function toggleNoRecoil() {
    overlayState.noRecoil = document.getElementById('noRecoilToggle').checked;
    logToConsole('No Recoil: ' + (overlayState.noRecoil ? 'ON' : 'OFF'));
}

function toggleEnemyOutline() {
    overlayState.enemyOutline = document.getElementById('enemyOutline').checked;
    logToConsole('Enemy Outline: ' + (overlayState.enemyOutline ? 'ON' : 'OFF'));
}

function toggleDamageIndicator() {
    overlayState.damageIndicator = document.getElementById('damageIndicator').checked;
    logToConsole('Damage Indicator: ' + (overlayState.damageIndicator ? 'ON' : 'OFF'));
}

function toggleLeftFire() {
    overlayState.leftFireBtn = document.getElementById('leftFireBtn').checked;
    logToConsole('Left Fire Button: ' + (overlayState.leftFireBtn ? 'ON' : 'OFF'));
}

function toggleQuickGloo() {
    overlayState.quickGloo = document.getElementById('quickGloo').checked;
    logToConsole('Quick Gloo Wall: ' + (overlayState.quickGloo ? 'ON' : 'OFF'));
}

// Sensitivity functions
function updateSensi() {
    sensiSettings.camera = parseInt(document.getElementById('cameraSensi').value);
    sensiSettings.redDot = parseInt(document.getElementById('redDotSensi').value);
    sensiSettings.scope2x = parseInt(document.getElementById('scope2xSensi').value);
    sensiSettings.scope4x = parseInt(document.getElementById('scope4xSensi').value);
    sensiSettings.sniper = parseInt(document.getElementById('sniperSensi').value);
    sensiSettings.redDotADS = parseInt(document.getElementById('redDotADS').value);
    sensiSettings.scope2xADS = parseInt(document.getElementById('scope2xADS').value);
    sensiSettings.scope4xADS = parseInt(document.getElementById('scope4xADS').value);
    
    // Update display
    document.getElementById('cameraSensiVal').textContent = sensiSettings.camera;
    document.getElementById('redDotSensiVal').textContent = sensiSettings.redDot;
    document.getElementById('scope2xSensiVal').textContent = sensiSettings.scope2x;
    document.getElementById('scope4xSensiVal').textContent = sensiSettings.scope4x;
    document.getElementById('sniperSensiVal').textContent = sensiSettings.sniper;
    document.getElementById('redDotADSVal').textContent = sensiSettings.redDotADS;
    document.getElementById('scope2xADSVal').textContent = sensiSettings.scope2xADS;
    document.getElementById('scope4xADSVal').textContent = sensiSettings.scope4xADS;
}

// Load presets
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
    
    updateSensi();
    logToConsole(`Loaded preset: ${preset.toUpperCase()}`);
    showNotification(`✅ Preset ${preset.toUpperCase()} loaded`);
}

// Quick HS Mode
function quickHSMode() {
    aimSettings.hsPriority = 100;
    aimSettings.strength = 95;
    
    document.getElementById('hsPriority').value = 100;
    document.getElementById('aimStrength').value = 95;
    
    updateHSPriority();
    updateAimStrength();
    
    showNotification('🔥 HEADSHOT MODE ACTIVATED');
    logToConsole('Quick HS Mode activated - 100% priority');
}

// Apply settings
function applySettings() {
    updateAimStrength();
    updateHSPriority();
    updateAimSpeed();
    updateLockDistance();
    updateCrosshair();
    updateSensi();
    
    showNotification('✅ Settings applied');
    logToConsole('All settings applied');
}

// Save profile
function saveProfile() {
    const profile = {
        overlay: overlayState,
        aim: aimSettings,
        crosshair: crosshairSettings,
        sensi: sensiSettings
    };
    
    localStorage.setItem('ffSensiXProfile', JSON.stringify(profile));
    showNotification('💾 Profile saved');
    logToConsole('Profile saved to storage');
}

// Load profile
function loadProfile() {
    const saved = localStorage.getItem('ffSensiXProfile');
    if(saved) {
        const profile = JSON.parse(saved);
        
        overlayState = profile.overlay;
        aimSettings = profile.aim;
        crosshairSettings = profile.crosshair;
        sensiSettings = profile.sensi;
        
        // Update UI
        document.getElementById('aimbotToggle').checked = overlayState.aimbot;
        document.getElementById('autoHSToggle').checked = overlayState.autoHS;
        document.getElementById('noRecoilToggle').checked = overlayState.noRecoil;
        
        document.getElementById('aimStrength').value = aimSettings.strength;
        document.getElementById('hsPriority').value = aimSettings.hsPriority;
        document.getElementById('aimSpeed').value = aimSettings.speed;
        document.getElementById('lockDistance').value = aimSettings.lockDistance;
        
        document.getElementById('crosshairType').value = crosshairSettings.type;
        document.getElementById('crosshairColor').value = crosshairSettings.color;
        document.getElementById('crossSize').value = crosshairSettings.size;
        document.getElementById('crossThickness').value = crosshairSettings.thickness;
        document.getElementById('crossGap').value = crosshairSettings.gap;
        document.getElementById('crossOpacity').value = crosshairSettings.opacity;
        
        updateCrosshair();
        updateSensi();
        
        showNotification('📂 Profile loaded');
        logToConsole('Profile loaded from storage');
    }
}

// Reset settings
function resetSettings() {
    if(confirm('Reset all settings to default?')) {
        // Reset aim settings
        aimSettings = { strength: 85, hsPriority: 95, speed: 8, lockDistance: 150, mode: 'smart' };
        crosshairSettings = { type: 'cross', color: '#00ff00', size: 25, thickness: 2, gap: 5, opacity: 0.9, spreadIndicator: false, recoilAnim: false, hitMarker: true };
        
        // Update UI
        document.getElementById('aimStrength').value = 85;
        document.getElementById('hsPriority').value = 95;
        document.getElementById('aimSpeed').value = 8;
        document.getElementById('lockDistance').value = 150;
        
        document.getElementById('crosshairType').value = 'cross';
        document.getElementById('crosshairColor').value = '#00ff00';
        document.getElementById('crossSize').value = 25;
        document.getElementById('crossThickness').value = 2;
        document.getElementById('crossGap').value = 5;
        document.getElementById('crossOpacity').value = 0.9;
        
        updateAimStrength();
        updateHSPriority();
        updateAimSpeed();
        updateLockDistance();
        updateCrosshair();
        
        // Load default sensi
        loadPreset('w2e');
        
        showNotification('↺ Settings reset');
        logToConsole('Settings reset to default');
    }
}

// Panel functions
function toggleMinimize() {
    const panel = document.getElementById('floatingPanel');
    panel.classList.toggle('minimized');
}

function togglePanel() {
    const panel = document.getElementById('floatingPanel');
    if(panel.style.display === 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

// Tab switching
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
}

// Drag and drop
function setupDragAndDrop() {
    const panel = document.getElementById('floatingPanel');
    const handle = document.getElementById('dragHandle');
    
    let isDragging = false;
    let offsetX, offsetY;
    
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if(isDragging) {
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = 'default';
    });
}

// FPS Counter
let frameCount = 0;
let lastFPSUpdate = performance.now();

function startFPSCounter() {
    setInterval(() => {
        const now = performance.now();
        const delta = now - lastFPSUpdate;
        const fps = Math.round((frameCount * 1000) / delta);
        
        document.getElementById('fpsCounter').textContent = Math.min(60, fps);
        document.getElementById('fpsDisplay').textContent = fps + ' FPS';
        
        frameCount = 0;
        lastFPSUpdate = now;
    }, 1000);
}

// Update frame counter (call this in animation loop)
setInterval(() => {
    frameCount++;
}, 16);

// Time update
function updateTime() {
    const now = new Date();
    document.getElementById('statusTime').textContent = 
        now.getHours().toString().padStart(2,'0') + ':' + 
        now.getMinutes().toString().padStart(2,'0');
}

// Show notification
function showNotification(message) {
    const status = document.getElementById('statusBar').children[0];
    const original = status.textContent;
    status.textContent = message;
    status.style.color = '#ffff00';
    
    setTimeout(() => {
        status.textContent = original;
        status.style.color = '#00ff88';
    }, 2000);
}

// Log to console (simulated)
function logToConsole(message) {
    console.log('[FF SensiX] ' + message);
}

// Color preset
function applyColorPreset() {
    const color = document.getElementById('colorPreset').value;
    document.getElementById('crosshairColor').value = color;
    updateCrosshair();
}

// Clean memory (simulated)
function cleanMemory() {
    showNotification('🧹 Memory cleaned!');
    logToConsole('Memory cleanup performed');
}

// Load saved settings
function loadSettings() {
    loadProfile();
}

// Simulate enemy movement
setInterval(() => {
    enemies = enemies.map(enemy => ({
        x: Math.max(0.1, Math.min(0.9, enemy.x + (Math.random() - 0.5) * 0.02)),
        y: Math.max(0.1, Math.min(0.9, enemy.y + (Math.random() - 0.5) * 0.02)),
        distance: enemy.distance + (Math.random() - 0.5) * 5,
        health: enemy.health
    }));
}, 3000);

// Ping simulation
setInterval(() => {
    const ping = Math.floor(10 + Math.random() * 15);
    document.getElementById('pingCounter').textContent = ping;
}, 2000);
