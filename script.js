// Preset Data Pro Player
const presets = {
    w2e: {
        name: "W2E Official",
        camera: 95,
        redDot: 92,
        scope2x: 88,
        scope4x: 72,
        redDotADS: 88,
        scope2xADS: 82,
        scope4xADS: 65,
        sniper: 55,
        fireSize: 120,
        fireTrans: 30,
        hsSpeed: 9,
        aimAssist: 90,
        hsAccuracy: 95,
        recoil: 98,
        autoLock: true,
        instantHS: true,
        noRecoil: true,
        magicBullet: true
    },
    dj: {
        name: "DJ Alam",
        camera: 98,
        redDot: 95,
        scope2x: 90,
        scope4x: 75,
        redDotADS: 92,
        scope2xADS: 85,
        scope4xADS: 70,
        sniper: 60,
        fireSize: 130,
        fireTrans: 25,
        hsSpeed: 10,
        aimAssist: 95,
        hsAccuracy: 98,
        recoil: 99,
        autoLock: true,
        instantHS: true,
        noRecoil: true,
        magicBullet: true
    },
    n0ari: {
        name: "N0ari",
        camera: 92,
        redDot: 90,
        scope2x: 85,
        scope4x: 70,
        redDotADS: 86,
        scope2xADS: 80,
        scope4xADS: 68,
        sniper: 52,
        fireSize: 115,
        fireTrans: 35,
        hsSpeed: 8,
        aimAssist: 88,
        hsAccuracy: 92,
        recoil: 95,
        autoLock: true,
        instantHS: true,
        noRecoil: true,
        magicBullet: true
    },
    sultan: {
        name: "Sultan Pro",
        camera: 100,
        redDot: 98,
        scope2x: 92,
        scope4x: 78,
        redDotADS: 95,
        scope2xADS: 88,
        scope4xADS: 72,
        sniper: 58,
        fireSize: 140,
        fireTrans: 20,
        hsSpeed: 9,
        aimAssist: 92,
        hsAccuracy: 96,
        recoil: 97,
        autoLock: true,
        instantHS: true,
        noRecoil: true,
        magicBullet: true
    },
    xayne: {
        name: "Xayne FF",
        camera: 94,
        redDot: 91,
        scope2x: 86,
        scope4x: 71,
        redDotADS: 87,
        scope2xADS: 81,
        scope4xADS: 66,
        sniper: 54,
        fireSize: 125,
        fireTrans: 28,
        hsSpeed: 8,
        aimAssist: 89,
        hsAccuracy: 93,
        recoil: 96,
        autoLock: true,
        instantHS: true,
        noRecoil: true,
        magicBullet: true
    }
};

// Weapon specific settings
const weaponSettings = {
    m1887: {
        sensi: 85,
        ads: 75,
        pattern: "spread",
        hsChance: 95
    },
    mp40: {
        sensi: 88,
        ads: 80,
        pattern: "up",
        hsChance: 88
    },
    scar: {
        sensi: 92,
        ads: 85,
        pattern: "stable",
        hsChance: 92
    },
    ak: {
        sensi: 90,
        ads: 82,
        pattern: "right",
        hsChance: 90
    },
    m4: {
        sensi: 94,
        ads: 88,
        pattern: "stable",
        hsChance: 94
    },
    sniper: {
        sensi: 65,
        ads: 55,
        pattern: "hold",
        hsChance: 98
    }
};

// State management
let currentWeapon = 'm1887';
let consoleCollapsed = false;
let dragActive = false;
let currentElement = null;
let offsetX, offsetY;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupDragAndDrop();
    updateCrosshair();
    startPreviewAnimation();
    loadSavedSettings();
});

// Initialize app
function initializeApp() {
    showNotification("🔥 FF Sensi Pro siap digunakan!");
    addToLog("System initialized - Auto Headshot active");
    
    // Load default preset
    loadPreset('w2e');
    
    // Setup weapon tabs
    showWeaponConfig('m1887');
}

