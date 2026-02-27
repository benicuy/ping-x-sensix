// Overlay State
let overlayState = {
    aim: true,
    crosshair: true,
    radar: true
};

// Enemy positions (simulasi)
let enemies = [
    { x: 0.3, y: 0.4, distance: 50, health: 100 },
    { x: 0.7, y: 0.6, distance: 80, health: 100 },
    { x: 0.5, y: 0.2, distance: 120, health: 100 }
];

// Crosshair settings
let crosshairSettings = {
    type: 'dot',
    color: '#00ff00',
    size: 25,
    thickness: 2,
    gap: 5,
    outline: 'black',
    opacity: 0.9
};

// Aim settings
let aimSettings = {
    strength: 85,
    hsPriority: 95,
    speed: 8,
    prediction: 'low'
};

// Radar settings
let radarSettings = {
    size: 200,
    position: 'top-right',
    showDistance: 'yes',
    range: 100
};

// Mouse position tracking
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeOverlay();
    setupEventListeners();
    startOverlayLoop();
    loadSettings();
});

// Initialize overlay
function initializeOverlay() {
    logToConsole('FF Aim Overlay initialized');
    logToConsole('Press F1-F6 for hotkeys');
    
    // Set initial crosshair
    updateCrosshair();
    
    // Set initial radar
    updateRadar();
    
    // Start mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Hotkeys
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'F1': toggleOverlay('aim'); break;
            case 'F2': toggleOverlay('crosshair'); break;
            case 'F3': toggleOverlay('radar'); break;
            case 'F4': quickHSMode(); break;
            case 'F5': toggleAllOverlays(); break;
            case 'F6': resetOverlayPosition(); break;
        }
    });
    
    // Drag panel
    const panel = document.getElementById('controlPanel');
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

// Toggle overlay elements
function toggleOverlay(element) {
    overlayState[element] = !overlayState[element];
    
    const btn = document.getElementById(element + 'Toggle');
    const overlay = document.getElementById('aimOverlay');
    
    if(overlayState[element]) {
        btn.classList.add('active');
        overlay.style.display = 'block';
        logToConsole(`${element} overlay activated`);
    } else {
        btn.classList.remove('active');
        logToConsole(`${element} overlay deactivated`);
    }
    
    updateOverlayVisibility();
}

// Update overlay visibility
function updateOverlayVisibility() {
    const aimGuide = document.querySelector('.aim-guide');
    const crosshair = document.getElementById('crosshairContainer');
    const radar = document.getElementById('radarContainer');
    const movement = document.getElementById('movementGuide');
    const recoil = document.getElementById('recoilControl');
    
    aimGuide.style.display = overlayState.aim ? 'block' : 'none';
    crosshair.style.display = overlayState.crosshair ? 'block' : 'none';
    radar.style.display = overlayState.radar ? 'block' : 'none';
    movement.style.display = overlayState.aim ? 'flex' : 'none';
    recoil.style.display = overlayState.aim ? 'block' : 'none';
}

// Main overlay loop
function startOverlayLoop() {
    setInterval(() => {
        if(!overlayState.aim && !overlayState.crosshair && !overlayState.radar) return;
        
        // Update aim guide
        if(overlayState.aim) {
            updateAimGuide();
            updateEnemyIndicators();
            updateMovementGuide();
            updateRecoilControl();
        }
        
        // Update radar
        if(overlayState.radar) {
            updateRadarDisplay();
        }
        
        // Update status
        updateStatusIndicator();
    }, 16); // ~60fps
}