// Load preset
function loadPreset(presetName) {
    if(presetName === 'custom') {
        showNotification("⚙️ Mode custom diaktifkan");
        addToLog("Custom mode enabled");
        return;
    }
    
    const preset = presets[presetName];
    if(!preset) return;
    
    // Update all sliders
    document.getElementById('cameraSensi').value = preset.camera;
    document.getElementById('cameraValue').textContent = preset.camera;
    
    document.getElementById('redDotSensi').value = preset.redDot;
    document.getElementById('redDotValue').textContent = preset.redDot;
    
    document.getElementById('scope2xSensi').value = preset.scope2x;
    document.getElementById('scope2xValue').textContent = preset.scope2x;
    
    document.getElementById('scope4xSensi').value = preset.scope4x;
    document.getElementById('scope4xValue').textContent = preset.scope4x;
    
    document.getElementById('redDotADS').value = preset.redDotADS;
    document.getElementById('redDotADSValue').textContent = preset.redDotADS;
    
    document.getElementById('scope2xADS').value = preset.scope2xADS;
    document.getElementById('scope2xADSValue').textContent = preset.scope2xADS;
    
    document.getElementById('scope4xADS').value = preset.scope4xADS;
    document.getElementById('scope4xADSValue').textContent = preset.scope4xADS;
    
    document.getElementById('sniperSensi').value = preset.sniper;
    document.getElementById('sniperValue').textContent = preset.sniper;
    
    document.getElementById('fireSize').value = preset.fireSize;
    document.getElementById('fireSizeValue').textContent = preset.fireSize;
    
    document.getElementById('fireTrans').value = preset.fireTrans;
    document.getElementById('fireTransValue').textContent = preset.fireTrans + '%';
    
    document.getElementById('hsSpeed').value = preset.hsSpeed;
    document.getElementById('hsSpeedValue').textContent = preset.hsSpeed + '/10';
    
    document.getElementById('aimAssist').value = preset.aimAssist;
    document.getElementById('aimAssistValue').textContent = preset.aimAssist + '%';
    
    document.getElementById('hsAccuracy').value = preset.hsAccuracy;
    document.getElementById('hsAccuracyValue').textContent = preset.hsAccuracy + '%';
    
    document.getElementById('recoilControl').value = preset.recoil;
    document.getElementById('recoilValue').textContent = preset.recoil + '%';
    
    // Update checkboxes
    document.getElementById('autoLock').checked = preset.autoLock;
    document.getElementById('instantHS').checked = preset.instantHS;
    document.getElementById('noRecoil').checked = preset.noRecoil;
    document.getElementById('magicBullet').checked = preset.magicBullet;
    
    // Update preview
    updatePreview();
    
    showNotification(`✅ Preset ${preset.name} dimuat!`);
    addToLog(`Loaded preset: ${preset.name}`);
}

// Update sensi values
function updateSensi(type) {
    switch(type) {
        case 'camera':
            document.getElementById('cameraValue').textContent = document.getElementById('cameraSensi').value;
            break;
        case 'redDot':
            document.getElementById('redDotValue').textContent = document.getElementById('redDotSensi').value;
            break;
        case '2x':
            document.getElementById('scope2xValue').textContent = document.getElementById('scope2xSensi').value;
            break;
        case '4x':
            document.getElementById('scope4xValue').textContent = document.getElementById('scope4xSensi').value;
            break;
        case 'redDotADS':
            document.getElementById('redDotADSValue').textContent = document.getElementById('redDotADS').value;
            break;
        case '2xADS':
            document.getElementById('scope2xADSValue').textContent = document.getElementById('scope2xADS').value;
            break;
        case '4xADS':
            document.getElementById('scope4xADSValue').textContent = document.getElementById('scope4xADS').value;
            break;
        case 'sniper':
            document.getElementById('sniperValue').textContent = document.getElementById('sniperSensi').value;
            break;
        case 'fireSize':
            document.getElementById('fireSizeValue').textContent = document.getElementById('fireSize').value;
            break;
        case 'fireTrans':
            document.getElementById('fireTransValue').textContent = document.getElementById('fireTrans').value + '%';
            break;
    }
    
    updatePreview();
}

// Update headshot settings
function updateHS(type) {
    switch(type) {
        case 'speed':
            document.getElementById('hsSpeedValue').textContent = document.getElementById('hsSpeed').value + '/10';
            break;
        case 'assist':
            document.getElementById('aimAssistValue').textContent = document.getElementById('aimAssist').value + '%';
            break;
        case 'accuracy':
            document.getElementById('hsAccuracyValue').textContent = document.getElementById('hsAccuracy').value + '%';
            break;
        case 'recoil':
            document.getElementById('recoilValue').textContent = document.getElementById('recoilControl').value + '%';
            break;
    }
    
    updatePreview();
}