// Update aim guide
function updateAimGuide() {
    const aimDot = document.getElementById('aimDot');
    const hsIndicator = document.getElementById('headshotIndicator');
    const distanceIndicator = document.getElementById('distanceIndicator');
    
    // Hitung nearest enemy
    let nearestEnemy = null;
    let nearestDistance = Infinity;
    
    enemies.forEach(enemy => {
        // Convert to screen coordinates (simulasi)
        const enemyScreenX = window.innerWidth * enemy.x;
        const enemyScreenY = window.innerHeight * enemy.y;
        
        const dx = enemyScreenX - mouseX;
        const dy = enemyScreenY - mouseY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if(distance < nearestDistance) {
            nearestDistance = distance;
            nearestEnemy = enemy;
        }
    });
    
    if(nearestEnemy && nearestDistance < 300) {
        // Aim lock berdasarkan strength
        const lockFactor = aimSettings.strength / 100;
        const targetScreenX = window.innerWidth * nearestEnemy.x;
        const targetScreenY = window.innerHeight * nearestEnemy.y;
        
        // Smooth aim lock
        targetX += (targetScreenX - targetX) * (aimSettings.speed / 20) * lockFactor;
        targetY += (targetScreenY - targetY) * (aimSettings.speed / 20) * lockFactor;
        
        // Update aim dot position
        aimDot.style.left = targetX + 'px';
        aimDot.style.top = targetY + 'px';
        
        // Headshot priority
        const hsChance = aimSettings.hsPriority / 100;
        if(Math.random() < hsChance && nearestDistance < 200) {
            hsIndicator.classList.add('active');
            setTimeout(() => {
                hsIndicator.classList.remove('active');
            }, 100);
        }
        
        // Update distance
        distanceIndicator.textContent = Math.round(nearestEnemy.distance) + 'm';
        distanceIndicator.style.left = targetX + 'px';
        distanceIndicator.style.top = (targetY + 30) + 'px';
    } else {
        // No enemy, follow mouse
        targetX = mouseX;
        targetY = mouseY;
        aimDot.style.left = mouseX + 'px';
        aimDot.style.top = mouseY + 'px';
        distanceIndicator.style.left = mouseX + 'px';
        distanceIndicator.style.top = (mouseY + 30) + 'px';
        distanceIndicator.textContent = '0m';
    }
}

// Update enemy indicators
function updateEnemyIndicators() {
    const container = document.getElementById('enemyIndicators');
    container.innerHTML = '';
    
    enemies.forEach(enemy => {
        const enemyScreenX = window.innerWidth * enemy.x;
        const enemyScreenY = window.innerHeight * enemy.y;
        
        // Only show if in range
        const dx = enemyScreenX - mouseX;
        const dy = enemyScreenY - mouseY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if(distance < radarSettings.range * 10) {
            const indicator = document.createElement('div');
            indicator.className = 'enemy-indicator';
            indicator.style.left = enemyScreenX + 'px';
            indicator.style.top = enemyScreenY + 'px';
            
            const distanceLabel = document.createElement('div');
            distanceLabel.className = 'enemy-indicator distance';
            distanceLabel.textContent = Math.round(enemy.distance) + 'm';
            indicator.appendChild(distanceLabel);
            
            container.appendChild(indicator);
        }
    });
}

// Update radar display
function updateRadarDisplay() {
    const canvas = document.getElementById('miniRadar');
    const ctx = canvas.getContext('2d');
    
    const size = radarSettings.size;
    canvas.width = size;
    canvas.height = size;
    
    // Clear radar
    ctx.clearRect(0, 0, size, size);
    
    // Draw radar circles
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    for(let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, (size/2) * (i/3), 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw cross lines
    ctx.beginPath();
    ctx.moveTo(size/2, 0);
    ctx.lineTo(size/2, size);
    ctx.moveTo(0, size/2);
    ctx.lineTo(size, size/2);
    ctx.stroke();
    
    // Draw enemies on radar
    ctx.globalAlpha = 1;
    enemies.forEach(enemy => {
        // Convert to radar coordinates
        const dx = (enemy.x - 0.5) * (radarSettings.range / 50);
        const dy = (enemy.y - 0.5) * (radarSettings.range / 50);
        
        const radarX = size/2 + (dx * size/2);
        const radarY = size/2 + (dy * size/2);
        
        // Only show if in range
        const distance = Math.sqrt(dx*dx + dy*dy) * 50;
        if(distance <= radarSettings.range) {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(radarX, radarY, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Distance label
            if(radarSettings.showDistance === 'yes') {
                ctx.fillStyle = '#ffffff';
                ctx.font = '8px Arial';
                ctx.fillText(Math.round(enemy.distance) + 'm', radarX + 10, radarY);
            }
        }
    });
    
    // Draw player (center)
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(size/2, size/2, 6, 0, Math.PI * 2);
    ctx.fill();
}

// Update movement guide
function updateMovementGuide() {
    const arrows = document.querySelectorAll('.move-arrow');
    
    // Simulasi movement berdasarkan mouse
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    
    arrows.forEach(arrow => arrow.classList.remove('active'));
    
    if(Math.abs(dx) > Math.abs(dy)) {
        if(dx > 50) document.querySelector('.move-arrow.right').classList.add('active');
        if(dx < -50) document.querySelector('.move-arrow.left').classList.add('active');
    } else {
        if(dy > 50) document.querySelector('.move-arrow.down').classList.add('active');
        if(dy < -50) document.querySelector('.move-arrow.up').classList.add('active');
    }
}

// Update recoil control
function updateRecoilControl() {
    const recoilBar = document.querySelector('.recoil-bar');
    
    // Simulasi recoil berdasarkan mouse movement
    const speed = Math.sqrt(
        Math.pow(mouseX - lastMouseX || 0, 2) + 
        Math.pow(mouseY - lastMouseY || 0, 2)
    );
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    const recoilAmount = Math.min(100, speed * 2);
    recoilBar.style.width = recoilAmount + '%';
}

// Update crosshair
function updateCrosshair() {
    const canvas = document.getElementById('dynamicCrosshair');
    const ctx = canvas.getContext('2d');
    
    // Get settings
    crosshairSettings.type = document.getElementById('crosshairType').value;
    crosshairSettings.color = document.getElementById('crosshairColor').value;
    crosshairSettings.size = parseInt(document.getElementById('crosshairSize').value);
    crosshairSettings.thickness = parseInt(document.getElementById('crosshairThickness').value);
    crosshairSettings.gap = parseInt(document.getElementById('crosshairGap').value);
    crosshairSettings.outline = document.getElementById('crosshairOutline').value;
    crosshairSettings.opacity = parseFloat(document.getElementById('crosshairOpacity').value);
    
    // Update display values
    document.getElementById('crosshairSizeValue').textContent = crosshairSettings.size;
    document.getElementById('crosshairThicknessValue').textContent = crosshairSettings.thickness;
    document.getElementById('crosshairGapValue').textContent = crosshairSettings.gap;
    document.getElementById('crosshairOpacityValue').textContent = Math.round(crosshairSettings.opacity * 100) + '%';
    
    // Clear canvas
    ctx.clearRect(0, 0, 200, 200);
    
    const centerX = 100;
    const centerY = 100;
    const size = crosshairSettings.size;
    const gap = crosshairSettings.gap;
    const thickness = crosshairSettings.thickness;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.globalAlpha = crosshairSettings.opacity;
    
    // Draw outline
    if(crosshairSettings.outline !== 'none') {
        ctx.strokeStyle = crosshairSettings.outline;
        ctx.lineWidth = thickness + 2;
        drawCrosshair(ctx, size, gap, true);
    }
    
    // Draw main crosshair
    ctx.strokeStyle = crosshairSettings.color;
    ctx.lineWidth = thickness;
    drawCrosshair(ctx, size, gap, false);
    
    ctx.restore();
    
    // Update preview
    updatePreview();
}

// Draw crosshair based on type
function drawCrosshair(ctx, size, gap, isOutline) {
    const type = crosshairSettings.type;
    
    ctx.beginPath();
    
    switch(type) {
        case 'default':
            // Plus sign
            ctx.moveTo(-size - gap, 0);
            ctx.lineTo(-gap, 0);
            ctx.moveTo(gap, 0);
            ctx.lineTo(size + gap, 0);
            ctx.moveTo(0, -size - gap);
            ctx.lineTo(0, -gap);
            ctx.moveTo(0, gap);
            ctx.lineTo(0, size + gap);
            break;
            
        case 'dot':
            // Just a dot
            ctx.arc(0, 0, size/4, 0, Math.PI * 2);
            ctx.fillStyle = isOutline ? crosshairSettings.outline : crosshairSettings.color;
            ctx.fill();
            return;
            
        case 'circle':
            // Circle with dot
            ctx.arc(0, 0, size/2, 0, Math.PI * 2);
            break;
            
        case 'cross':
            // X shape
            ctx.moveTo(-size - gap, -size - gap);
            ctx.lineTo(-gap, -gap);
            ctx.moveTo(gap, gap);
            ctx.lineTo(size + gap, size + gap);
            ctx.moveTo(-size - gap, size + gap);
            ctx.lineTo(-gap, gap);
            ctx.moveTo(gap, -gap);
            ctx.lineTo(size + gap, -size - gap);
            break;
            
        case 't':
            // T shape
            ctx.moveTo(-size/2, -size - gap);
            ctx.lineTo(size/2, -size - gap);
            ctx.moveTo(0, -size - gap);
            ctx.lineTo(0, 0);
            break;
            
        case 'arrow':
            // Arrow
            ctx.moveTo(0, -size - gap);
            ctx.lineTo(0, 0);
            ctx.moveTo(-size/2, -size/2);
            ctx.lineTo(0, -size - gap);
            ctx.lineTo(size/2, -size/2);
            break;
    }
    
    if(isOutline) {
        ctx.strokeStyle = crosshairSettings.outline;
        ctx.stroke();
    } else {
        ctx.strokeStyle = crosshairSettings.color;
        ctx.stroke();
    }
}

// Update aim settings
function updateAimSettings() {
    aimSettings.strength = parseInt(document.getElementById('aimStrength').value);
    aimSettings.hsPriority = parseInt(document.getElementById('hsPriority').value);
    aimSettings.speed = parseInt(document.getElementById('aimSpeed').value);
    aimSettings.prediction = document.getElementById('aimPrediction').value;
    
    // Update display values
    document.getElementById('aimStrengthValue').textContent = aimSettings.strength + '%';
    document.getElementById('hsPriorityValue').textContent = aimSettings.hsPriority + '%';
    document.getElementById('aimSpeedValue').textContent = aimSettings.speed + '/10';
    
    logToConsole(`Aim settings updated: ${aimSettings.strength}% strength`);
}

// Update radar settings
function updateRadar() {
    radarSettings.size = parseInt(document.getElementById('radarSize').value);
    radarSettings.position = document.getElementById('radarPosition').value;
    radarSettings.showDistance = document.getElementById('radarDistance').value;
    radarSettings.range = parseInt(document.getElementById('radarRange').value);
    
    // Update display
    document.getElementById('radarSizeValue').textContent = radarSettings.size;
    document.getElementById('radarRangeValue').textContent = radarSettings.range + 'm';
    
    // Update radar container
    const radar = document.getElementById('radarContainer');
    radar.className = 'radar-container ' + radarSettings.position;
    radar.style.width = radarSettings.size + 'px';
    radar.style.height = radarSettings.size + 'px';
    
    logToConsole(`Radar updated: ${radarSettings.position}`);
}

// Update preview
function updatePreview() {
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 150, 150);
    
    // Draw mini crosshair
    ctx.save();
    ctx.translate(75, 75);
    ctx.strokeStyle = crosshairSettings.color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-2, 0);
    ctx.moveTo(2, 0);
    ctx.lineTo(10, 0);
    ctx.moveTo(0, -10);
    ctx.lineTo(0, -2);
    ctx.moveTo(0, 2);
    ctx.lineTo(0, 10);
    ctx.stroke();
    
    ctx.restore();
}