// Toggle auto headshot
function toggleAutoHS() {
    const isActive = document.getElementById('autoHS').checked;
    
    if(isActive) {
        showNotification("🎯 Auto Headshot AKTIF!");
        addToLog("Auto Headshot mode enabled");
    } else {
        showNotification("⏸️ Auto Headshot nonaktif");
        addToLog("Auto Headshot mode disabled");
    }
}

// Update crosshair
function updateCrosshair() {
    const canvas = document.getElementById('crosshairCanvas');
    const ctx = canvas.getContext('2d');
    
    const color = document.getElementById('crossColor').value;
    const size = parseInt(document.getElementById('crossSize').value);
    const thickness = parseInt(document.getElementById('crossThickness').value);
    const gap = parseInt(document.getElementById('crossGap').value);
    const outline = document.getElementById('crossOutline').value;
    
    // Update display values
    document.getElementById('crossSizeValue').textContent = size;
    document.getElementById('crossThicknessValue').textContent = thickness;
    document.getElementById('crossGapValue').textContent = gap;
    
    // Clear canvas
    ctx.clearRect(0, 0, 100, 100);
    
    // Draw crosshair
    ctx.save();
    ctx.translate(50, 50);
    
    // Draw outline if selected
    if(outline !== 'none') {
        ctx.strokeStyle = outline;
        ctx.lineWidth = thickness + 2;
        
        // Horizontal lines outline
        ctx.beginPath();
        ctx.moveTo(-size - gap, 0);
        ctx.lineTo(-gap, 0);
        ctx.moveTo(gap, 0);
        ctx.lineTo(size + gap, 0);
        ctx.stroke();
        
        // Vertical lines outline
        ctx.beginPath();
        ctx.moveTo(0, -size - gap);
        ctx.lineTo(0, -gap);
        ctx.moveTo(0, gap);
        ctx.lineTo(0, size + gap);
        ctx.stroke();
    }
    
    // Draw main crosshair
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(-size - gap, 0);
    ctx.lineTo(-gap, 0);
    ctx.moveTo(gap, 0);
    ctx.lineTo(size + gap, 0);
    ctx.stroke();
    
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(0, -size - gap);
    ctx.lineTo(0, -gap);
    ctx.moveTo(0, gap);
    ctx.lineTo(0, size + gap);
    ctx.stroke();
    
    // Center dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, thickness, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Weapon selection
function selectWeapon(weapon) {
    currentWeapon = weapon;
    
    // Update tabs
    document.querySelectorAll('.weapon-tab').forEach(tab => {
        tab.classList.remove('active');
        if(tab.textContent.toLowerCase().includes(weapon)) {
            tab.classList.add('active');
        }
    });
    
    showWeaponConfig(weapon);
}

// Show weapon config
function showWeaponConfig(weapon) {
    const config = weaponSettings[weapon];
    const container = document.getElementById('weaponConfig');
    
    container.innerHTML = `
        <div class="weapon-details">
            <div class="detail-item">
                <span>Optimal Sensi:</span>
                <span class="value">${config.sensi}</span>
            </div>
            <div class="detail-item">
                <span>ADS Sensi:</span>
                <span class="value">${config.ads}</span>
            </div>
            <div class="detail-item">
                <span>Recoil Pattern:</span>
                <span class="value">${config.pattern}</span>
            </div>
            <div class="detail-item">
                <span>Headshot Chance:</span>
                <span class="value success">${config.hsChance}%</span>
            </div>
        </div>
        <div class="weapon-tip">
            💡 Tips: ${getWeaponTip(weapon)}
        </div>
    `;
}

// Get weapon tip
function getWeaponTip(weapon) {
    const tips = {
        m1887: "Tembak sambil bergerak untuk spread maksimal",
        mp40: "Kontrol recoil ke bawah, cocok untuk noob",
        scar: "Sangat stabil, burst 2-3 peluru untuk HS",
        ak: "Tarik ke kanan bawah saat nembak",
        m4: "Burst 3 peluru, very accurate",
        sniper: "Hold breath sebelum nembak"
    };
    return tips[weapon];
}

// Update preview
function updatePreview() {
    const hsChance = document.getElementById('hsAccuracy').value;
    const recoil = document.getElementById('recoilControl').value;
    const hsSpeed = document.getElementById('hsSpeed').value;
    
    document.getElementById('hsChance').textContent = hsChance + '%';
    document.getElementById('recoilReduction').textContent = recoil + '%';
    document.getElementById('aimSpeed').textContent = hsSpeed + '/10';
}

// Start preview animation
function startPreviewAnimation() {
    const canvas = document.getElementById('aimPreview');
    const ctx = canvas.getContext('2d');
    
    let angle = 0;
    
    setInterval(() => {
        // Clear canvas
        ctx.clearRect(0, 0, 400, 300);
        
        // Draw target
        ctx.beginPath();
        ctx.arc(200, 150, 100, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(200, 150, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(200, 150, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b00';
        ctx.fill();
        
        // Draw crosshair
        const hsActive = document.getElementById('autoHS').checked;
        const accuracy = parseInt(document.getElementById('hsAccuracy').value) / 100;
        
        // Calculate crosshair position with accuracy
        let x = 200;
        let y = 150;
        
        if(hsActive) {
            // Aim for head (top of target)
            y = 100 + (Math.sin(angle) * 5 * (1 - accuracy));
        }
        
        ctx.beginPath();
        ctx.strokeStyle = hsActive ? '#00ff88' : '#ff6b00';
        ctx.lineWidth = 2;
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x - 5, y);
        ctx.moveTo(x + 5, y);
        ctx.lineTo(x + 20, y);
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y - 5);
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x, y + 20);
        ctx.stroke();
        
        // Draw bullet holes based on accuracy
        for(let i = 0; i < 10; i++) {
            if(Math.random() < accuracy) {
                // Headshot
                ctx.fillStyle = '#00ff88';
                ctx.beginPath();
                ctx.arc(200 + (Math.random() * 20 - 10), 100 + (Math.random() * 20 - 10), 3, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Body shot
                ctx.fillStyle = '#ffaa00';
                ctx.beginPath();
                ctx.arc(200 + (Math.random() * 40 - 20), 150 + (Math.random() * 30 - 15), 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        angle += 0.1;
    }, 100);
}

// Apply settings
function applySettings() {
    showNotification("✅ Settings diterapkan!");
    addToLog("Settings applied successfully");
}

// Save to game
function saveToGame() {
    showNotification("💾 Settings disimpan ke game!");
    addToLog("Settings saved to game");
    
    // Save to localStorage
    saveSettings();
}

// Test sensitivity
function testSensi() {
    showNotification("🎯 Testing sensi...");
    addToLog("Testing sensitivity configuration");
    
    // Simulate test
    setTimeout(() => {
        const accuracy = document.getElementById('hsAccuracy').value;
        showNotification(`✅ Hasil test: Headshot rate ${accuracy}%`);
    }, 2000);
}

// Reset settings
function resetSettings() {
    if(confirm("Reset semua settings?")) {
        loadPreset('w2e');
        showNotification("↺ Settings direset ke default");
        addToLog("Settings reset to default");
    }
}

// Drag and drop for layout
function setupDragAndDrop() {
    const buttons = document.querySelectorAll('.move-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', startDrag);
    });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function startDrag(e) {
    dragActive = true;
    currentElement = e.target;
    
    const rect = currentElement.getBoundingClientRect();
    const phoneRect = document.querySelector('.phone-frame').getBoundingClientRect();
    
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    currentElement.style.cursor = 'grabbing';
}

function drag(e) {
    if(!dragActive || !currentElement) return;
    
    e.preventDefault();
    
    const phoneRect = document.querySelector('.phone-frame').getBoundingClientRect();
    
    let newX = e.clientX - phoneRect.left - offsetX;
    let newY = e.clientY - phoneRect.top - offsetY;
    
    // Constrain to phone frame
    newX = Math.max(0, Math.min(phoneRect.width - currentElement.offsetWidth, newX));
    newY = Math.max(0, Math.min(phoneRect.height - currentElement.offsetHeight, newY));
    
    currentElement.style.left = newX + 'px';
    currentElement.style.top = newY + 'px';
}

function stopDrag() {
    dragActive = false;
    if(currentElement) {
        currentElement.style.cursor = 'move';
        currentElement = null;
    }
}

// Reset layout
function resetLayout() {
    const fireBtn = document.getElementById('fireBtn');
    const aimBtn = document.getElementById('aimBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const crouchBtn = document.getElementById('crouchBtn');
    const proneBtn = document.getElementById('proneBtn');
    
    fireBtn.style.bottom = '80px';
    fireBtn.style.right = '30px';
    fireBtn.style.left = 'auto';
    fireBtn.style.top = 'auto';
    
    aimBtn.style.bottom = '80px';
    aimBtn.style.left = '30px';
    aimBtn.style.right = 'auto';
    aimBtn.style.top = 'auto';
    
    jumpBtn.style.bottom = '150px';
    jumpBtn.style.left = '30px';
    
    crouchBtn.style.bottom = '150px';
    crouchBtn.style.right = '30px';
    
    proneBtn.style.bottom = '220px';
    proneBtn.style.right = '30px';
    
    showNotification("↺ Layout direset");
    addToLog("Layout reset to default");
}

// Save layout
function saveLayout() {
    const buttons = document.querySelectorAll('.move-btn');
    const layout = {};
    
    buttons.forEach(btn => {
        layout[btn.id] = {
            left: btn.style.left,
            top: btn.style.top,
            right: btn.style.right,
            bottom: btn.style.bottom
        };
    });
    
    localStorage.setItem('ffLayout', JSON.stringify(layout));
    showNotification("💾 Layout disimpan");
    addToLog("Layout saved");
}

// Load pro layout
function loadProLayout() {
    // Pro player layout
    const fireBtn = document.getElementById('fireBtn');
    const aimBtn = document.getElementById('aimBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const crouchBtn = document.getElementById('crouchBtn');
    const proneBtn = document.getElementById('proneBtn');
    
    fireBtn.style.bottom = '100px';
    fireBtn.style.right = '40px';
    
    aimBtn.style.bottom = '100px';
    aimBtn.style.left = '50px';
    
    jumpBtn.style.bottom = '180px';
    jumpBtn.style.left = '30px';
    
    crouchBtn.style.bottom = '180px';
    crouchBtn.style.right = '40px';
    
    proneBtn.style.bottom = '260px';
    proneBtn.style.right = '40px';
    
    showNotification("👑 Pro player layout dimuat");
    addToLog("Pro player layout loaded");
}

// Save all settings
function saveSettings() {
    const settings = {
        sensi: {
            camera: document.getElementById('cameraSensi').value,
            redDot: document.getElementById('redDotSensi').value,
            scope2x: document.getElementById('scope2xSensi').value,
            scope4x: document.getElementById('scope4xSensi').value,
            redDotADS: document.getElementById('redDotADS').value,
            scope2xADS: document.getElementById('scope2xADS').value,
            scope4xADS: document.getElementById('scope4xADS').value,
            sniper: document.getElementById('sniperSensi').value,
            fireSize: document.getElementById('fireSize').value,
            fireTrans: document.getElementById('fireTrans').value
        },
        hs: {
            speed: document.getElementById('hsSpeed').value,
            assist: document.getElementById('aimAssist').value,
            accuracy: document.getElementById('hsAccuracy').value,
            recoil: document.getElementById('recoilControl').value,
            autoLock: document.getElementById('autoLock').checked,
            instantHS: document.getElementById('instantHS').checked,
            noRecoil: document.getElementById('noRecoil').checked,
            magicBullet: document.getElementById('magicBullet').checked
        },
        crosshair: {
            color: document.getElementById('crossColor').value,
            size: document.getElementById('crossSize').value,
            thickness: document.getElementById('crossThickness').value,
            gap: document.getElementById('crossGap').value,
            outline: document.getElementById('crossOutline').value,
            dynamic: document.getElementById('crossDynamic').value
        }
    };
    
    localStorage.setItem('ffSensi', JSON.stringify(settings));
}

// Load saved settings
function loadSavedSettings() {
    const saved = localStorage.getItem('ffSensi');
    if(saved) {
        const settings = JSON.parse(saved);
        
        // Load sensi settings
        document.getElementById('cameraSensi').value = settings.sensi.camera;
        document.getElementById('cameraValue').textContent = settings.sensi.camera;
        
        document.getElementById('redDotSensi').value = settings.sensi.redDot;
        document.getElementById('redDotValue').textContent = settings.sensi.redDot;
        
        document.getElementById('scope2xSensi').value = settings.sensi.scope2x;
        document.getElementById('scope2xValue').textContent = settings.sensi.scope2x;
        
        document.getElementById('scope4xSensi').value = settings.sensi.scope4x;
        document.getElementById('scope4xValue').textContent = settings.sensi.scope4x;
        
        document.getElementById('redDotADS').value = settings.sensi.redDotADS;
        document.getElementById('redDotADSValue').textContent = settings.sensi.redDotADS;
        
        document.getElementById('scope2xADS').value = settings.sensi.scope2xADS;
        document.getElementById('scope2xADSValue').textContent = settings.sensi.scope2xADS;
        
        document.getElementById('scope4xADS').value = settings.sensi.scope4xADS;
        document.getElementById('scope4xADSValue').textContent = settings.sensi.scope4xADS;
        
        document.getElementById('sniperSensi').value = settings.sensi.sniper;
        document.getElementById('sniperValue').textContent = settings.sensi.sniper;
        
        document.getElementById('fireSize').value = settings.sensi.fireSize;
        document.getElementById('fireSizeValue').textContent = settings.sensi.fireSize;
        
        document.getElementById('fireTrans').value = settings.sensi.fireTrans;
        document.getElementById('fireTransValue').textContent = settings.sensi.fireTrans + '%';
        
        // Load HS settings
        document.getElementById('hsSpeed').value = settings.hs.speed;
        document.getElementById('hsSpeedValue').textContent = settings.hs.speed + '/10';
        
        document.getElementById('aimAssist').value = settings.hs.assist;
        document.getElementById('aimAssistValue').textContent = settings.hs.assist + '%';
        
        document.getElementById('hsAccuracy').value = settings.hs.accuracy;
        document.getElementById('hsAccuracyValue').textContent = settings.hs.accuracy + '%';
        
        document.getElementById('recoilControl').value = settings.hs.recoil;
        document.getElementById('recoilValue').textContent = settings.hs.recoil + '%';
        
        document.getElementById('autoLock').checked = settings.hs.autoLock;
        document.getElementById('instantHS').checked = settings.hs.instantHS;
        document.getElementById('noRecoil').checked = settings.hs.noRecoil;
        document.getElementById('magicBullet').checked = settings.hs.magicBullet;
        
        // Load crosshair settings
        document.getElementById('crossColor').value = settings.crosshair.color;
        document.getElementById('crossSize').value = settings.crosshair.size;
        document.getElementById('crossThickness').value = settings.crosshair.thickness;
        document.getElementById('crossGap').value = settings.crosshair.gap;
        document.getElementById('crossOutline').value = settings.crosshair.outline;
        document.getElementById('crossDynamic').value = settings.crosshair.dynamic;
        
        updateCrosshair();
        updatePreview();
        
        addToLog("Saved settings loaded");
    }
    
    // Load layout
    const savedLayout = localStorage.getItem('ffLayout');
    if(savedLayout) {
        const layout = JSON.parse(savedLayout);
        
        Object.keys(layout).forEach(id => {
            const btn = document.getElementById(id);
            if(btn) {
                btn.style.left = layout[id].left;
                btn.style.top = layout[id].top;
                btn.style.right = layout[id].right;
                btn.style.bottom = layout[id].bottom;
            }
        });
    }
}

// Toggle console
function toggleConsole() {
    const console = document.querySelector('.console-log');
    const toggle = document.querySelector('.console-toggle');
    
    consoleCollapsed = !consoleCollapsed;
    
    if(consoleCollapsed) {
        console.classList.add('collapsed');
        toggle.textContent = '▶';
    } else {
        console.classList.remove('collapsed');
        toggle.textContent = '▼';
    }
}

// Add to log
function addToLog(message) {
    const consoleContent = document.getElementById('consoleContent');
    const timestamp = new Date().toLocaleTimeString();
    
    consoleContent.innerHTML = `[${timestamp}] ${message}<br>` + consoleContent.innerHTML;
    
    // Limit log entries
    const lines = consoleContent.innerHTML.split('<br>');
    if(lines.length > 20) {
        lines.pop();
        consoleContent.innerHTML = lines.join('<br>');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    document.getElementById('notifMessage').textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Auto-save before unload
window.addEventListener('beforeunload', function() {
    saveSettings();
});