// Update status indicator
function updateStatusIndicator() {
    const status = document.querySelector('.status-text');
    const activeCount = Object.values(overlayState).filter(v => v).length;
    
    if(activeCount === 0) {
        status.textContent = 'OVERLAY OFF';
        status.style.color = '#ff4444';
    } else {
        status.textContent = `AIM READY (${activeCount}/3)`;
        status.style.color = '#00ff88';
    }
}

// Quick HS Mode
function quickHSMode() {
    aimSettings.hsPriority = 100;
    aimSettings.strength = 95;
    
    document.getElementById('hsPriority').value = 100;
    document.getElementById('aimStrength').value = 95;
    
    document.getElementById('hsPriorityValue').textContent = '100%';
    document.getElementById('aimStrengthValue').textContent = '95%';
    
    logToConsole('QUICK HS MODE ACTIVATED - 100% headshot priority');
    showNotification('🔥 HEADSHOT MODE ACTIVE');
}

// Toggle all overlays
function toggleAllOverlays() {
    const anyActive = Object.values(overlayState).some(v => v);
    
    if(anyActive) {
        overlayState = { aim: false, crosshair: false, radar: false };
        logToConsole('All overlays hidden');
    } else {
        overlayState = { aim: true, crosshair: true, radar: true };
        logToConsole('All overlays shown');
    }
    
    // Update toggle buttons
    Object.keys(overlayState).forEach(key => {
        const btn = document.getElementById(key + 'Toggle');
        if(overlayState[key]) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateOverlayVisibility();
}

// Reset overlay position
function resetOverlayPosition() {
    const panel = document.getElementById('controlPanel');
    panel.style.left = '20px';
    panel.style.top = '20px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    
    logToConsole('Panel position reset');
}

// Apply settings
function applySettings() {
    updateAimSettings();
    updateCrosshair();
    updateRadar();
    showNotification('✅ Settings applied');
    logToConsole('All settings applied');
}

// Save profile
function saveProfile() {
    const profile = {
        aim: aimSettings,
        crosshair: crosshairSettings,
        radar: radarSettings,
        overlay: overlayState
    };
    
    localStorage.setItem('ffAimProfile', JSON.stringify(profile));
    showNotification('💾 Profile saved');
    logToConsole('Profile saved to local storage');
}

// Load profile
function loadProfile() {
    const saved = localStorage.getItem('ffAimProfile');
    if(saved) {
        const profile = JSON.parse(saved);
        
        aimSettings = profile.aim;
        crosshairSettings = profile.crosshair;
        radarSettings = profile.radar;
        overlayState = profile.overlay;
        
        // Update UI
        document.getElementById('aimStrength').value = aimSettings.strength;
        document.getElementById('hsPriority').value = aimSettings.hsPriority;
        document.getElementById('aimSpeed').value = aimSettings.speed;
        document.getElementById('aimPrediction').value = aimSettings.prediction;
        
        document.getElementById('crosshairType').value = crosshairSettings.type;
        document.getElementById('crosshairColor').value = crosshairSettings.color;
        document.getElementById('crosshairSize').value = crosshairSettings.size;
        document.getElementById('crosshairThickness').value = crosshairSettings.thickness;
        document.getElementById('crosshairGap').value = crosshairSettings.gap;
        document.getElementById('crosshairOutline').value = crosshairSettings.outline;
        document.getElementById('crosshairOpacity').value = crosshairSettings.opacity;
        
        document.getElementById('radarSize').value = radarSettings.size;
        document.getElementById('radarPosition').value = radarSettings.position;
        document.getElementById('radarDistance').value = radarSettings.showDistance;
        document.getElementById('radarRange').value = radarSettings.range;
        
        updateCrosshair();
        updateRadar();
        updateOverlayVisibility();
        
        showNotification('📂 Profile loaded');
        logToConsole('Profile loaded from storage');
    }
}

// Load settings from storage
function loadSettings() {
    loadProfile();
}

// Log to console
function logToConsole(message) {
    const console = document.getElementById('miniConsole');
    const timestamp = new Date().toLocaleTimeString();
    
    console.innerHTML = `[${timestamp}] ${message}<br>` + console.innerHTML;
    
    // Limit lines
    const lines = console.innerHTML.split('<br>');
    if(lines.length > 3) {
        lines.pop();
        console.innerHTML = lines.join('<br>');
    }
}

// Show notification
function showNotification(message) {
    const status = document.querySelector('.status-text');
    const originalText = status.textContent;
    
    status.textContent = message;
    status.style.color = '#ffff00';
    
    setTimeout(() => {
        status.textContent = originalText;
        status.style.color = '#00ff88';
    }, 2000);
}

// Add some test enemies (simulasi)
setInterval(() => {
    // Randomize enemy positions sedikit untuk simulasi
    enemies = enemies.map(enemy => ({
        x: Math.max(0.1, Math.min(0.9, enemy.x + (Math.random() - 0.5) * 0.02)),
        y: Math.max(0.1, Math.min(0.9, enemy.y + (Math.random() - 0.5) * 0.02)),
        distance: enemy.distance + (Math.random() - 0.5) * 5,
        health: enemy.health
    }));
}, 2000);

// Track last mouse position for recoil
let lastMouseX = 0, lastMouseY = 0;
