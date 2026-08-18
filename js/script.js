// ============================================
// INISIALISASI FIREBASE (WAJIB DIISI SESUAI PROJECT ANDA)
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyDKruG7E6hefEPUJrQxUc9_N5mBakPn8Ys",
    authDomain: "baut-49685.firebaseapp.com",
    databaseURL: "https://baut-49685-default-rtdb.firebaseio.com",
    projectId: "baut-49685",
    storageBucket: "baut-49685.appspot.com",
    messagingSenderId: "1082111487369",
    appId: "1:1082111487369:web:854b72fd5dc2782ad6c558"
};

// Pastikan inisialisasi hanya dipanggil sekali
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ============================================
// HASH PASSWORD (SHA-256 via SubtleCrypto)
// ============================================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_baut_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// SANITASI INPUT UNTUK MENCEGAH XSS
// ============================================
function sanitizeText(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// INJEKSI CSS PRINT FIX, STICKY HEADER & SPLIT SCREEN
// ============================================
if (!document.getElementById('print-fix-style-v15')) {
    const style = document.createElement('style');
    style.id = 'print-fix-style-v15';
    style.innerHTML = `
        @page { size: A4 portrait; margin: 0; }
        @page landscape_page { size: A4 landscape; margin: 0; }
        html { scroll-behavior: smooth; }
        @media print {
            html, body, main, section, #print-area, #dynamic-preview-container {
                display: block !important; height: auto !important; min-height: auto !important;
                overflow: visible !important; position: static !important; margin: 0 !important;
                padding: 0 !important; background-color: white !important;
            }
            .print-hide, aside, #form-tab, #editor-tab, #preview-header-wrapper, #toast-container, #login-screen, #custom-prompt-modal, #print-validation-modal, #admin-tab, #custom-confirm-modal, #status-check-modal, #history-tab, #dashboard-tab, .skip-print-page {
                display: none !important;
            }
            .preview-page-kertas:not(.skip-print-page) { display: block !important; }
            .paper-a4 {
                width: 210mm !important; height: 296.5mm !important; max-height: 296.5mm !important;
                margin: 0 !important; padding: 15mm !important; box-sizing: border-box !important;
                page-break-after: always !important; page-break-inside: avoid !important; break-after: page !important;
                overflow: hidden !important; border: none !important; box-shadow: none !important;
            }
            .paper-a4-landscape {
                page: landscape_page !important; width: 296.5mm !important; height: 209.5mm !important; max-height: 209.5mm !important;
                margin: 0 !important; padding: 15mm !important; box-sizing: border-box !important;
                page-break-after: always !important; page-break-inside: avoid !important; break-after: page !important;
                overflow: hidden !important; border: none !important; box-shadow: none !important;
            }
            .paper-a4-landscape img.max-h-full { max-height: 110mm !important; }
            .paper-a4 img.max-h-full { max-height: 190mm !important; }
        }
        /* --- CSS KHUSUS MODE SPLIT SCREEN (40/60) --- */
        body.split-active #main-scroller {
            display: flex !important; flex-direction: row !important; padding: 1.5rem !important; gap: 1.5rem !important; 
            overflow: hidden !important; align-items: flex-start !important; background-color: #fef2f2 !important; 
        }
        body.split-active #form-tab {
            display: block !important; width: 45% !important; min-width: 350px !important; max-width: 600px !important;
            margin: 0 !important; height: calc(100vh - 3rem) !important; overflow-y: auto !important; border-radius: 1rem !important; 
            border: 1px solid #fecaca !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            padding: 2rem !important; background-color: white !important;
        }
        body.split-active #report-tab {
            display: flex !important; flex-direction: column !important; width: 55% !important; flex: 1 !important;
            height: calc(100vh - 3rem) !important; overflow-y: auto !important; padding: 0 !important; 
            background-color: transparent !important; margin: 0 !important;
        }
        body.split-active #preview-header-wrapper {
            position: sticky !important; top: 0 !important; z-index: 50 !important; background-color: transparent !important;
            padding: 0 0 1.5rem 0 !important; margin: 0 !important; box-shadow: none !important;
        }
        body.split-active #preview-header {
            max-width: 100% !important; border-radius: 0.75rem !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            margin: 0 !important; border: 1px solid #fecaca !important; background-color: white !important;
        }
        body.split-active #print-area { flex: 1; display: flex; flex-direction: column; align-items: center; padding-bottom: 50vh !important; }
        body.split-active #editor-tab, body.split-active #history-tab, body.split-active #dashboard-tab { display: none !important; }

        body.split-active #form-tab::-webkit-scrollbar, body.split-active #report-tab::-webkit-scrollbar { width: 6px; }
        body.split-active #form-tab::-webkit-scrollbar-track, body.split-active #report-tab::-webkit-scrollbar-track { background: transparent; margin: 1rem 0; }
        body.split-active #form-tab::-webkit-scrollbar-thumb, body.split-active #report-tab::-webkit-scrollbar-thumb { background: #fca5a5; border-radius: 10px; }
        body.split-active #form-tab::-webkit-scrollbar-thumb:hover, body.split-active #report-tab::-webkit-scrollbar-thumb:hover { background: #ef4444; }
    `;
    document.head.appendChild(style);
}

// ============================================
// FUNGSI CLEAR FILE INPUT & PREVIEW
// ============================================
window.clearFileAndPreview = function(inputId, targetStr, type = 'normal', hideTextId = null) {
    const input = document.getElementById(inputId);
    if(input) {
        input.value = ''; // Hapus file dari memori input
        const clearBtn = document.getElementById('btn-clear-' + inputId);
        if(clearBtn) clearBtn.classList.add('hidden'); // Sembunyikan tombol 'X'
        
        if(type === 'logo') {
            document.querySelectorAll('.' + targetStr).forEach(img => {
                if(targetStr === 'out-logo-kiri') img.src = URL_LOGO_KIRI;
                if(targetStr === 'out-logo-kanan') img.src = URL_LOGO_KANAN;
            });
        } else if (type === 'class') {
            document.querySelectorAll('.' + targetStr).forEach(img => {
                img.src = '';
                img.classList.add('hidden');
            });
            let txtClass = targetStr.replace('img-', 'txt-');
            document.querySelectorAll('.' + txtClass).forEach(txt => txt.style.display = 'inline');
            
            if(inputId === 'inp-paraf-tif') window.globalParafTif = null; 
            if(inputId === 'inp-paraf-ta') window.globalParafTa = null; 
        } else {
            const outEl = document.getElementById(targetStr);
            if(outEl) {
                outEl.src = '';
                outEl.classList.add('hidden');
                let textId = hideTextId || input.getAttribute('data-hidetext');
                if(textId) {
                    const txtEl = document.getElementById(textId);
                    if(txtEl) txtEl.style.display = 'inline';
                } else {
                    const parent = outEl.parentElement;
                    if(parent && parent.querySelector('span')) parent.querySelector('span').style.display = 'inline';
                }
            }
        }
        updateReport();
        showCustomToast("File lampiran telah dihapus.", false);
    }
};

// ============================================
// FITUR: AUTO REMOVE WHITE BACKGROUND DENGAN AMAN
// Hanya digunakan untuk TTD, PARAF, dan LOGO agar tabel/foto aslinya tidak rusak.
// ============================================
function removeWhiteBackground(imageSrc, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;
            const tolerance = 200;

            const stack = [];
            const visited = new Uint8Array(width * height);

            function checkAndPush(x, y) {
                if (x < 0 || x >= width || y < 0 || y >= height) return;
                const idx = y * width + x;
                if (visited[idx]) return;
                
                const dIdx = idx * 4;
                if (data[dIdx] > tolerance && data[dIdx + 1] > tolerance && data[dIdx + 2] > tolerance && data[dIdx + 3] > 0) {
                    visited[idx] = 1;
                    stack.push(idx);
                }
            }

            for (let x = 0; x < width; x++) { checkAndPush(x, 0); checkAndPush(x, height - 1); }
            for (let y = 0; y < height; y++) { checkAndPush(0, y); checkAndPush(width - 1, y); }

            while (stack.length > 0) {
                const pIdx = stack.pop();
                const dIdx = pIdx * 4;
                
                data[dIdx + 3] = 0;

                const x = pIdx % width;
                const y = Math.floor(pIdx / width);

                checkAndPush(x - 1, y);
                checkAndPush(x + 1, y);
                checkAndPush(x, y - 1);
                checkAndPush(x, y + 1);
            }

            ctx.putImageData(imageData, 0, 0);
            callback(canvas.toDataURL('image/png'));
        } catch (e) {
            console.error("Canvas CORS/Memory Error, fallback to original image:", e);
            callback(imageSrc);
        }
    };
    img.onerror = function() { callback(imageSrc); };
    img.src = imageSrc;
}

// ============================================
// PENGATURAN LOGO, VARIABEL GLOBAL & EDIT JUDUL
// ============================================
const URL_LOGO_KIRI = 'assets/image/infra.jpg'; 
const URL_LOGO_KANAN = 'assets/image/telkom.jpg'; 

window.customTitles = JSON.parse(localStorage.getItem('bautPro_custom_titles')) || {};
window.saveCustomTitle = function(id, val) {
    window.customTitles[id] = val;
    localStorage.setItem('bautPro_custom_titles', JSON.stringify(window.customTitles));
};

function setGlobalLogos() {
    const fallbackLogo = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"%3E%3Crect width="200" height="80" fill="%23fdf2f8"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%23db2777" text-anchor="middle" dy=".3em"%3ELOGO%3C/text%3E%3C/svg%3E';
    
    document.querySelectorAll('.out-logo-kiri').forEach(img => { 
        let currentSrc = img.getAttribute('src');
        if (!currentSrc || currentSrc === '') { 
            img.onerror = () => { img.onerror = null; img.src = fallbackLogo; }; 
            img.src = URL_LOGO_KIRI; 
        } 
        img.classList.remove('hidden'); 
    });
    
    document.querySelectorAll('.out-logo-kanan').forEach(img => { 
        let currentSrc = img.getAttribute('src');
        if (!currentSrc || currentSrc === '') { 
            img.onerror = () => { img.onerror = null; img.src = fallbackLogo; }; 
            img.src = URL_LOGO_KANAN; 
        } 
        img.classList.remove('hidden'); 
    });
}

function applyGlobalParaf() {
    if(window.globalParafTif) { document.querySelectorAll('.img-paraf-kiri').forEach(img => { img.src = window.globalParafTif; img.classList.remove('hidden'); }); document.querySelectorAll('.txt-paraf-kiri').forEach(txt => txt.style.display = 'none'); }
    if(window.globalParafTa) { document.querySelectorAll('.img-paraf-kanan').forEach(img => { img.src = window.globalParafTa; img.classList.remove('hidden'); }); document.querySelectorAll('.txt-paraf-kanan').forEach(txt => txt.style.display = 'none'); }
}

window.isAbdEdited = false; window.isUt1Edited = false; window.isTkpEdited = false;
window.globalParafTif = null; window.globalParafTa = null; window.previewObserver = null;
window.pageOrder = []; window.pageConfigs = {};
let emptyPagesToSkip = []; // Array untuk menampung ID halaman yang belum lengkap
window.currentLoadedHistoryId = null; // TAMBAHAN: Untuk melacak ID dokumen yang sedang dibuka
window.currentLoadedHistoryName = null; // TAMBAHAN: Untuk melacak nama dokumen yang sedang dibuka

const PAGE_TITLES = {
    1: 'Cover', 2: 'Daftar Isi', 3: 'BAK TKP', 4: 'UT-1', 5: 'BOQ',
    6: 'Eviden 1 (Hal 6)', 7: 'OPM Utama', 8: 'OPM Lanjut 1', 9: 'OPM Lanjut 2',
    10: 'OPM Lanjut 3', 11: 'OPM Lanjut 4', 12: 'Eviden 2', 13: 'Eviden 3',
    14: 'Eviden 4', 15: 'Eviden 5', 16: 'Eviden 6', 17: 'Eviden 7',
    18: 'Eviden 8', 19: 'Eviden 9', 20: 'Eviden 10', 21: 'Eviden 11',
    22: 'OTDR 1', 23: 'OTDR 2', 24: 'OTDR 3', 25: 'OTDR 4', 26: 'OTDR 5',
    27: 'ABD', 28: 'KML', 29: 'MANCORE'
};

for(let i=1; i<=29; i++) {
    window.pageOrder.push(i.toString());
    window.pageConfigs[i.toString()] = { title: PAGE_TITLES[i], isDup: false };
}

// ============================================
// LOGIKA CUSTOM CONFIRM MODAL (BUG FIX DUPLIKAT)
// ============================================
let currentConfirmCallback = null;

function showCustomConfirm(title, message, callback) {
    document.getElementById('confirm-title').innerHTML = title;
    document.getElementById('confirm-message').innerHTML = message;
    currentConfirmCallback = callback;
    
    const modal = document.getElementById('custom-confirm-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // Kita clone tombolnya untuk mereset semua event listener bawaan dari modal sebelumnya
    const btnConfirm = document.getElementById('btn-confirm-action');
    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    newBtn.id = 'btn-confirm-action';
    
    newBtn.addEventListener('click', () => {
        let shouldClose = true;
        if (currentConfirmCallback) {
            if (currentConfirmCallback() === false) {
                shouldClose = false;
            }
        }
        if (shouldClose) closeCustomConfirm();
    });
}

function closeCustomConfirm() {
    const modal = document.getElementById('custom-confirm-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
    currentConfirmCallback = null;
}

// ============================================
// LOGIKA CEK STATUS AKUN DENGAN FIREBASE
// ============================================
function openStatusCheckModal() {
    document.getElementById('check-status-email').value = '';
    document.getElementById('status-result-area').classList.add('hidden');
    const modal = document.getElementById('status-check-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeStatusCheckModal() {
    const modal = document.getElementById('status-check-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function executeCheckStatus() {
    const email = document.getElementById('check-status-email').value.trim();
    const resultArea = document.getElementById('status-result-area');
    const badgeResult = document.getElementById('status-badge-result');

    if (!email) { showCustomToast("Silakan masukkan email terlebih dahulu!", true); return; }
    const emailKey = email.replace(/\./g, ',');

    resultArea.classList.remove('hidden');
    badgeResult.className = "inline-block px-4 py-2 rounded-lg font-bold text-sm bg-red-100 text-red-800";
    badgeResult.innerHTML = "Mencari...";

    db.ref('users/' + emailKey).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const existingUser = snapshot.val();
            if (existingUser.status === 'pending') {
                badgeResult.className = "inline-block px-4 py-2 rounded-lg font-bold text-sm bg-orange-100 text-orange-800 border border-orange-300";
                badgeResult.innerHTML = "⏳ Menunggu Persetujuan Admin";
            } else if (existingUser.status === 'approved') {
                badgeResult.className = "inline-block px-4 py-2 rounded-lg font-bold text-sm bg-orange-100 text-orange-800 border border-orange-300";
                badgeResult.innerHTML = "✅ Diterima (Silakan Login)";
            } else if (existingUser.status === 'rejected') {
                badgeResult.className = "inline-block px-4 py-2 rounded-lg font-bold text-sm bg-red-100 text-red-800 border border-red-300";
                badgeResult.innerHTML = "❌ Ditolak oleh Admin";
            }
        } else {
            badgeResult.className = "inline-block px-4 py-2 rounded-lg font-bold text-sm bg-red-100 text-red-800 border border-red-300";
            badgeResult.innerHTML = "🔍 Email Belum Terdaftar";
        }
    }).catch(err => {
        showCustomToast("Gagal terhubung ke server Firebase.", true);
    });
}

// ============================================
// LOGIKA AUTENTIKASI (LOGIN & ADMIN DASHBOARD)
// ============================================
const _0xa3f=['\x61\x79\x61\x78\x67\x75\x6e\x73\x70\x65\x72\x6d\x40\x67\x6d\x61\x69\x6c\x2e\x63\x6f\x6d','\x54\x65\x6c\x6b\x6f\x6d\x31\x32\x33\x5f'];
const ADMIN_EMAIL = _0xa3f[0];
const ADMIN_PASS = _0xa3f[1];

function switchLoginPortal(type) {
    const btnUser = document.getElementById('btn-tab-user');
    const btnAdmin = document.getElementById('btn-tab-admin');
    const formUser = document.getElementById('form-portal-user');
    const formAdmin = document.getElementById('form-portal-admin');

    if (type === 'user') {
        btnUser.className = "flex-1 py-2.5 rounded-full font-bold text-sm bg-[#e62a2a] text-white shadow-md transition-all";
        btnAdmin.className = "flex-1 py-2.5 rounded-full font-bold text-sm text-red-400 hover:text-white transition-all";
        formUser.classList.remove('hidden'); formUser.classList.add('block');
        formAdmin.classList.add('hidden'); formAdmin.classList.remove('block');
    } else {
        btnAdmin.className = "flex-1 py-2.5 rounded-full font-bold text-sm bg-[#e62a2a] text-white shadow-md transition-all";
        btnUser.className = "flex-1 py-2.5 rounded-full font-bold text-sm text-red-400 hover:text-white transition-all";
        formAdmin.classList.remove('hidden'); formAdmin.classList.add('block');
        formUser.classList.add('hidden'); formUser.classList.remove('block');
    }
}

function togglePassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
    } else {
        passInput.type = 'password';
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />`;
    }
}

async function handleLoginUser() {
    const email = document.getElementById('user-email').value.trim();
    const pass = document.getElementById('user-password').value.trim();
    if (!email || !pass) { showCustomToast("Email dan Password User wajib diisi!", true); return; }
    if (!email.toLowerCase().endsWith('@gmail.com')) { showCustomToast("Akses Ditolak! Harus menggunakan email @gmail.com", true); return; }

    const emailKey = email.replace(/\./g, ',');
    showCustomToast("Menghubungkan ke server Firebase...", false);

    const hashedPass = await hashPassword(pass);

    db.ref('users/' + emailKey).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const existingUser = snapshot.val();
            const isHashed = existingUser.password && existingUser.password.length === 64 && /^[0-9a-f]+$/.test(existingUser.password);
            const passMatch = isHashed ? (existingUser.password === hashedPass) : (existingUser.password === pass);
            if (!passMatch) { showCustomToast("Password salah!", true); return; }
            if (existingUser.status === 'pending') { showCustomToast("Akun kamu masih menunggu persetujuan Admin!", true); return; }
            if (existingUser.status === 'rejected') { showCustomToast("Maaf, akses kamu ditolak oleh Admin.", true); return; }
            if (!isHashed) { db.ref('users/' + emailKey + '/password').set(hashedPass); }
            startAppAsUser(email);
            showCustomToast("Welcome back! " + email, false);
        } else {
            db.ref('users/' + emailKey).set({ email: email, password: hashedPass, status: 'pending' }).then(() => {
                showCustomToast("Akun didaftarkan! Menunggu persetujuan Admin.", false);
                document.getElementById('user-password').value = '';
            }).catch(err => {
                showCustomToast("Gagal mendaftar! Akses Firebase Ditolak.", true);
            });
        }
    }).catch(err => {
        showCustomToast("Gagal terhubung! Cek Config / Rules Firebase kamu.", true);
    });
}

function handleLoginAdmin() {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-password').value.trim();
    if (!email || !pass) { showCustomToast("Email dan Password Admin wajib diisi!", true); return; }
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        startAppAsAdmin(); showCustomToast("Otorisasi Admin Berhasil!", false);
    } else {
        showCustomToast("Kredensial Admin Salah!", true);
    }
}

function startAppAsUser(email) {
    localStorage.setItem('bautPro_session', JSON.stringify({ role: 'user', email: email, timestamp: Date.now() }));
    const splash = document.getElementById('login-screen');
    splash.classList.add('opacity-0');
    document.getElementById('nav-admin').classList.add('hidden');
    setTimeout(() => { splash.classList.add('hidden'); switchTab('dashboard-tab'); switchForm('1'); }, 500);
}

function startAppAsAdmin() {
    localStorage.setItem('bautPro_session', JSON.stringify({ role: 'admin', email: ADMIN_EMAIL, timestamp: Date.now() }));
    const splash = document.getElementById('login-screen');
    splash.classList.add('opacity-0');
    document.getElementById('nav-admin').classList.remove('hidden');
    setTimeout(() => { splash.classList.add('hidden'); switchTab('dashboard-tab'); renderAdminDashboard(); }, 500);
}

// LOGOUT DENGAN RESET DATA FORM (MENGEMBALIKAN KE TEMPLATE SEMULA)
function logoutUser() {
    showCustomConfirm("Logout Akun", "Apakah kamu yakin ingin keluar? Semua data form yang belum disimpan akan di-reset ke template awal.", () => { 
        const keys = Object.keys(localStorage);
        keys.forEach(key => { 
            // Hapus semua data ketikan form agar kembali bersih
            if (key.startsWith('bautPro_') && key !== 'bautPro_session') {
                localStorage.removeItem(key); 
            }
        });
        localStorage.removeItem('bautPro_session'); 
        window.currentLoadedHistoryId = null;
        window.currentLoadedHistoryName = null;
        location.reload(); 
    });
}

function logoutAdmin() {
    showCustomConfirm("Logout Admin", "Keluar dari Admin Dashboard sekarang?", () => { 
        localStorage.removeItem('bautPro_session'); 
        location.reload(); 
    });
}

function restoreSession() {
    const sessionData = localStorage.getItem('bautPro_session');
    if (!sessionData) return false;
    try {
        const session = JSON.parse(sessionData);
        const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - session.timestamp > SESSION_MAX_AGE) {
            localStorage.removeItem('bautPro_session');
            return false;
        }
        if (session.role === 'admin') {
            startAppAsAdmin();
            return true;
        } else if (session.role === 'user' && session.email) {
            const emailKey = session.email.replace(/\./g, ',');
            db.ref('users/' + emailKey).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.status === 'approved') {
                        startAppAsUser(session.email);
                        showCustomToast("Selamat datang kembali, " + session.email, false);
                    } else {
                        localStorage.removeItem('bautPro_session');
                        showCustomToast("Status akun Anda telah berubah. Silakan login ulang.", true);
                    }
                } else {
                    localStorage.removeItem('bautPro_session');
                }
            }).catch(() => {
                startAppAsUser(session.email);
                showCustomToast("Mode offline: " + session.email, false);
            });
            return true;
        }
    } catch (e) {
        localStorage.removeItem('bautPro_session');
    }
    return false;
}

// FITUR PERBAIKAN: HAPUS FORM TANPA LOGOUT
function confirmResetData() {
    showCustomConfirm("Hapus Semua Data Form", "Yakin ingin mereset seluruh isian form? Data form saat ini akan dikosongkan ke template awal.", () => {
        const keys = Object.keys(localStorage);
        keys.forEach(key => { 
            // PERBAIKAN: Kecualikan 'bautPro_session' agar akun tetap login saat mereset
            if (key.startsWith('bautPro_') && key !== 'bautPro_session' && key !== 'bautPro_custom_titles') {
                localStorage.removeItem(key); 
            }
        });
        window.currentLoadedHistoryId = null; 
        window.currentLoadedHistoryName = null;
        location.reload();
    });
}

function renderAdminDashboard() {
    const listContainer = document.getElementById('admin-user-list');
    db.ref('users').on('value', (snapshot) => {
        listContainer.innerHTML = '';
        if (!snapshot.exists()) {
            listContainer.innerHTML = `<tr><td colspan="4" class="p-4 text-center italic text-red-400">Belum ada user yang mendaftar.</td></tr>`;
            return;
        }
        snapshot.forEach((childSnapshot) => {
            let u = childSnapshot.val();
            let emailKey = childSnapshot.key;
            let statusBadge = ''; let actionButtons = '';

            if (u.status === 'pending') {
                statusBadge = `<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">Menunggu</span>`;
                actionButtons = `<button onclick="updateUserStatus('${emailKey}', 'approved')" class="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 shadow mr-1">Terima</button>
                                 <button onclick="updateUserStatus('${emailKey}', 'rejected')" class="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 shadow mr-1">Tolak</button>`;
            } else if (u.status === 'approved') {
                statusBadge = `<span class="bg-orange-200 text-orange-900 px-2 py-1 rounded text-xs font-bold border border-orange-300">Diterima</span>`;
                actionButtons = `<button onclick="updateUserStatus('${emailKey}', 'rejected')" class="bg-red-100 text-red-600 border border-red-300 px-3 py-1 rounded text-xs font-bold hover:bg-red-200 mr-1">Cabut Akses</button>`;
            } else {
                statusBadge = `<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Ditolak</span>`;
                actionButtons = `<button onclick="updateUserStatus('${emailKey}', 'approved')" class="bg-orange-100 text-orange-700 border border-orange-300 px-3 py-1 rounded text-xs font-bold hover:bg-orange-200 mr-1">Buka Akses</button>`;
            }

            // Tambahkan tombol Hapus
            actionButtons += `<button onclick="deleteUser('${emailKey}')" class="bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-900 shadow transition" title="Hapus Permanen">Hapus</button>`;

            listContainer.innerHTML += `
                <tr class="border-b border-red-200 hover:bg-red-100 transition">
                    <td class="p-3 font-medium">${sanitizeText(u.email)}</td>
                    <td class="p-3 text-red-500">••••••••</td>
                    <td class="p-3 text-center">${statusBadge}</td>
                    <td class="p-3 text-center whitespace-nowrap">${actionButtons}</td>
                </tr>`;
        });
    });
}

function updateUserStatus(emailKey, newStatus) {
    db.ref('users/' + emailKey).update({ status: newStatus }).then(() => { showCustomToast(`Status user berhasil diubah menjadi: ${newStatus}`, false); }).catch(err => { showCustomToast("Gagal mengubah status.", true); });
}

function deleteUser(emailKey) {
    showCustomConfirm("Hapus Akun Permanen", "Apakah Anda yakin ingin menghapus akun ini? Data akun akan hilang permanen dari database.", () => {
        db.ref('users/' + emailKey).remove()
            .then(() => {
                showCustomToast("Akun berhasil dihapus dari database.", false);
            })
            .catch(err => {
                showCustomToast("Gagal menghapus akun.", true);
            });
    });
}

function showCustomToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 transform translate-x-full backdrop-blur-sm ${isError ? 'bg-red-600' : 'bg-gray-900'}`;
    
    const icon = isError 
        ? '<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>'
        : '<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    
    toast.innerHTML = `<div class="flex items-center gap-3">${icon}<span>${message}</span></div>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
    setTimeout(() => { toast.classList.add('opacity-0', 'translate-x-full'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ============================================
// LOGIKA SINKRONISASI TOMBOL NAVIGASI & SCROLL
// ============================================
function setActiveFormBtn(page) {
    document.querySelectorAll('[id^="btn-form-"]').forEach(btn => { 
        btn.className = "flex-shrink-0 py-2 px-3.5 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium transition text-xs sm:text-sm"; 
    });
    const activeBtn = document.getElementById('btn-form-' + page);
    if (activeBtn) { 
        activeBtn.className = "flex-shrink-0 py-2 px-3.5 bg-primary-600 text-white rounded-lg shadow-sm font-medium transition text-xs sm:text-sm"; 
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); 
    }
}

function setActivePrevBtn(page) {
    document.querySelectorAll('#preview-nav-container button').forEach(btn => {
        if(btn.id === 'btn-prev-all') { 
            btn.className = "flex-shrink-0 px-3 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition text-xs sm:text-sm sticky left-0 z-10"; 
        } else { 
            btn.className = "flex-shrink-0 px-3 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition text-xs sm:text-sm"; 
        }
    });

    if (page === 'all') {
        const allBtn = document.getElementById('btn-prev-all');
        if (allBtn) { allBtn.className = "flex-shrink-0 px-3 py-2 bg-primary-600 text-white rounded-lg font-medium transition text-xs sm:text-sm shadow-sm sticky left-0 z-10"; }
        return;
    }

    const activeBtn = document.getElementById('btn-prev-' + page);
    if (activeBtn) {
        activeBtn.className = "flex-shrink-0 px-3 py-2 bg-primary-600 text-white rounded-lg shadow-sm font-medium transition text-xs sm:text-sm";
        if (document.body.classList.contains('split-active') || !document.getElementById('report-tab').classList.contains('hidden')) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
}

function scrollToPreviewPage(pageId) {
    const scroller = document.body.classList.contains('split-active') ? document.getElementById('report-tab') : document.getElementById('main-scroller');
    const target = document.getElementById('preview-page-' + pageId);
    const header = document.getElementById('preview-header-wrapper');
    if(scroller && target) {
        const offset = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + scroller.scrollTop - scroller.getBoundingClientRect().top - offset - 10;
        scroller.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
}

// ============================================
// LOGIKA TOGGLE SPLIT SCREEN MODE
// ============================================
function toggleSplitScreen() {
    const body = document.body; body.classList.toggle('split-active');
    const splitBtn = document.getElementById('btn-split-screen');
    
    if (body.classList.contains('split-active')) {
        document.getElementById('form-tab').classList.remove('hidden'); 
        document.getElementById('report-tab').classList.remove('hidden');
        ['admin-tab', 'history-tab', 'dashboard-tab'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });
        
        document.querySelectorAll('aside nav button').forEach(btn => {
            if (btn.id !== 'btn-split-screen' && btn.id !== 'btn-reset-data') { 
                btn.classList.remove('bg-primary-50', 'text-primary-700'); 
                btn.classList.add('text-gray-600'); 
            }
        });
        
        if (splitBtn) { 
            splitBtn.classList.remove('text-gray-600', 'hover:bg-gray-50'); 
            splitBtn.classList.add('bg-gray-900', 'text-white', 'shadow-inner'); 
            splitBtn.innerHTML = `<span class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Tutup Split
            </span>`;
        }
        
        const activeFormPage = document.querySelector('.form-page-content:not(.hidden)');
        let currentPage = '1'; if (activeFormPage) { currentPage = activeFormPage.id.replace('form-page-', ''); }
        switchPreview(currentPage, true);
        showCustomToast("Mode Split Screen Aktif!", false);
    } else {
        if (splitBtn) { 
            splitBtn.classList.remove('bg-gray-900', 'text-white', 'shadow-inner'); 
            splitBtn.classList.add('text-gray-600', 'hover:bg-gray-50'); 
            splitBtn.innerHTML = `<span class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
                Split Screen
            </span>`;
        }
        switchTab('form-tab'); 
        showCustomToast("Kembali ke Mode Normal", false);
    }
}

function switchTab(tabId) {
    const body = document.body;
    if(body.classList.contains('split-active')) {
        body.classList.remove('split-active'); 
        const splitBtn = document.getElementById('btn-split-screen');
        if(splitBtn) { 
            splitBtn.classList.remove('bg-gray-900', 'text-white', 'shadow-inner'); 
            splitBtn.classList.add('text-gray-600', 'hover:bg-gray-50'); 
            splitBtn.innerHTML = `<span class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
                Split Screen
            </span>`;
        }
    }

    ['form-tab', 'report-tab', 'admin-tab', 'history-tab', 'dashboard-tab'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    const targetEl = document.getElementById(tabId);
    if(targetEl) targetEl.classList.remove('hidden');
    
    document.querySelectorAll('aside nav button').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (btn.id !== 'btn-split-screen' && btn.id !== 'btn-reset-data' && !onclickAttr.includes('logoutUser') && !onclickAttr.includes('logoutAdmin')) {
            btn.classList.remove('bg-primary-50', 'text-primary-700'); 
            btn.classList.add('text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900');
        }
    });
    
    const activeBtn = Array.from(document.querySelectorAll('aside nav button')).find(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        return onclickAttr.includes(tabId) && !onclickAttr.includes('logoutUser') && !onclickAttr.includes('logoutAdmin');
    });
    
    if(activeBtn) { 
        activeBtn.classList.add('bg-primary-50', 'text-primary-700'); 
        activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900'); 
    }

    if(tabId === 'report-tab') {
        document.querySelectorAll('.preview-page-kertas').forEach(el => { el.classList.remove('hidden'); el.style.display = 'block'; });
        setActivePrevBtn('all'); initScrollSpy();
        const scroller = document.getElementById('main-scroller'); if(scroller) scroller.scrollTo({ top: 0, behavior: "instant" });
    }
    if(tabId === 'history-tab') { renderHistoryTab(); }
    if(tabId === 'dashboard-tab') { renderDashboard(); }
}

function switchForm(page) {
    try {
        page = page.toString(); document.querySelectorAll('.form-page-content').forEach(el => el.classList.add('hidden'));
        const activePage = document.getElementById('form-page-' + page); if (activePage) activePage.classList.remove('hidden');
        setActiveFormBtn(page); updateBottomNav(page);
        if (document.body.classList.contains('split-active')) { switchPreview(page, true); }
    } catch(e) { console.error("Gagal berpindah tab form:", e); }
}

function switchPreview(page, fromForm = false) {
    try {
        page = page.toString(); const isSplit = document.body.classList.contains('split-active');
        const scroller = isSplit ? document.getElementById('report-tab') : document.getElementById('main-scroller'); if (!scroller) return;
        const allPages = document.querySelectorAll('.preview-page-kertas');

        if(page === 'all') {
            setActivePrevBtn('all'); allPages.forEach(p => { p.classList.remove('hidden'); p.style.display = 'block'; });
            scroller.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => { initScrollSpy(); }, 500); return;
        }

        if(window.previewObserver) window.previewObserver.disconnect();
        const targetPage = document.getElementById('preview-page-' + page);

        if(targetPage) {
            allPages.forEach(p => { p.classList.add('hidden'); p.style.display = 'none'; });
            targetPage.classList.remove('hidden'); targetPage.style.display = 'block'; 
            setActivePrevBtn(page); scroller.scrollTo({ top: 0, behavior: "instant" });
        }

        if (isSplit && !fromForm) {
            document.querySelectorAll('.form-page-content').forEach(el => el.classList.add('hidden'));
            const activeForm = document.getElementById('form-page-' + page); if (activeForm) activeForm.classList.remove('hidden');
            setActiveFormBtn(page); updateBottomNav(page);
        }
    } catch(e) { console.error("Gagal melakukan navigasi preview:", e); }
}

function initScrollSpy() {
    if(window.previewObserver) window.previewObserver.disconnect();
    const rootElement = document.body.classList.contains('split-active') ? document.getElementById('report-tab') : document.getElementById('main-scroller');
    window.previewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { const pageId = entry.target.id.replace('preview-page-', ''); setActivePrevBtn(pageId); } });
    }, { root: rootElement, rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('.preview-page-kertas').forEach(page => { window.previewObserver.observe(page); });
}

function renderDynamicNav() {
    const formNav = document.getElementById('form-nav-container'); 
    const prevNav = document.getElementById('preview-nav-container');
    if(!formNav || !prevNav) return;
    
    formNav.innerHTML = ''; 
    prevNav.innerHTML = `<button type="button" onclick="switchPreview('all')" id="btn-prev-all" class="flex-shrink-0 px-3 py-2 bg-white text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition text-xs sm:text-sm border border-gray-200 sticky left-0 z-10">
        <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
            Semua
        </span>
    </button>`;
    
    let displayNum = 1;
    window.pageOrder.forEach((id) => {
        let config = window.pageConfigs[id]; 
        let titleFormat = config.isDup ? `Hal ${displayNum} (Dup)` : `Hal ${displayNum}`;
        
        formNav.innerHTML += `<button type="button" onclick="switchForm('${id}')" id="btn-form-${id}" class="flex-shrink-0 py-2 px-3.5 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition text-xs sm:text-sm">${titleFormat}</button>`;
        prevNav.innerHTML += `<button type="button" onclick="switchPreview('${id}')" id="btn-prev-${id}" class="flex-shrink-0 px-3 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition text-xs sm:text-sm">${titleFormat}</button>`;
        displayNum++;
    });
}

function updateBottomNav(id) {
    const idx = window.pageOrder.indexOf(id); if(idx === -1) return;
    const page = document.getElementById('form-page-' + id); if(!page) return;
    let btnPrev = page.querySelector('.btn-nav-prev'); let btnNext = page.querySelector('.btn-nav-next');
    const btnContainer = page.querySelector('.mt-8.flex');
    if(btnContainer && (!btnPrev || !btnNext)) {
        btnContainer.innerHTML = `<button type="button" class="btn-nav-prev inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition hidden">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Prev
        </button><button type="button" class="btn-nav-next inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition shadow-sm hidden">
            Next
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>`;
        btnPrev = page.querySelector('.btn-nav-prev'); btnNext = page.querySelector('.btn-nav-next'); btnContainer.classList.add('justify-between');
    }

    if(btnPrev) {
        if(idx > 0) {
            btnPrev.classList.remove('hidden'); 
            let prevTitle = window.pageConfigs[window.pageOrder[idx-1]].isDup ? "Duplikat" : window.pageConfigs[window.pageOrder[idx-1]].title;
            btnPrev.innerHTML = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg> ${prevTitle}`;
            btnPrev.onclick = () => switchForm(window.pageOrder[idx-1]);
        } else { btnPrev.classList.add('hidden'); }
    }
    if(btnNext) {
        if(idx < window.pageOrder.length - 1) {
            btnNext.classList.remove('hidden', 'bg-emerald-600', 'hover:bg-emerald-700'); 
            btnNext.classList.add('bg-primary-600', 'hover:bg-primary-700');
            let nextTitle = window.pageConfigs[window.pageOrder[idx+1]].isDup ? "Duplikat" : window.pageConfigs[window.pageOrder[idx+1]].title;
            btnNext.innerHTML = `${nextTitle} <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>`;
            btnNext.onclick = () => switchForm(window.pageOrder[idx+1]);
        } else {
            btnNext.classList.remove('hidden', 'bg-primary-600', 'hover:bg-primary-700'); 
            btnNext.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
            btnNext.innerHTML = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.159 48.159 0 018.5 0m-8.5 0V6.75a2 2 0 012-2h4.5a2 2 0 012 2v1.034" /></svg> Preview & Cetak`;
            btnNext.onclick = () => cetakPDF();
        }
    }
}

// ============================================
// TEMPLATE HTML UNTUK PREVIEW (DENGAN HEADER EDITABLE & OBJECT-FILL)
// ============================================
function tplHeader(title, pageId = 'default') {
    const displayTitle = window.customTitles[pageId] !== undefined ? window.customTitles[pageId] : title;
    return `
    <div class="relative w-full h-8 mb-2 shrink-0">
        <img src="" class="h-6 lg:h-8 absolute left-0 top-[-8px] object-contain out-logo-kiri">
        <img src="" class="h-6 lg:h-8 absolute right-0 top-[-8px] object-contain out-logo-kanan">
    </div>
    <div class="text-center w-full mb-2 shrink-0">
        <h1 id="title-${pageId}" contenteditable="true" onblur="window.saveCustomTitle('${pageId}', this.innerHTML)" class="text-[13px] md:text-sm font-bold leading-tight uppercase outline-none hover:bg-gray-100 focus:bg-white transition-colors cursor-text border-b border-transparent focus:border-gray-400 border-dashed inline-block px-2 py-1 rounded print:border-none print:p-0 print:bg-transparent">${displayTitle}</h1>
    </div>
    <div class="border-t-2 border-black mb-[2px] shrink-0"></div>
    <div class="border-t border-black mb-2 shrink-0"></div>`;
}

function tplInfo() {
    return `
    <div class="font-bold leading-snug w-full mb-3 uppercase text-[11px]">
        <div class="flex"><div class="w-[170px]">PROYEK</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
        <div class="flex"><div class="w-[170px]">KONTRAK</div><div class="w-4 text-center">:</div><div class="flex-1 val-kontrak">-</div></div>
        <div class="flex"><div class="w-[170px]">SP</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
        <div class="flex"><div class="w-[170px]">DISTRICT</div><div class="w-4 text-center">:</div><div class="flex-1 val-district">-</div></div>
        <div class="flex"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
        <div class="flex"><div class="w-[170px]">PELAKSANA</div><div class="w-4 text-center">:</div><div class="flex-1 val-pelaksana">-</div></div>
    </div>
    <div class="border-t-2 border-black mb-4"></div>`;
}

function tplTTD(marginClass = "mt-12") {
    return `
    <div class="w-full ${marginClass} flex justify-between px-8 text-center font-bold text-[11px] pb-4 shrink-0">
        <div class="w-[200px]">
            <p class="mb-4"></p>
            <p class="uppercase val-pihak1-perusahaan">-</p>
            <p class="uppercase val-pihak1-jabatan">-</p>
            <div class="h-16 my-2 relative flex justify-center items-center">
                <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kiri">...ttd...</span>
                <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kiri" style="padding: 2px;">
            </div>
            <div class="relative inline-block">
                <p class="underline uppercase val-pihak1-nama">-</p>
                <p>NIK. <span class="val-pihak1-nik">-</span></p>
                <img class="absolute bottom-[-10px] right-[-40px] w-12 h-12 object-contain hidden z-20 img-paraf-kiri">
            </div>
            </div>
        <div class="w-[200px]">
            <p><span class="uppercase val-tempat-ttd">-</span>, <span class="uppercase val-tgl-ttd">-</span></p>
            <p class="uppercase mt-2 val-pihak2-perusahaan">-</p>
            <p class="uppercase val-pihak2-jabatan">-</p>
            <div class="h-16 my-2 relative flex justify-center items-center">
                <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kanan">...ttd...</span>
                <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kanan" style="padding: 2px;">
                </div>
            <div class="relative inline-block">
                <p class="underline uppercase val-pihak2-nama">-</p>
                <p>NIK. <span class="val-pihak2-nik">-</span></p>
            </div>
        </div>
    </div>`;
}

function tplParaf() {
    return `
    <div class="w-full mt-8 mb-8 flex justify-end pt-4 shrink-0">
        <table class="border-collapse border border-black text-[10px] text-center font-bold bg-white" style="width: 150px;">
            <tr><td class="border border-black py-1 w-1/2">PARAF TIF</td><td class="border border-black py-1 w-1/2">PARAF TA</td></tr>
            <tr>
                <td class="border border-black p-1 align-middle">
                    <div class="relative w-full h-14 flex items-center justify-center bg-white">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-paraf-kiri">...</span>
                        <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-paraf-kiri" style="padding: 2px;">
                    </div>
                </td>
                <td class="border border-black p-1 align-middle">
                    <div class="relative w-full h-14 flex items-center justify-center bg-white">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-paraf-kanan">...</span>
                        <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-paraf-kanan" style="padding: 2px;">
                    </div>
                </td>
                </tr>
        </table>
    </div>`;
}

function generateDynamicPreviewPages() {
    const formContainer = document.getElementById('dynamic-form-pages-container');
    const prevContainer = document.getElementById('dynamic-preview-container');
    if(!formContainer || !prevContainer) return;
    
    formContainer.innerHTML = ''; prevContainer.innerHTML = '';

    // FORM OPM
    for(let i=7; i<=11; i++) {
        let isUtama = (i === 7);
        formContainer.insertAdjacentHTML('beforeend', `
        <div id="form-page-${i}" class="hidden form-page-content">
            <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">LAMPIRAN DATA OPM ${isUtama ? '(UTAMA)' : `(LANJUTAN ${i-7})`}</h3>
            ${isUtama ? `
                <div class="grid grid-cols-3 gap-4 mb-3"><label class="text-sm text-red-900">WAVE LENGTH</label><input type="text" id="inp-opm7-wave" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900" value="1310/1490 nm *)"></div>
                <div class="grid grid-cols-3 gap-4 mb-3"><label class="text-sm text-red-900">TIPE KABEL</label><input type="text" id="inp-opm7-kabel" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900 uppercase" value="SINGLE MODE G. 652 D"></div>
                <div class="grid grid-cols-3 gap-4 mb-3"><label class="text-sm text-red-900">JUMLAH CORE</label><input type="text" id="inp-opm7-core" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900 uppercase" value="12 CORE"></div>
                <div class="grid grid-cols-3 gap-4 mb-5"><label class="text-sm text-red-900">CATUAN</label><input type="text" id="inp-opm7-catuan" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900 uppercase" value="ODC-DMP-FAE"></div>
            ` : `<p class="text-xs text-red-600 mb-4 bg-white p-2 border border-red-200 rounded">*Data spesifikasi otomatis mengikuti isian dari Halaman 7 (Utama).</p>`}
            <div class="bg-red-50 p-4 border border-red-100 rounded mt-4">
                <label class="text-sm font-bold text-red-900">Upload Tabel OPM ${i-6}</label>
                <div class="flex gap-2 items-center w-full mt-2">
                    <input type="file" id="inp-img-opm${i}" data-target="out-opm${i}-tabel-img" accept="image/*" class="flex-1 border border-red-200 bg-white p-2 text-sm rounded cursor-pointer text-red-800">
                    <button type="button" onclick="clearFileAndPreview('inp-img-opm${i}', 'out-opm${i}-tabel-img')" id="btn-clear-inp-img-opm${i}" class="hidden bg-red-100 text-red-600 px-3 py-2 rounded font-bold text-sm hover:bg-red-200 border border-red-300">Hapus</button>
                </div>
            </div>
            <div class="mt-8 flex justify-between"></div>
        </div>`);

        prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-${i}" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN DATA PENGUKURAN OPM', 'opm' + i)}
            <div class="font-bold leading-snug w-full mb-3 uppercase text-[11px]">
                <div class="flex italic"><div class="w-[170px]">WAVE LENGTH</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-wave">1310/1490 nm *)</div></div>
                <div class="flex"><div class="w-[170px]">PROJECT</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
                <div class="flex"><div class="w-[170px]">SP</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
                <div class="flex"><div class="w-[170px]">TIPE KABEL</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-kabel">-</div></div>
                <div class="flex"><div class="w-[170px]">JUMLAH CORE</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-core">-</div></div>
                <div class="flex"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
                <div class="flex"><div class="w-[170px]">CATUAN</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-catuan">-</div></div>
            </div>
            <div class="border-t-2 border-black mb-4"></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4 mt-4">
                <img id="out-opm${i}-tabel-img" class="max-w-full max-h-[140mm] object-contain hidden">
            </div>
            ${tplTTD('mt-12')}
        </div>`);
    }

    // EVIDEN (MENGGUNAKAN OBJECT-FILL)
    for(let i=12; i<=21; i++) {
        let evIdx = i - 10;
        let isLanjutan = (i % 2 !== 0); 
        let numSlots = isLanjutan ? 3 : 9; 
        
        formContainer.insertAdjacentHTML('beforeend', `
        <div id="form-page-${i}" class="hidden form-page-content">
            <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">EVIDEN OPM (GRID) - Hal ${i}</h3>
            <div class="bg-red-50 p-4 mb-6 rounded border border-red-100">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-bold text-sm text-red-900">${isLanjutan ? `Upload Foto Lanjutan (Maks 2 Foto)` : `Upload Foto (Maks 9 Foto)`}</label>
                </div>
                <div class="border-2 border-dashed border-red-300 p-6 rounded-lg text-center bg-white mb-4 relative overflow-hidden group hover:border-red-500 hover:bg-red-100 cursor-pointer" id="drop-ev${evIdx}" onclick="document.getElementById('file-ev${evIdx}').click(); window.currentUploaderId = 'ev${evIdx}';">
                    <div class="pointer-events-none"><span class="text-4xl block mb-2">📸</span><p class="text-red-700 text-sm font-bold">Tarik & Lepas foto ke sini</p></div>
                    <input type="file" id="file-ev${evIdx}" multiple accept="image/*" class="hidden">
                </div>
                <div id="grid-ev${evIdx}" class="grid ${isLanjutan ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4"></div>
            </div>
            <div class="mt-8 flex justify-between"></div>
        </div>`);

        prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-${i}" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN EVIDENT HASIL UKUR OPM', 'eviden' + i)}
            ${tplInfo()}
            <div class="grid grid-cols-3 gap-0 border-t border-l border-black w-full mb-4 flex-none">
                ${Array(numSlots).fill(0).map((_, gridIdx) => `
                <div class="border-r border-b border-black flex flex-col p-1 h-[60mm]">
                    ${(isLanjutan && gridIdx === 2) ? `<div class="flex-1 bg-gray-50 opacity-50 min-h-0"></div>` : `<div class="flex-1 flex justify-center items-center overflow-hidden min-h-0"><img id="out-ev${evIdx}-img-${gridIdx+1}" class="w-full h-full object-fill hidden"></div>`}
                    <div class="border-t border-black text-center font-bold text-[10px] py-1 uppercase" ${(isLanjutan && gridIdx === 2) ? '' : `id="out-ev${evIdx}-cap-${gridIdx+1}"`}>${(isLanjutan && gridIdx === 2) ? '' : 'PORT'}</div>
                </div>
                `).join('')}
            </div>
            ${tplParaf()}
        </div>`);
    }

    for(let i=22; i<=26; i++) {
        formContainer.insertAdjacentHTML('beforeend', `
        <div id="form-page-${i}" class="hidden form-page-content">
            <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">DATA REPORT HASIL UKUR OTDR (HAL ${i})</h3>
            <div class="bg-red-50 p-4 rounded border border-red-100 mb-6">
                <h4 class="font-bold text-sm text-red-900 mb-2">Upload Gambar Report OTDR</h4>
                <div class="flex gap-2 items-center w-full">
                    <input type="file" id="inp-img-otdr${i}-full" data-target="out-otdr${i}-img-full" accept="image/*" class="flex-1 border border-red-200 bg-white p-2 rounded text-sm cursor-pointer text-red-800">
                    <button type="button" onclick="clearFileAndPreview('inp-img-otdr${i}-full', 'out-otdr${i}-img-full')" id="btn-clear-inp-img-otdr${i}-full" class="hidden bg-red-100 text-red-600 px-3 py-2 rounded font-bold text-sm hover:bg-red-200 border border-red-300">Hapus</button>
                </div>
            </div>
            <div class="mt-8 flex justify-between"></div>
        </div>`);

        prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-${i}" class="paper-a4 hidden page-break text-[11px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('REPORT HASIL UKUR OTDR', 'otdr' + i)}
            ${tplInfo()}
            <div class="w-full flex justify-center items-center overflow-hidden mb-8 mt-4"><img id="out-otdr${i}-img-full" class="max-w-full max-h-[170mm] object-contain hidden"></div>
            ${tplParaf()}
        </div>`);
    }

    // PENTING: HALAMAN 1 SD 6 DIINJEK KE AWAL PREVIEW CONTAINER MENGGUNAKAN INSERTADJACENTHTML
    prevContainer.insertAdjacentHTML('afterbegin', `
        <div id="preview-page-1" class="paper-a4 text-[13px] font-sans relative preview-page-kertas">
            <div class="w-full">
                <div class="relative flex justify-between items-start mb-6">
                    <img src="" alt="Logo Kiri" class="h-6 lg:h-7 absolute left-0 top-[-8px] object-contain out-logo-kiri">
                    <img src="" alt="Logo Kanan" class="h-6 lg:h-7 absolute right-0 top-[-8px] object-contain out-logo-kanan">
                </div>
                <div class="text-center mb-5 pt-4">
                    <h1 class="text-xl font-bold mt-2 outline-none hover:bg-red-50 focus:bg-white transition-colors cursor-text border-b border-transparent focus:border-red-400 border-dashed inline-block px-2 py-1 rounded print:border-none print:p-0 print:bg-transparent" contenteditable="true" onblur="window.saveCustomTitle('cover', this.innerHTML)">${window.customTitles['cover'] !== undefined ? window.customTitles['cover'] : 'DOKUMEN BERITA ACARA UJI TERIMA (BAUT)'}</h1>
                </div>
                <div class="border-t border-black mb-[2px]"></div><div class="border-t border-black mb-6"></div>
                <div class="font-bold leading-relaxed w-full uppercase">
                    <div class="flex mb-1"><div class="w-[170px]">PROYEK</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">KONTRAK</div><div class="w-4 text-center">:</div><div class="flex-1 val-kontrak">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">SURAT PESANAN</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">DISTRICT</div><div class="w-4 text-center">:</div><div class="flex-1 val-district">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">PELAKSANA</div><div class="w-4 text-center">:</div><div class="flex-1 val-pelaksana">-</div></div>
                </div>
            </div>
            <div class="w-full flex justify-center mt-28 mb-16"><img src="" class="w-[450px] object-contain out-logo-kiri"></div>
            <div class="w-full text-center text-[15px] md:text-[17px] font-bold space-y-7">
                <p>ANTARA</p>
                <p class="uppercase val-pihak1-perusahaan">-</p>
                <p>DENGAN</p>
                <p class="uppercase val-pihak2-perusahaan">-</p>
            </div>
        </div>

        <div id="preview-page-2" class="paper-a4 hidden page-break font-sans relative preview-page-kertas">
            <div class="relative flex justify-between items-start mb-16">
                <img src="" class="h-6 lg:h-7 absolute left-0 top-[-8px] object-contain out-logo-kiri">
                <img src="" class="h-6 lg:h-7 absolute right-0 top-[-8px] object-contain out-logo-kanan">
            </div>
            <div class="text-center mb-16 pt-4">
                <h1 class="text-2xl font-bold leading-snug outline-none hover:bg-red-50 focus:bg-white transition-colors cursor-text border-b border-transparent focus:border-red-400 border-dashed inline-block px-2 py-1 rounded print:border-none print:p-0 print:bg-transparent" contenteditable="true" onblur="window.saveCustomTitle('daftarisi', this.innerHTML)">${window.customTitles['daftarisi'] !== undefined ? window.customTitles['daftarisi'] : 'DAFTAR ISI<br>DOKUMEN BERITA ACARA UJI TERIMA<br>(BAUT)'}</h1>
            </div>
            <div class="px-20"><div id="out-daftar-isi" class="text-[15px] font-bold space-y-6"></div></div>
        </div>

        <div id="preview-page-3" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BERITA ACARA KRONOLOGIS TAMBAH KURANG PEKERJAAN', 'tkp')}
            ${tplInfo()}
            <div class="leading-relaxed text-justify mb-2 whitespace-pre-wrap" id="out-tkp-p1"></div>
            <div class="leading-relaxed text-justify mb-1 whitespace-pre-wrap" id="out-tkp-p2"></div>
            <div class="leading-relaxed mb-1 ml-4"><p>A. Rekapitulasi Nilai Pekerjaan</p></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4"><img id="out-tkp-img-rekap" class="max-w-full max-h-[80mm] object-contain hidden"></div>
            <div class="leading-relaxed mb-1 ml-4"><p>B. Tambah Kurang Volume Material</p></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4"><img id="out-tkp-img-material" class="max-w-full max-h-[80mm] object-contain hidden"></div>
            <p class="mb-2 text-justify">Demikian Berita Acara ini dibuat untuk dipergunakan seperlunya.</p>
            ${tplTTD('mt-10')}
        </div>

        <div id="preview-page-4" class="paper-a4 hidden page-break text-[13px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BERITA ACARA<br>UJI TERIMA PERTAMA', 'ut1')}
            ${tplInfo()}
            <div class="leading-relaxed text-justify mb-6 flex"><div class="w-8">1.</div><div class="flex-1 whitespace-pre-wrap" id="out-ut1-p1"></div></div>
            <div class="leading-relaxed text-justify mb-8 flex">
                <div class="w-8">2.</div>
                <div class="flex-1"><p>Pekerjaan tersebut telah / belum sesuai dengan spesifikasi PT Telkom Infrastruktur Indonesia yang ditentukan di dalam Perjanjian Pemborongan tersebut dan secara teknis dapat dinyatakan:</p><div class="text-center font-bold text-base mt-4">DITERIMA / <del>DITOLAK</del></div></div>
            </div>
            <div class="leading-relaxed text-justify flex">
                <div class="w-8">3.</div>
                <div class="flex-1"><p>Hal-hal yang masih perlu diselesaikan / disempurnakan selama masa perbaikan / pemeliharaan dapat dilihat pada halaman atau lembar catatan hasil uji terima pertama.</p></div>
            </div>
            ${tplTTD('mt-6')}
        </div>

        <div id="preview-page-5" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BOQ UJI TERIMA', 'boq')}
            ${tplInfo()}
            <div class="w-full flex justify-center items-center overflow-hidden mb-2 mt-4"><img id="out-boq-tabel-img" class="max-w-full max-h-[150mm] object-contain hidden"></div>
            ${tplTTD('mt-6')}
        </div>

        <div id="preview-page-6" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN EVIDENT UJI TERIMA', 'eviden1')}
            ${tplInfo()}
            <div class="grid grid-cols-3 gap-0 border-t border-l border-black w-full mb-4 flex-none">
                ${Array(9).fill(0).map((_, gridIdx) => `
                <div class="border-r border-b border-black flex flex-col p-1 h-[60mm]">
                    <div class="flex-1 flex justify-center items-center overflow-hidden min-h-0"><img id="out-ev1-img-${gridIdx+1}" class="w-full h-full object-fill hidden"></div>
                    <div class="border-t border-black text-center font-bold text-[10px] py-1 uppercase" id="out-ev1-cap-${gridIdx+1}">PORT</div>
                </div>
                `).join('')}
            </div>
            ${tplParaf()}
        </div>
    `);

    prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-27" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BERITA ACARA AS BUILD DRAWING (ABD)', 'abd')}
            ${tplInfo()}
            <div class="leading-relaxed text-justify mb-4 text-[11px] whitespace-pre-wrap" id="out-abd-paragraf"></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4 mt-2"><img id="out-abd-img-table" class="max-w-full max-h-[120mm] object-contain hidden"></div>
            <div class="leading-relaxed text-justify mb-4 text-[11px]">Selanjutnya, Tim SDI akan melakukan proses penggambaran pada Aplikasi GE SMALL WORLD paling lambat 7 hari.</div>
            <div class="leading-relaxed text-justify mb-4 text-[11px]">Demikian tanda terima ABD ini dibuat sesuai dengan keadaan yang sebenar - benarnya.</div>
            
            <div class="w-full mt-6 flex justify-between px-8 text-center font-bold text-[11px] pb-4 shrink-0">
                <div class="w-[200px]">
                    <p class="mb-4"></p>
                    <p class="uppercase" id="out-abd-perusahaan1">-</p>
                    <p class="uppercase" id="out-abd-jabatan1">-</p>
                    <div class="h-16 my-2 relative flex justify-center items-center">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kiri">...ttd...</span>
                        <img id="out-abd-img-ttd1" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;">
                    </div>
                    <div class="relative inline-block">
                        <p class="underline uppercase" id="out-abd-nama1">-</p>
                        <p>NIK. <span id="out-abd-nik1">-</span></p>
                    </div>
                </div>
                <div class="w-[200px]">
                    <p><span class="uppercase val-tempat-ttd">-</span>, <span class="uppercase val-tgl-ttd">-</span></p>
                    <p class="uppercase mt-2 val-pihak2-perusahaan">-</p>
                    <p class="uppercase val-pihak2-jabatan">-</p>
                    <div class="h-16 my-2 relative flex justify-center items-center">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kanan">...ttd...</span>
                        <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kanan" style="padding: 2px;">
                    </div>
                    <div class="relative inline-block">
                        <p class="underline uppercase val-pihak2-nama">-</p>
                        <p>NIK. <span class="val-pihak2-nik">-</span></p>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="preview-page-28" class="paper-a4-landscape hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN KML', 'kml')}
            ${tplInfo()}
            <div class="w-full flex justify-center items-center overflow-hidden mb-6 mt-4"><img id="out-kml-img-table" class="max-w-full max-h-[105mm] object-contain hidden"></div>
            ${tplParaf()}
        </div>
        
        <div id="preview-page-29" class="paper-a4-landscape hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN MANCORE', 'mancore')}
            ${tplInfo()}
            <div class="w-full flex justify-center items-center overflow-hidden mb-6 mt-4"><img id="out-mancore-img-table" class="max-w-full max-h-[105mm] object-contain hidden"></div>
            ${tplParaf()}
        </div>
    `);
}

function injectFormActions() {
    document.querySelectorAll('.form-page-content').forEach(page => {
        const pageId = page.id.replace('form-page-', '');
        let header = page.querySelector('.page-header') || page.querySelector('h3.bg-red-100') || page.querySelector('.bg-red-100.border-l-4');
        
        if(header && !header.querySelector('.orient-select')) {
            header.classList.remove('overflow-hidden');
            
            const isLand = (pageId === '28' || pageId === '29');
            const actionHTML = `
                <div class="float-right flex items-center gap-1 sm:gap-2 ml-2 mt-[-4px] absolute right-2 top-2 z-10">
                    <select class="orient-select bg-white border border-red-300 text-red-800 text-[10px] sm:text-xs font-bold rounded px-1 sm:px-2 py-1 cursor-pointer outline-none" data-page="${pageId}">
                        <option value="portrait" ${!isLand ? 'selected' : ''}>📄 Potrait</option>
                        <option value="landscape" ${isLand ? 'selected' : ''}>🗎 Landscape</option>
                    </select>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', actionHTML);
        }
    });
}

document.addEventListener('change', (e) => {
    if(e.target.classList.contains('orient-select')) {
        const pageId = e.target.getAttribute('data-page');
        const type = e.target.value;
        const page = document.getElementById(`preview-page-${pageId}`);
        if(page) {
            if(type === 'landscape') {
                page.classList.remove('paper-a4'); page.classList.add('paper-a4-landscape');
            } else {
                page.classList.remove('paper-a4-landscape'); page.classList.add('paper-a4');
            }
        }
    }
});

// ============================================
// FUNGSI DUPLIKASI HALAMAN (FIX PAIRING EVIDEN 12-21)
// ============================================
function duplikatHalaman(currentId) {
    let pagesToDuplicate = [currentId.toString()];
    let isPair = false;
    
    // Deteksi pasangan Eviden OPM (Halaman 12 sampai 21)
    let baseStr = currentId.toString().split('_')[0];
    let baseNum = parseInt(baseStr);
    if (baseNum >= 12 && baseNum <= 21) {
        let pairNum = (baseNum % 2 === 0) ? baseNum + 1 : baseNum - 1; // Genap ke ganjil, ganjil ke genap
        let pairedId = currentId.toString().replace(baseStr, pairNum.toString());
        
        // Cek apakah pasangannya benar-benar ada di layar
        if (document.getElementById('form-page-' + pairedId)) {
            isPair = true;
            // Urutkan: Genap (Utama) selalu dicloning duluan, baru Ganjil (Lanjutan)
            if (baseNum % 2 === 0) {
                pagesToDuplicate = [currentId.toString(), pairedId];
            } else {
                pagesToDuplicate = [pairedId, currentId.toString()];
            }
        }
    }

    const timestamp = Date.now();
    let firstNewId = null;
    let lastInsertedForm = null;
    let lastInsertedPrev = null;
    let insertIndexBase = -1;

    // Tentukan titik insert di DOM agar posisinya pas berurutan
    if (isPair) {
        lastInsertedForm = document.getElementById('form-page-' + pagesToDuplicate[1]);
        lastInsertedPrev = document.getElementById('preview-page-' + pagesToDuplicate[1]);
        insertIndexBase = window.pageOrder.indexOf(pagesToDuplicate[1]);
    } else {
        lastInsertedForm = document.getElementById('form-page-' + pagesToDuplicate[0]);
        lastInsertedPrev = document.getElementById('preview-page-' + pagesToDuplicate[0]);
        insertIndexBase = window.pageOrder.indexOf(pagesToDuplicate[0]);
    }

    // Lakukan looping duplikasi untuk 1 atau 2 halaman sekaligus
    pagesToDuplicate.forEach((idToClone, idx) => {
        const formEl = document.getElementById('form-page-' + idToClone);
        const prevEl = document.getElementById('preview-page-' + idToClone);
        if(!formEl || !prevEl) return;

        const newId = idToClone + '_d' + timestamp;
        if(!firstNewId) firstNewId = newId;

        const cloneForm = formEl.cloneNode(true);
        const clonePrev = prevEl.cloneNode(true);

        const oldIds = [];
        cloneForm.querySelectorAll('[id]').forEach(el => oldIds.push(el.id));
        clonePrev.querySelectorAll('[id]').forEach(el => oldIds.push(el.id));
        oldIds.sort((a,b) => b.length - a.length);

        let formHtml = cloneForm.innerHTML;
        let prevHtml = clonePrev.innerHTML;

        oldIds.forEach(oldId => {
            const regex = new RegExp(oldId, 'g');
            const newElementId = oldId + '_' + newId;
            formHtml = formHtml.replace(regex, newElementId);
            prevHtml = prevHtml.replace(regex, newElementId);
        });

        cloneForm.innerHTML = formHtml;
        clonePrev.innerHTML = prevHtml;
        cloneForm.id = 'form-page-' + newId;
        clonePrev.id = 'preview-page-' + newId;

        // Bersihkan gambar preview yang bukan komponen global
        clonePrev.querySelectorAll('img').forEach(img => {
            if (!img.classList.contains('out-logo-kiri') && 
                !img.classList.contains('out-logo-kanan') &&
                !img.classList.contains('img-ttd-kiri') &&
                !img.classList.contains('img-ttd-kanan') &&
                !img.classList.contains('img-paraf-kiri') &&
                !img.classList.contains('img-paraf-kanan') &&
                (!img.id || (!img.id.includes('ttd') && !img.id.includes('paraf')))) {
                img.removeAttribute('src');
                img.classList.add('hidden');
            }
        });

        // Bersihkan grid foto
        cloneForm.querySelectorAll('.eviden-grid-box img').forEach(img => {
            img.removeAttribute('src');
            img.classList.add('hidden');
        });

        cloneForm.querySelectorAll('input[type="file"]').forEach(inp => {
            inp.value = '';
        });

        const header = cloneForm.querySelector('.page-header') || cloneForm.querySelector('h3');
        if(header) {
            const delBtn = header.querySelector('.btn-hapus');
            if(delBtn) delBtn.remove();
            
            const actionDiv = header.querySelector('.absolute.right-2.top-2');
            if(actionDiv) {
                actionDiv.insertAdjacentHTML('beforeend', '<button type="button" onclick="hapusHalaman(\'' + newId + '\')" class="btn-hapus bg-red-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition ml-1">🗑️ Hapus</button>');
            }
        }

        const selectOrient = cloneForm.querySelector('.orient-select');
        if(selectOrient) selectOrient.setAttribute('data-page', newId);

        // Sisipkan elemen baru berjejer di DOM
        lastInsertedForm.insertAdjacentElement('afterend', cloneForm);
        lastInsertedPrev.insertAdjacentElement('afterend', clonePrev);
        lastInsertedForm = cloneForm; 
        lastInsertedPrev = clonePrev;

        // Daftarkan urutannya
        window.pageOrder.splice(insertIndexBase + 1 + idx, 0, newId);

        const baseConfig = window.pageConfigs[idToClone];
        window.pageConfigs[newId] = { title: baseConfig.title, isDup: true };

        // Pasang ulang Event Listeners untuk input & teks
        cloneForm.querySelectorAll('input, textarea, select').forEach(input => {
            if(input.type !== 'file' && !input.classList.contains('orient-select')) {
                input.addEventListener('input', () => {
                    const outId = input.id.replace('inp-', 'out-');
                    const outEl = document.getElementById(outId);
                    if(outEl) {
                        if(outEl.tagName === 'INPUT' || outEl.tagName === 'TEXTAREA') outEl.value = input.value;
                        else outEl.innerText = input.value;
                    }
                });
            } else if (input.type === 'file') {
                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const btnId = 'btn-clear-' + input.id;
                        const clearBtn = document.getElementById(btnId);
                        if (clearBtn) clearBtn.classList.remove('hidden');

                        const reader = new FileReader();
                        reader.onload = function(event) {
                            let targetId = input.getAttribute('data-target');
                            if (targetId && (targetId.includes('ttd') || targetId.includes('logo') || targetId.includes('paraf'))) {
                                removeWhiteBackground(event.target.result, function(transparentImg) {
                                    const outEl = document.getElementById(targetId);
                                    if(outEl) {
                                        outEl.src = transparentImg;
                                        outEl.classList.remove('hidden');
                                        const parent = outEl.parentElement;
                                        if(parent && parent.querySelector('span')) parent.querySelector('span').style.display = 'none';
                                    }
                                });
                            } else if (targetId) {
                                const outEl = document.getElementById(targetId);
                                if(outEl) {
                                    outEl.src = event.target.result;
                                    outEl.classList.remove('hidden');
                                    const parent = outEl.parentElement;
                                    if(parent && parent.querySelector('span')) parent.querySelector('span').style.display = 'none';
                                }
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        const clearBtn = document.getElementById('btn-clear-' + input.id);
                        if (clearBtn) clearBtn.classList.add('hidden');
                    }
                });
            }
        });

        // Inisialisasi ulang Uploader Grid
        cloneForm.querySelectorAll('.border-dashed').forEach(dropZone => {
            if(dropZone.id && dropZone.id.startsWith('drop-ev')) {
                const newEvId = dropZone.id.replace('drop-', ''); 
                const originalEvId = newEvId.split('_')[0]; 
                const uploaderMax = (originalEvId === 'ev1' || parseInt(originalEvId.replace('ev','')) % 2 === 0) ? 9 : 2; 
                setTimeout(() => {
                    let defCaps = Array(uploaderMax).fill("PORT");
                    window[newEvId + 'Uploader'] = new PhotoUploader(newEvId, uploaderMax, 'out-' + newEvId, defCaps);
                }, 100);
            }
        });
    });

    updateReport();
    renderDynamicNav();
    if(firstNewId) switchForm(firstNewId);
    initScrollSpy();
    
    if (isPair) {
        showCustomToast("Halaman Utama & Lanjutan (Eviden) berhasil diduplikat bersamaan!", false);
    } else {
        showCustomToast("Halaman berhasil diduplikat!", false);
    }
}

// ============================================
// FUNGSI HAPUS HALAMAN (IKUT MENGHAPUS PASANGAN EVIDEN JIKA ADA)
// ============================================
function hapusHalaman(id) {
    let pagesToDelete = [id.toString()];
    let isPair = false;
    
    // Deteksi pasangan Eviden OPM (12-21)
    let baseStr = id.toString().split('_')[0];
    let baseNum = parseInt(baseStr);
    if (baseNum >= 12 && baseNum <= 21) {
        let pairNum = (baseNum % 2 === 0) ? baseNum + 1 : baseNum - 1;
        let pairedId = id.toString().replace(baseStr, pairNum.toString());
        
        // Kalau pasangannya ikut ter-load di layar, hapus juga
        if(window.pageOrder.includes(pairedId)) {
            pagesToDelete.push(pairedId);
            isPair = true;
        }
    }

    let msg = isPair ? "Yakin ingin menghapus halaman Eviden Utama beserta Lanjutannya ini?" : "Yakin ingin menghapus halaman ini?";

    showCustomConfirm("Hapus Halaman", msg, () => {
        const currentIdx = window.pageOrder.indexOf(pagesToDelete[0]);
        
        pagesToDelete.forEach(targetId => {
            const formEl = document.getElementById('form-page-' + targetId);
            const prevEl = document.getElementById('preview-page-' + targetId);
            if(formEl) formEl.remove();
            if(prevEl) prevEl.remove();

            const idx = window.pageOrder.indexOf(targetId.toString());
            if(idx > -1) {
                window.pageOrder.splice(idx, 1);
                delete window.pageConfigs[targetId.toString()];
            }
        });

        renderDynamicNav();
        // Memastikan layar berpindah ke form yang paling dekat setelah dihapus
        let safeIdx = Math.max(0, currentIdx - 1);
        if(window.pageOrder[safeIdx]) {
            switchForm(window.pageOrder[safeIdx]);
        } else {
            switchForm(window.pageOrder[0]);
        }
        initScrollSpy();
    });
}

// ============================================
// LOGIKA MODAL POP-UP TAMBAH HALAMAN
// ============================================

function tambahHalamanCustom() {
    try {
        let maxPos = window.pageOrder.length;
        let maxPageEl = document.getElementById('modal-max-page');
        if (maxPageEl) maxPageEl.innerText = maxPos;
        
        let inputEl = document.getElementById('custom-prompt-input');
        if (inputEl) inputEl.value = '';
        
        const modal = document.getElementById('custom-prompt-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex'; 
        }
        
        setTimeout(() => {
            if (inputEl) inputEl.focus();
        }, 100);
    } catch (e) {
        console.error("Gagal memuat fungsi popup:", e);
    }
}

function closePromptModal() {
    const modal = document.getElementById('custom-prompt-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none'; 
    }
}

function submitPromptModal() {
    let userInput = document.getElementById('custom-prompt-input').value.trim().toLowerCase();
    
    closePromptModal();
    
    if (userInput === 'baru' || userInput === '') {
        buatHalamanBlank(); 
    } else {
        let targetIdx = parseInt(userInput) - 1;
        if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx < window.pageOrder.length) {
            let currentId = window.pageOrder[targetIdx];
            if(currentId === '6') {
                showCustomToast("Halaman Pengaturan Eviden Global (Hal 6) tidak perlu diduplikat.", true);
                return;
            }
            duplikatHalaman(currentId);
        } else {
            showCustomToast("Nomor halaman tidak valid atau tidak ditemukan!", true);
        }
    }
}

function buatHalamanBlank() {
    const pageId = 'c' + Date.now();
    window.pageOrder.push(pageId);
    window.pageConfigs[pageId] = { title: 'Custom Baru', isDup: true };

    const formContainer = document.getElementById('dynamic-form-pages-container');
    formContainer.insertAdjacentHTML('beforeend', `
    <div id="form-page-${pageId}" class="hidden form-page-content">
        <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">
            HALAMAN CUSTOM 
            <div class="float-right flex items-center gap-1 sm:gap-2 ml-2 mt-[-4px] absolute right-2 top-2 z-10">
                <select class="orient-select bg-white border border-red-300 text-red-800 text-[10px] sm:text-xs font-bold rounded px-1 sm:px-2 py-1 cursor-pointer outline-none" data-page="${pageId}">
                    <option value="portrait" selected>📄 Potrait</option>
                    <option value="landscape">🗎 Landscape</option>
                </select>
                <button type="button" onclick="hapusHalaman('${pageId}')" class="btn-hapus bg-red-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition ml-1">🗑️ Hapus</button>
                </div>
        </h3>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-1">Judul Halaman (Header Tengah)</label>
            <input type="text" id="inp-custom-${pageId}-judul" oninput="updateReport()" class="w-full border border-red-200 rounded p-2 focus:ring-2 focus:ring-red-500 outline-none uppercase text-red-900 font-bold text-center" value="BERITA ACARA CUSTOM">
        </div>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-1">Paragraf Atas</label>
            <textarea id="inp-custom-${pageId}-p1" oninput="updateReport()" rows="3" class="w-full border border-red-200 bg-white p-2 rounded text-sm focus:ring-2 focus:ring-red-500 outline-none leading-relaxed text-justify text-red-900">Masukkan paragraf pengantar di sini...</textarea>
        </div>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-2">Upload Gambar / Eviden</label>
            <div id="drop-custom${pageId}" class="border-2 border-dashed border-red-300 p-6 rounded-lg text-center bg-white mb-4 relative overflow-hidden group hover:border-red-500 hover:bg-red-100 transition-colors cursor-pointer" onclick="document.getElementById('file-custom${pageId}').click(); window.currentUploaderId = 'custom${pageId}';">
                <div class="pointer-events-none"><span class="text-4xl block mb-2">📸</span><p class="text-red-700 text-sm font-bold">Tarik & Lepas foto ke sini</p></div>
                <input type="file" id="file-custom${pageId}" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            </div>
            <div id="grid-custom${pageId}" class="grid grid-cols-2 md:grid-cols-3 gap-4"></div>
        </div>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-1">Paragraf Bawah</label>
            <textarea id="inp-custom-${pageId}-p2" oninput="updateReport()" rows="2" class="w-full border border-red-200 bg-white p-2 rounded text-sm focus:ring-2 focus:ring-red-500 outline-none leading-relaxed text-justify text-red-900">Demikian berita acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</textarea>
        </div>
        <div class="bg-red-100 p-4 rounded border border-red-300 mb-6 shadow-sm">
            <label class="block font-bold text-sm text-red-900 mb-2">Jenis Penandatanganan</label>
            <div class="flex gap-4 mb-4 pb-4 border-b border-red-200">
                <label class="flex items-center gap-1 cursor-pointer text-sm font-medium"><input type="radio" name="ttdtype-${pageId}" value="ttd" checked onchange="changeTtdType('${pageId}', 'ttd')"> TTD Lengkap</label>
                <label class="flex items-center gap-1 cursor-pointer text-sm font-medium"><input type="radio" name="ttdtype-${pageId}" value="paraf" onchange="changeTtdType('${pageId}', 'paraf')"> Tabel Paraf</label>
            </div>
            <div id="form-ttd-wrapper-${pageId}" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3 p-3 bg-white border border-red-200 rounded">
                    <h4 class="font-bold text-xs text-red-800 border-b border-red-100 pb-1">KIRI</h4>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Perusahaan</label><input type="text" id="inp-custom-${pageId}-perusahaan1" oninput="updateReport()" value="PT. TELKOM INFRASTRUKTUR INDONESIA" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Jabatan</label><input type="text" id="inp-custom-${pageId}-jabatan1" oninput="updateReport()" value="TIM UJI TERIMA" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Nama</label><input type="text" id="inp-custom-${pageId}-nama1" oninput="updateReport()" value="NAMA PIHAK KIRI" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">NIK</label><input type="text" id="inp-custom-${pageId}-nik1" oninput="updateReport()" value="123456" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div>
                        <label class="block text-xs font-bold text-red-700 mb-1">Upload TTD Khusus</label>
                        <div class="flex gap-1 items-center w-full">
                            <input type="file" id="inp-custom-${pageId}-ttd1" data-target="out-custom-${pageId}-img-ttd1" accept="image/*" class="flex-1 border border-red-200 bg-red-50 p-1 rounded text-xs cursor-pointer text-red-800">
                            <button type="button" onclick="clearFileAndPreview('inp-custom-${pageId}-ttd1', 'out-custom-${pageId}-img-ttd1')" id="btn-clear-inp-custom-${pageId}-ttd1" class="hidden bg-red-100 text-red-600 px-2 py-1 rounded font-bold text-xs hover:bg-red-200 border border-red-300" title="Hapus">X</button>
                        </div>
                    </div>
                </div>
                <div class="space-y-3 p-3 bg-white border border-red-200 rounded">
                    <h4 class="font-bold text-xs text-red-800 border-b border-red-100 pb-1">KANAN</h4>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Perusahaan</label><input type="text" id="inp-custom-${pageId}-perusahaan2" oninput="updateReport()" value="PT. TELKOM AKSES" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Jabatan</label><input type="text" id="inp-custom-${pageId}-jabatan2" oninput="updateReport()" value="TIM UJI TERIMA" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Nama</label><input type="text" id="inp-custom-${pageId}-nama2" oninput="updateReport()" value="NAMA PIHAK KANAN" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">NIK</label><input type="text" id="inp-custom-${pageId}-nik2" oninput="updateReport()" value="654321" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div>
                        <label class="block text-xs font-bold text-red-700 mb-1">Upload TTD Khusus</label>
                        <div class="flex gap-1 items-center w-full">
                            <input type="file" id="inp-custom-${pageId}-ttd2" data-target="out-custom-${pageId}-img-ttd2" accept="image/*" class="flex-1 border border-red-200 bg-red-50 p-1 rounded text-xs cursor-pointer text-red-800">
                            <button type="button" onclick="clearFileAndPreview('inp-custom-${pageId}-ttd2', 'out-custom-${pageId}-img-ttd2')" id="btn-clear-inp-custom-${pageId}-ttd2" class="hidden bg-red-100 text-red-600 px-2 py-1 rounded font-bold text-xs hover:bg-red-200 border border-red-300" title="Hapus">X</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="form-paraf-wrapper-${pageId}" class="hidden space-y-3 p-3 bg-white border border-red-200 rounded">
                 <p class="text-xs text-red-600 mb-2">*Tabel Paraf akan otomatis mengikuti Paraf Global di Hal 6.</p>
                 <div class="grid grid-cols-2 gap-4">
                     <div><label class="block text-xs font-bold text-red-700 mb-1">Header Kiri</label><input type="text" id="inp-custom-${pageId}-paraf-kiri" oninput="updateReport()" value="PARAF TIF" class="w-full border border-red-200 focus:ring-red-500 p-1.5 text-sm uppercase"></div>
                     <div><label class="block text-xs font-bold text-red-700 mb-1">Header Kanan</label><input type="text" id="inp-custom-${pageId}-paraf-kanan" oninput="updateReport()" value="PARAF TA" class="w-full border border-red-200 focus:ring-red-500 p-1.5 text-sm uppercase"></div>
                 </div>
            </div>
        </div>
        <div class="mt-8 flex justify-between"></div>
    </div>`);

    const prevContainer = document.getElementById('dynamic-preview-container');
    prevContainer.insertAdjacentHTML('beforeend', `
    <div id="preview-page-${pageId}" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
        <div class="relative w-full h-8 lg:h-10 mb-2 shrink-0"><img src="" class="h-6 lg:h-8 absolute left-0 top-0 object-contain out-logo-kiri"><img src="" class="h-6 lg:h-8 absolute right-0 top-0 object-contain out-logo-kanan"></div><div class="text-center w-full mb-2 shrink-0"><h1 id="out-custom-${pageId}-judul" contenteditable="true" onblur="window.saveCustomTitle('custom_${pageId}', this.innerHTML)" class="text-[13px] md:text-sm font-bold leading-tight uppercase outline-none hover:bg-red-50 focus:bg-white transition-colors cursor-text border-b border-transparent focus:border-red-400 border-dashed inline-block px-2 py-1 rounded print:border-none print:p-0 print:bg-transparent">${window.customTitles['custom_'+pageId] !== undefined ? window.customTitles['custom_'+pageId] : 'BERITA ACARA CUSTOM'}</h1></div><div class="border-t-2 border-black mb-[2px] shrink-0"></div><div class="border-t border-black mb-2 shrink-0"></div>
        <div class="font-bold leading-snug w-full mb-3 uppercase text-[11px]">
            <div class="flex"><div class="w-[170px]">PROYEK</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
            <div class="flex"><div class="w-[170px]">KONTRAK</div><div class="w-4 text-center">:</div><div class="flex-1 val-kontrak">-</div></div>
            <div class="flex"><div class="w-[170px]">SURAT PESANAN</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
            <div class="flex"><div class="w-[170px]">DISTRICT</div><div class="w-4 text-center">:</div><div class="flex-1 val-district">-</div></div>
            <div class="flex"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
            <div class="flex"><div class="w-[170px]">PELAKSANA</div><div class="w-4 text-center">:</div><div class="flex-1 val-pelaksana">-</div></div>
        </div>
        <div class="border-t-2 border-black mb-4"></div>
        <div class="leading-relaxed text-justify mb-4 whitespace-pre-wrap" id="out-custom-${pageId}-p1">Masukkan paragraf pengantar di sini...</div>
        <div id="out-custom${pageId}-grid-wrapper" class="w-full flex-none mb-4 min-h-0" style="display: none;">
            ${Array(9).fill(0).map((_, gridIdx) => `
            <div id="out-custom${pageId}-cell-${gridIdx+1}" class="border-r border-b border-black flex flex-col p-1 h-[60mm] custom-grid-item-${pageId}">
                <div class="flex-1 flex justify-center items-center overflow-hidden min-h-0"><img id="out-custom${pageId}-img-${gridIdx+1}" class="w-full h-full object-fill hidden"></div>
                <div class="border-t border-black text-center font-bold text-[10px] py-1 uppercase" id="out-custom${pageId}-cap-${gridIdx+1}">Foto ${gridIdx+1}</div>
            </div>
            `).join('')}
        </div>
        <div class="leading-relaxed text-justify mb-8 whitespace-pre-wrap" id="out-custom-${pageId}-p2">Demikian berita acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</div>
        
        <div id="preview-ttd-wrapper-${pageId}" class="w-full mt-12 flex justify-between px-8 text-center font-bold text-[11px] pb-4 shrink-0">
            <div class="w-[200px]"><p class="mb-4"></p><p class="uppercase" id="out-custom-${pageId}-perusahaan1">PT. TELKOM INFRASTRUKTUR INDONESIA</p><p class="uppercase" id="out-custom-${pageId}-jabatan1">TIM UJI TERIMA</p>
                <div class="h-16 my-2 relative flex justify-center items-center">
                    <span id="txt-ttd-kiri-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...ttd...</span>
                    <img id="out-custom-${pageId}-img-ttd1" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;">
                </div>
                <div class="relative inline-block">
                    <p class="underline uppercase" id="out-custom-${pageId}-nama1">NAMA</p><p>NIK. <span id="out-custom-${pageId}-nik1">123456</span></p>
                    <img class="absolute bottom-[-10px] right-[-40px] w-12 h-12 object-contain hidden z-20 img-paraf-kiri">
                </div>
            </div>
            <div class="w-[200px]"><p><span class="uppercase val-tempat-ttd">-</span>, <span class="uppercase val-tgl-ttd">-</span></p><p class="uppercase mt-2" id="out-custom-${pageId}-perusahaan2">PT. TELKOM AKSES</p><p class="uppercase" id="out-custom-${pageId}-jabatan2">TIM UJI TERIMA</p>
                <div class="h-16 my-2 relative flex justify-center items-center">
                    <span id="txt-ttd-kanan-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...ttd...</span>
                    <img id="out-custom-${pageId}-img-ttd2" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;">
                </div>
                <div class="relative inline-block">
                    <p class="underline uppercase" id="out-custom-${pageId}-nama2">NAMA</p><p>NIK. <span id="out-custom-${pageId}-nik2">654321</span></p>
                </div>
            </div>
        </div>
        
        <div id="preview-paraf-wrapper-${pageId}" class="w-full mt-8 mb-8 flex justify-end pt-4 shrink-0 hidden">
            <table class="border-collapse border border-black text-[10px] text-center font-bold bg-white" style="width: 150px;">
                <tr><td class="border border-black py-1 w-1/2" id="out-custom-${pageId}-paraf-kiri">PARAF TIF</td><td class="border border-black py-1 w-1/2" id="out-custom-${pageId}-paraf-kanan">PARAF TA</td></tr>
                <tr>
                    <td class="border border-black p-1 align-middle"><div class="relative w-full h-14 flex items-center justify-center bg-white"><span id="txt-paraf-tif-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...</span><img id="out-custom-${pageId}-paraf-img1" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;"></div></td>
                    <td class="border border-black p-1 align-middle"><div class="relative w-full h-14 flex items-center justify-center bg-white"><span id="txt-paraf-ta-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...</span><img id="out-custom-${pageId}-paraf-img2" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;"></div></td>
                </tr>
            </table>
        </div>
    </div>`);

    setTimeout(() => {
        window[`custom${pageId}Uploader`] = new PhotoUploader(`custom${pageId}`, 9, `out-custom${pageId}`, ["Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5", "Foto 6", "Foto 7", "Foto 8", "Foto 9"]);
        setupImageUpload(`inp-custom-${pageId}-ttd1`, `out-custom-${pageId}-img-ttd1`, `txt-ttd-kiri-custom-${pageId}`);
        setupImageUpload(`inp-custom-${pageId}-ttd2`, `out-custom-${pageId}-img-ttd2`, `txt-ttd-kanan-custom-${pageId}`);
        
        applyGlobalParaf(); setGlobalLogos(); updateReport();
    }, 100);

    renderDynamicNav(); switchForm(pageId); initScrollSpy();
    showCustomToast("Halaman Custom Baru berhasil ditambahkan di akhir!", false);
}

function changeTtdType(pageId, type) {
    document.getElementById(`form-ttd-wrapper-${pageId}`).classList.toggle('hidden', type !== 'ttd');
    document.getElementById(`form-paraf-wrapper-${pageId}`).classList.toggle('hidden', type !== 'paraf');
    document.getElementById(`preview-ttd-wrapper-${pageId}`).classList.toggle('hidden', type !== 'ttd');
    document.getElementById(`preview-paraf-wrapper-${pageId}`).classList.toggle('hidden', type !== 'paraf');
}

// ============================================
// INDEXEDDB HELPER UNTUK RIWAYAT (TANPA BATAS 5MB)
// ============================================
const HistoryDB = {
    DB_NAME: 'BautProDB',
    DB_VERSION: 1,
    STORE_NAME: 'history',
    db: null,

    async open() {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                    store.createIndex('tanggalISO', 'tanggalISO', { unique: false });
                }
            };
            request.onsuccess = (e) => { this.db = e.target.result; resolve(this.db); };
            request.onerror = (e) => reject(request.error);
        });
    },

    async getAll() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, 'readonly');
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async add(item) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.put(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(id) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async clear() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async count() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, 'readonly');
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

// ============================================
// MIGRASI: Pindahkan data lama dari localStorage ke IndexedDB
// ============================================
async function migrateHistoryToIDB() {
    const oldData = localStorage.getItem('bautPro_history');
    if (!oldData) return;
    try {
        const oldHistory = JSON.parse(oldData);
        if (!Array.isArray(oldHistory) || oldHistory.length === 0) {
            localStorage.removeItem('bautPro_history');
            return;
        }
        for (const item of oldHistory) {
            await HistoryDB.add(item);
        }
        localStorage.removeItem('bautPro_history');
        console.log(`Migrasi ${oldHistory.length} riwayat dari localStorage ke IndexedDB berhasil.`);
    } catch (e) {
        console.warn("Gagal migrasi riwayat:", e);
    }
}

// ============================================
// LOGIKA RIWAYAT LAPORAN (HISTORY) - CLOUD SYNC
// ============================================
let historyCurrentPage = 1;
const HISTORY_PER_PAGE = 10;
let activityChartInstance = null; // Variabel global untuk grafik

function saveCurrentToHistory() {
    const getValue = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
    const proyek = getValue('inp-proyek');
    const lokasi = getValue('inp-lokasi');
    let defaultName = proyek ? proyek.substring(0, 50) : 'Laporan Tanpa Nama';
    
    if (window.currentLoadedHistoryId && window.currentLoadedHistoryName) {
        defaultName = window.currentLoadedHistoryName; 
    }
    
    showHistorySaveModal(defaultName, proyek, lokasi, 'saved');
}

function autoSaveToHistoryOnPrint() {
    const getValue = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
    const proyek = getValue('inp-proyek');
    const lokasi = getValue('inp-lokasi');
    let name = proyek ? proyek.substring(0, 50) : 'Laporan Dicetak';
    
    if (window.currentLoadedHistoryId && window.currentLoadedHistoryName) {
        name = window.currentLoadedHistoryName; 
    }
    
    saveHistoryEntry(name, proyek, lokasi, 'printed');
}

function showHistorySaveModal(defaultName, proyek, lokasi, status) {
    const htmlMessage = `
        <div class="text-left space-y-3">
            <div>
                <label class="block text-xs font-bold text-gray-600 mb-1">Nama Dokumen</label>
                <input type="text" id="history-save-name" value="${sanitizeText(defaultName)}" class="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-red-500 uppercase" placeholder="Nama laporan...">
            </div>
            <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p><strong>Proyek:</strong> ${sanitizeText(proyek || '-')}</p>
                <p><strong>Lokasi:</strong> ${sanitizeText(lokasi || '-')}</p>
            </div>
        </div>
    `;
    
    showCustomConfirm('💾 Simpan ke Riwayat', htmlMessage, () => {
        const nameInput = document.getElementById('history-save-name');
        const name = nameInput ? nameInput.value.trim() : defaultName;
        if (!name) {
            showCustomToast("Nama dokumen wajib diisi!", true);
            return false; 
        }
        saveHistoryEntry(name, proyek, lokasi, status);
    });
}

// FUNGSI INI DIPECAH (SPLIT) UNTUK MENCEGAH FIREBASE CRASH/FREEZE
async function saveHistoryEntry(name, proyek, lokasi, status) {
    const inputs = {};
    document.querySelectorAll('input:not([type="file"]), textarea, select').forEach(el => {
        if (el.id) inputs[el.id] = el.value;
    });

    let targetId = window.currentLoadedHistoryId ? window.currentLoadedHistoryId : 'hist_' + Date.now();
    const sessionData = JSON.parse(localStorage.getItem('bautPro_session') || '{}');
    const currentUserEmail = sessionData.email || 'unknown';

    // META DATA LENGKAP (Ringan)
    const metaData = {
        id: targetId,
        userEmail: currentUserEmail,
        name: name,
        proyek: proyek || '-',
        lokasi: lokasi || '-',
        district: (document.getElementById('inp-district') ? document.getElementById('inp-district').value : '-') || '-',
        pelaksana: (document.getElementById('inp-pelaksana') ? document.getElementById('inp-pelaksana').value : '-') || '-',
        tanggal: new Date().toLocaleString('id-ID'),
        tanggalISO: new Date().toISOString(),
        status: status,
        pageCount: window.pageOrder.length
    };

    // DATA GAMBAR & HTML (Sangat Berat)
    const heavyData = {
        pageOrder: JSON.parse(JSON.stringify(window.pageOrder)),
        pageConfigs: JSON.parse(JSON.stringify(window.pageConfigs)),
        customTitles: JSON.parse(JSON.stringify(window.customTitles)),
        inputs: inputs,
        editorEkstra: document.getElementById('lembar-kerja') ? document.getElementById('lembar-kerja').innerHTML : '',
        formDynamicHTML: document.getElementById('dynamic-form-pages-container').innerHTML,
        previewDynamicHTML: document.getElementById('dynamic-preview-container').innerHTML
    };

    showCustomToast("Sedang sinkronisasi ke Cloud...", false);

    try {
        // Hapus variabel undefined yg bikin firebase error dengan JSON trick
        const cleanMeta = JSON.parse(JSON.stringify(metaData));
        const cleanHeavy = JSON.parse(JSON.stringify(heavyData));

        // 1. Simpan ke Firebase (Cloud) DULU
        await db.ref('history_meta/' + targetId).set(cleanMeta);
        await db.ref('history_data/' + targetId).set(cleanHeavy);

        // 2. Simpan versi gabungan ke Laptop (Lokal / IndexedDB) sebagai Backup
        const localData = { ...cleanMeta, ...cleanHeavy };
        await HistoryDB.add(localData).catch(e => console.warn("Lokal penuh:", e)); 

        window.currentLoadedHistoryId = targetId;
        window.currentLoadedHistoryName = name;
        
        const statusText = status === 'printed' ? 'dan Dicetak' : 'disimpan';
        showCustomToast(`Dokumen "${name}" berhasil ${statusText} ke Riwayat & Cloud!`, false);
        
        if (document.getElementById('history-tab') && !document.getElementById('history-tab').classList.contains('hidden')) {
            renderHistoryTab();
        }
        if (document.getElementById('dashboard-tab') && !document.getElementById('dashboard-tab').classList.contains('hidden')) {
            renderDashboard();
        }
    } catch(e) {
        console.error("Gagal menyimpan ke Cloud:", e);
        showCustomToast("Gagal upload ke Cloud! Data mungkin terlalu besar, tersimpan di lokal.", true);
        // Fallback save to local if cloud fails
        const localData = { ...metaData, ...heavyData };
        await HistoryDB.add(localData).catch(err => console.error(err));
        if (document.getElementById('history-tab') && !document.getElementById('history-tab').classList.contains('hidden')) {
            renderHistoryTab();
        }
        if (document.getElementById('dashboard-tab') && !document.getElementById('dashboard-tab').classList.contains('hidden')) {
            renderDashboard();
        }
    }
}

async function renderHistoryTab() {
    const listContainer = document.getElementById('history-list');
    const tableHeader = document.getElementById('history-table-header');
    if(!listContainer) return;
    
    const sessionData = JSON.parse(localStorage.getItem('bautPro_session') || '{}');
    const isAdmin = sessionData.role === 'admin';
    const currentUserEmail = sessionData.email || 'unknown';
    
    let history = [];
    try {
        const colSpan = isAdmin ? 8 : 7;
        listContainer.innerHTML = `<tr><td colspan="${colSpan}" class="p-8 text-center text-gray-500 font-bold">⏳ Mengambil data riwayat dari Cloud & Lokal...</td></tr>`;
        
        // PENGGABUNGAN DATA CLOUD & LOKAL (SOLUSI BUG HILANG-TIMBUL)
        const cloudHist = [];
        const snapshot = await db.ref('history_meta').once('value');
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                cloudHist.push(child.val());
            });
        }
        
        const localHist = await HistoryDB.getAll();
        
        // Gabungkan keduanya menggunakan Map untuk menghindari duplikat ID
        const mergedMap = new Map();
        localHist.forEach(h => mergedMap.set(h.id, h));
        cloudHist.forEach(h => mergedMap.set(h.id, h)); // Cloud menimpa lokal jika ada yang sama
        
        let allHistory = Array.from(mergedMap.values());
        
        // Filter untuk user biasa
        if (!isAdmin) {
            allHistory = allHistory.filter(h => h.userEmail === currentUserEmail || !h.userEmail);
        }
        
        // Urutkan berdasarkan waktu secara pasti
        allHistory.sort((a, b) => new Date(a.tanggalISO) - new Date(b.tanggalISO));
        history = allHistory;
        
    } catch(e) {
        console.error("Firebase read error, fallback to local:", e);
        const localHist = await HistoryDB.getAll(); 
        let allHistory = localHist;
        if (!isAdmin) {
            allHistory = allHistory.filter(h => h.userEmail === currentUserEmail || !h.userEmail);
        }
        allHistory.sort((a, b) => new Date(a.tanggalISO) - new Date(b.tanggalISO));
        history = allHistory;
    }
    
    if (tableHeader) {
        if (isAdmin) {
            tableHeader.innerHTML = `
                <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th class="p-4 font-semibold w-10">No</th>
                    <th class="p-4 font-semibold">Nama Dokumen</th>
                    <th class="p-4 font-semibold">User</th>
                    <th class="p-4 font-semibold">Proyek</th>
                    <th class="p-4 font-semibold">Lokasi</th>
                    <th class="p-4 font-semibold text-center">Tanggal</th>
                    <th class="p-4 font-semibold text-center">Status</th>
                    <th class="p-4 font-semibold text-center">Aksi</th>
                </tr>
            `;
        } else {
            tableHeader.innerHTML = `
                <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th class="p-4 font-semibold w-10">No</th>
                    <th class="p-4 font-semibold">Nama Dokumen</th>
                    <th class="p-4 font-semibold">Proyek</th>
                    <th class="p-4 font-semibold">Lokasi</th>
                    <th class="p-4 font-semibold text-center">Tanggal</th>
                    <th class="p-4 font-semibold text-center">Status</th>
                    <th class="p-4 font-semibold text-center">Aksi</th>
                </tr>
            `;
        }
    }
    
    updateHistoryStats(history);
    const filtered = getFilteredHistory(history);
    
    const totalPages = Math.ceil(filtered.length / HISTORY_PER_PAGE) || 1;
    if (historyCurrentPage > totalPages) historyCurrentPage = totalPages;
    
    const startIdx = (historyCurrentPage - 1) * HISTORY_PER_PAGE;
    const pageItems = filtered.slice(startIdx, startIdx + HISTORY_PER_PAGE);
    
    listContainer.innerHTML = '';
    
    if (filtered.length === 0) {
        const searchVal = document.getElementById('history-search') ? document.getElementById('history-search').value : '';
        const emptyMsg = searchVal ? 'Tidak ada riwayat yang cocok dengan pencarian.' : 'Belum ada riwayat dokumen yang disimpan di Cloud.';
        const colSpan = isAdmin ? 8 : 7;
        listContainer.innerHTML = `<tr><td colspan="${colSpan}" class="p-8 text-center italic text-gray-400 bg-white">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            <p class="font-medium">${emptyMsg}</p>
            ${!searchVal ? '<p class="text-xs mt-2 text-gray-400">Dokumen akan otomatis tersimpan ke Cloud saat mencetak PDF.</p>' : ''}
        </td></tr>`;
        updatePaginationInfo(0, 0, 0);
        document.getElementById('history-pagination').innerHTML = '';
        return;
    }

    const reversed = [...pageItems].reverse();
    let num = startIdx + 1;
    reversed.forEach(h => {
        const statusBadge = h.status === 'printed' 
            ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Dicetak</span>'
            : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Disimpan</span>';
        
        const pageCountStr = h.pageCount !== undefined ? h.pageCount : (h.pageOrder ? h.pageOrder.length : 0);
        
        const userColumn = isAdmin ? `<td class="p-4 text-gray-500 text-xs">
            <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                <span class="truncate max-w-[120px]" title="${sanitizeText(h.userEmail || 'unknown')}">${sanitizeText(h.userEmail || 'unknown')}</span>
            </div>
        </td>` : '';
        
        listContainer.innerHTML += `
            <tr class="hover:bg-gray-50 transition">
                <td class="p-4 text-center text-gray-400 text-sm">${num}</td>
                <td class="p-4">
                    <div class="font-medium text-gray-900">${sanitizeText(h.name)}</div>
                    <div class="text-xs text-gray-400 mt-0.5">${pageCountStr} halaman</div>
                </td>
                ${userColumn}
                <td class="p-4 text-gray-600 text-xs">${sanitizeText(h.proyek || '-')}</td>
                <td class="p-4 text-gray-600 text-xs">${sanitizeText(h.lokasi || '-')}</td>
                <td class="p-4 text-center text-gray-500 text-xs whitespace-nowrap">${sanitizeText(h.tanggal)}</td>
                <td class="p-4 text-center">${statusBadge}</td>
                <td class="p-4 text-center">
                    <div class="flex gap-1 justify-center">
                        <button onclick="previewHistoryItem('${h.id}')" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Preview">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <button onclick="loadFromHistory('${h.id}')" class="p-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition" title="Muat Data">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        </button>
                        <button onclick="duplicateHistoryItem('${h.id}')" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Duplikat">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                        </button>
                        <button onclick="deleteHistory('${h.id}')" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        num++;
    });

    updatePaginationInfo(startIdx + 1, Math.min(startIdx + HISTORY_PER_PAGE, filtered.length), filtered.length);
    renderPagination(totalPages);
}

function getFilteredHistory(history) {
    const searchInput = document.getElementById('history-search');
    const statusFilter = document.getElementById('history-filter-status');
    
    const search = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const status = statusFilter ? statusFilter.value : 'all';
    
    return history.filter(h => {
        const matchSearch = !search || 
            (h.name && h.name.toLowerCase().includes(search)) ||
            (h.proyek && h.proyek.toLowerCase().includes(search)) ||
            (h.lokasi && h.lokasi.toLowerCase().includes(search)) ||
            (h.district && h.district.toLowerCase().includes(search));
        
        const matchStatus = status === 'all' || h.status === status;
        
        return matchSearch && matchStatus;
    });
}

function filterHistory() {
    historyCurrentPage = 1;
    renderHistoryTab();
}

function updateHistoryStats(history) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let totalToday = 0, totalWeek = 0, totalMonth = 0;
    
    history.forEach(h => {
        if (!h.tanggalISO) return;
        const d = new Date(h.tanggalISO);
        const hDate = d.toISOString().split('T')[0];
        
        if (hDate === today) totalToday++;
        if (d >= startOfWeek) totalWeek++;
        if (d >= startOfMonth) totalMonth++;
    });
    
    const setStat = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setStat('stat-total', history.length);
    setStat('stat-today', totalToday);
    setStat('stat-week', totalWeek);
    setStat('stat-month', totalMonth);
}

function updatePaginationInfo(from, to, total) {
    const info = document.getElementById('history-showing-info');
    if (info) {
        if (total === 0) info.innerText = 'Tidak ada data';
        else info.innerText = `Menampilkan ${from}-${to} dari ${total} riwayat`;
    }
}

function renderPagination(totalPages) {
    const container = document.getElementById('history-pagination');
    if (!container) return;
    container.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const createBtn = (text, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = isActive 
            ? 'px-3 py-1.5 bg-red-600 text-white rounded font-bold text-xs shadow'
            : isDisabled
                ? 'px-3 py-1.5 bg-gray-100 text-gray-400 rounded font-bold text-xs cursor-not-allowed'
                : 'px-3 py-1.5 bg-white text-red-600 border border-red-300 rounded font-bold text-xs hover:bg-red-50 transition';
        if (!isDisabled && !isActive) {
            btn.onclick = () => { historyCurrentPage = page; renderHistoryTab(); };
        }
        return btn;
    };
    
    container.appendChild(createBtn('◀', historyCurrentPage - 1, false, historyCurrentPage <= 1));
    
    let startPage = Math.max(1, historyCurrentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    
    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createBtn(i.toString(), i, i === historyCurrentPage));
    }
    
    container.appendChild(createBtn('▶', historyCurrentPage + 1, false, historyCurrentPage >= totalPages));
}

// FUNGSI BARU UNTUK RENDER DASHBOARD DAN CHART JS
async function renderDashboard() {
    const totalPdfEl = document.getElementById('dash-total-pdf');
    if (!totalPdfEl) return; 

    const sessionData = JSON.parse(localStorage.getItem('bautPro_session') || '{}');
    const isAdmin = sessionData.role === 'admin';
    const currentUserEmail = sessionData.email || 'unknown';

    let history = [];
    try {
        const cloudHist = [];
        const snapshot = await db.ref('history_meta').once('value');
        if (snapshot.exists()) {
            snapshot.forEach(child => { cloudHist.push(child.val()); });
        }
        const localHist = await HistoryDB.getAll();
        const mergedMap = new Map();
        localHist.forEach(h => mergedMap.set(h.id, h));
        cloudHist.forEach(h => mergedMap.set(h.id, h)); 
        
        let allHistory = Array.from(mergedMap.values());
        if (!isAdmin) {
            allHistory = allHistory.filter(h => h.userEmail === currentUserEmail || !h.userEmail);
        }
        history = allHistory;
    } catch(e) {
        const localHist = await HistoryDB.getAll(); 
        let allHistory = localHist;
        if (!isAdmin) {
            allHistory = allHistory.filter(h => h.userEmail === currentUserEmail || !h.userEmail);
        }
        history = allHistory;
    }

    let totalPdf = 0;
    let totalSaved = 0;

    history.forEach(h => {
        if (h.status === 'printed') totalPdf++;
        if (h.status === 'saved') totalSaved++;
    });

    document.getElementById('dash-total-pdf').innerText = totalPdf;
    document.getElementById('dash-total-riwayat').innerText = totalSaved;

    // --- UBAHAN LOGIKA HARI: STATIS SENIN SAMPAI MINGGU (MINGGU INI) ---
    const labels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const dataPoints = [0, 0, 0, 0, 0, 0, 0];
    const currentWeekDays = [];
    
    // Cari hari Senin di minggu ini
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const monday = new Date(today.setDate(diffToMonday));
    monday.setHours(0,0,0,0);
    
    // Buat array referensi untuk perbandingan waktu
    for(let i=0; i<7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        currentWeekDays.push(d.getTime());
    }

    history.forEach(h => {
        if(!h.tanggalISO) return;
        const hd = new Date(h.tanggalISO);
        hd.setHours(0,0,0,0);
        const hdTime = hd.getTime();
        
        for(let i=0; i<7; i++) {
            if(hdTime === currentWeekDays[i]) {
                dataPoints[i]++;
                break;
            }
        }
    });
    // -------------------------------------------------------------------

    renderActivityChart(labels, dataPoints);
}

function renderActivityChart(labels, dataPoints) {
    const ctx = document.getElementById('activityChart');
    if(!ctx) return;

    if(window.activityChartInstance) {
        window.activityChartInstance.destroy();
    }

    let gradient = null;
    const canvasCtx = ctx.getContext('2d');
    if(canvasCtx) {
        gradient = canvasCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.5)'); 
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');
    }

    window.activityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aktivitas Harian',
                data: dataPoints,
                borderColor: '#f97316', 
                backgroundColor: gradient || 'rgba(249, 115, 22, 0.2)',
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#ea580c',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            color: '#9ca3af',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return ' Total: ' + context.parsed.y + ' Dokumen'; }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: { color: '#9ca3af', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: { 
                        color: '#9ca3af', 
                        font: { size: 11 }, 
                        stepSize: 1,
                        precision: 0 
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function deleteHistory(id) {
    showCustomConfirm("Hapus Riwayat", "Yakin ingin menghapus riwayat dokumen ini permanen?", async () => {
        try {
            await HistoryDB.delete(id);
            // HAPUS DARI KEDUA NODE FIREBASE
            await db.ref('history_meta/' + id).remove();
            await db.ref('history_data/' + id).remove();
            
            if(window.currentLoadedHistoryId === id) {
                window.currentLoadedHistoryId = null;
                window.currentLoadedHistoryName = null;
            }
            renderHistoryTab();
            renderDashboard();
            showCustomToast("Riwayat berhasil dihapus.", false);
        } catch(e) {
            showCustomToast("Gagal menghapus riwayat.", true);
        }
    });
}

function clearAllHistory() {
    showCustomConfirm("Hapus Semua Riwayat", "Yakin ingin menghapus SEMUA riwayat dokumen? Tindakan ini tidak dapat dibatalkan!", async () => {
        try {
            await HistoryDB.clear();
            // HAPUS SEMUA DATA DARI CLOUD
            await db.ref('history_meta').remove();
            await db.ref('history_data').remove();
            
            window.currentLoadedHistoryId = null; 
            window.currentLoadedHistoryName = null;
            renderHistoryTab();
            renderDashboard();
            showCustomToast("Semua riwayat berhasil dihapus.", false);
        } catch(e) {
            showCustomToast("Gagal menghapus riwayat.", true);
        }
    });
}

async function duplicateHistoryItem(id) {
    try {
        let original = null;
        // AMBIL DARI CLOUD DULU, GABUNGKAN META DAN DATA
        const metaSnap = await db.ref('history_meta/' + id).once('value');
        const dataSnap = await db.ref('history_data/' + id).once('value');
        
        if (metaSnap.exists() && dataSnap.exists()) {
            original = { ...metaSnap.val(), ...dataSnap.val() };
        } else {
            const historyLocal = await HistoryDB.getAll();
            original = historyLocal.find(r => r.id === id);
        }
        
        if (!original) return;
        
        const sessionData = JSON.parse(localStorage.getItem('bautPro_session') || '{}');
        const currentUserEmail = sessionData.email || 'unknown';

        const dupFull = JSON.parse(JSON.stringify(original));
        dupFull.id = 'hist_' + Date.now();
        dupFull.userEmail = currentUserEmail; 
        dupFull.name = original.name + ' (Copy)';
        dupFull.tanggal = new Date().toLocaleString('id-ID');
        dupFull.tanggalISO = new Date().toISOString();
        dupFull.status = 'saved';
        
        const dupMeta = { id: dupFull.id, userEmail: dupFull.userEmail, name: dupFull.name, proyek: dupFull.proyek, lokasi: dupFull.lokasi, district: dupFull.district, pelaksana: dupFull.pelaksana, tanggal: dupFull.tanggal, tanggalISO: dupFull.tanggalISO, status: dupFull.status, pageCount: dupFull.pageOrder ? dupFull.pageOrder.length : 0 };
        const dupHeavy = { pageOrder: dupFull.pageOrder, pageConfigs: dupFull.pageConfigs, customTitles: dupFull.customTitles, inputs: dupFull.inputs, editorEkstra: dupFull.editorEkstra, formDynamicHTML: dupFull.formDynamicHTML, previewDynamicHTML: dupFull.previewDynamicHTML };

        await HistoryDB.add(dupFull);
        await db.ref('history_meta/' + dupFull.id).set(dupMeta);
        await db.ref('history_data/' + dupFull.id).set(dupHeavy);
        
        renderHistoryTab();
        renderDashboard();
        showCustomToast(`Dokumen "${original.name}" berhasil diduplikat!`, false);
    } catch(e) {
        showCustomToast("Gagal menduplikat!", true);
    }
}

// ========================================================
// PERBAIKAN: LOGIKA LOCAL-FIRST UNTUK MENCEGAH BUG PREVIEW
// ========================================================

async function previewHistoryItem(id) {
    try {
        showCustomToast("Mencari data dokumen...", false);
        let report = null;

        // 1. Coba ambil dari Lokal (IndexedDB) DULU (Cepat & Aman dari limit)
        const historyLocal = await HistoryDB.getAll();
        report = historyLocal.find(r => r.id === id);

        // 2. Jika tidak ada di lokal, baru tarik dari Cloud (Berat)
        if (!report) {
            showCustomToast("Mengunduh data dari Cloud...", false);
            const metaSnap = await db.ref('history_meta/' + id).once('value');
            const dataSnap = await db.ref('history_data/' + id).once('value');
            
            if (metaSnap.exists() && dataSnap.exists()) {
                report = { ...metaSnap.val(), ...dataSnap.val() };
                // Backup otomatis ke lokal agar klik berikutnya instan
                await HistoryDB.add(report).catch(e => console.warn("Cache lokal penuh:", e));
            }
        }
        
        // 3. Validasi Akhir
        if (!report) {
            showCustomToast("Data tidak ditemukan di Cloud atau Lokal!", true);
            return;
        }
        
        window.pageOrder = report.pageOrder;
        window.pageConfigs = report.pageConfigs;
        window.customTitles = report.customTitles || {};
        
        document.getElementById('dynamic-form-pages-container').innerHTML = report.formDynamicHTML;
        document.getElementById('dynamic-preview-container').innerHTML = report.previewDynamicHTML;
        
        // Bersihkan class hide/skip yang mungkin terbawa di database
        document.querySelectorAll('.skip-print-page').forEach(el => el.classList.remove('skip-print-page'));
        
        for (let key in report.inputs) {
            let el = document.getElementById(key);
            if (el) el.value = report.inputs[key];
        }
        
        reinitDynamicEvents();
        updateReport();
        setGlobalLogos();
        applyGlobalParaf();
        renderDynamicNav();
        
        switchTab('report-tab');
        switchPreview('all');
        
        showCustomToast(`Preview: ${report.name}`, false);
    } catch(e) {
        console.error(e);
        showCustomToast("Gagal memuat preview! Mungkin gambar terlalu besar.", true);
    }
}

async function loadFromHistory(id) {
    try {
        showCustomToast("Mencari data laporan...", false);
        let report = null;

        // 1. Cek Lokal Dulu
        const historyLocal = await HistoryDB.getAll();
        report = historyLocal.find(r => r.id === id);

        // 2. Jika tidak ada, tarik dari Cloud
        if (!report) {
            showCustomToast("Mengunduh data dari Cloud...", false);
            const metaSnap = await db.ref('history_meta/' + id).once('value');
            const dataSnap = await db.ref('history_data/' + id).once('value');
            
            if (metaSnap.exists() && dataSnap.exists()) {
                report = { ...metaSnap.val(), ...dataSnap.val() };
                await HistoryDB.add(report).catch(e => console.warn(e));
            }
        }
        
        if (!report) {
            showCustomToast("Data tidak ditemukan di Cloud atau Lokal!", true);
            return;
        }

        showCustomConfirm("Muat Laporan", `Data di layar saat ini akan ditimpa dengan "${report.name}". Lanjutkan?`, () => {
            window.pageOrder = report.pageOrder;
            window.pageConfigs = report.pageConfigs;
            
            window.currentLoadedHistoryId = id;
            window.currentLoadedHistoryName = report.name;
            
            window.customTitles = report.customTitles || {};
            localStorage.setItem('bautPro_custom_titles', JSON.stringify(window.customTitles));

            document.getElementById('dynamic-form-pages-container').innerHTML = report.formDynamicHTML;
            document.getElementById('dynamic-preview-container').innerHTML = report.previewDynamicHTML;

            document.querySelectorAll('.skip-print-page').forEach(el => el.classList.remove('skip-print-page'));

            for (let key in report.inputs) {
                let el = document.getElementById(key);
                if (el) {
                    el.value = report.inputs[key];
                    localStorage.setItem('bautPro_' + key, report.inputs[key]);
                }
            }

            if(report.editorEkstra) {
                const editor = document.getElementById('lembar-kerja');
                if(editor) {
                    editor.innerHTML = report.editorEkstra;
                    localStorage.setItem('bautPro_editor_ekstra', report.editorEkstra);
                }
            }

            reinitDynamicEvents();
            updateReport();
            renderDynamicNav();
            switchTab('form-tab');
            switchForm(window.pageOrder[0]);
            initScrollSpy();

            showCustomToast(`"${report.name}" berhasil dimuat!`, false);
        });
    } catch(e) {
        console.error(e);
        showCustomToast("Gagal memuat laporan! Mungkin gambar terlalu besar.", true);
    }
}

async function duplicateHistoryItem(id) {
    try {
        showCustomToast("Mencari data untuk diduplikat...", false);
        let original = null;
        
        // 1. Cek Lokal Dulu
        const historyLocal = await HistoryDB.getAll();
        original = historyLocal.find(r => r.id === id);

        // 2. Jika tidak ada, tarik dari Cloud
        if (!original) {
            const metaSnap = await db.ref('history_meta/' + id).once('value');
            const dataSnap = await db.ref('history_data/' + id).once('value');
            
            if (metaSnap.exists() && dataSnap.exists()) {
                original = { ...metaSnap.val(), ...dataSnap.val() };
                await HistoryDB.add(original).catch(e => console.warn(e));
            }
        }
        
        if (!original) {
            showCustomToast("Gagal menduplikat, data tidak ditemukan!", true);
            return;
        }
        
        const sessionData = JSON.parse(localStorage.getItem('bautPro_session') || '{}');
        const currentUserEmail = sessionData.email || 'unknown';

        const dupFull = JSON.parse(JSON.stringify(original));
        dupFull.id = 'hist_' + Date.now();
        dupFull.userEmail = currentUserEmail; 
        dupFull.name = original.name + ' (Copy)';
        dupFull.tanggal = new Date().toLocaleString('id-ID');
        dupFull.tanggalISO = new Date().toISOString();
        dupFull.status = 'saved';
        
        const dupMeta = { id: dupFull.id, userEmail: dupFull.userEmail, name: dupFull.name, proyek: dupFull.proyek, lokasi: dupFull.lokasi, district: dupFull.district, pelaksana: dupFull.pelaksana, tanggal: dupFull.tanggal, tanggalISO: dupFull.tanggalISO, status: dupFull.status, pageCount: dupFull.pageOrder ? dupFull.pageOrder.length : 0 };
        const dupHeavy = { pageOrder: dupFull.pageOrder, pageConfigs: dupFull.pageConfigs, customTitles: dupFull.customTitles, inputs: dupFull.inputs, editorEkstra: dupFull.editorEkstra, formDynamicHTML: dupFull.formDynamicHTML, previewDynamicHTML: dupFull.previewDynamicHTML };

        await HistoryDB.add(dupFull);
        await db.ref('history_meta/' + dupFull.id).set(dupMeta);
        await db.ref('history_data/' + dupFull.id).set(dupHeavy);
        
        renderHistoryTab();
        renderDashboard();
        showCustomToast(`Dokumen "${original.name}" berhasil diduplikat!`, false);
    } catch(e) {
        showCustomToast("Gagal menduplikat!", true);
    }
}

async function previewHistoryItem(id) {
    try {
        showCustomToast("Mengunduh data dari Cloud...", false);
        let report = null;
        const metaSnap = await db.ref('history_meta/' + id).once('value');
        const dataSnap = await db.ref('history_data/' + id).once('value');
        
        if (metaSnap.exists() && dataSnap.exists()) {
            report = { ...metaSnap.val(), ...dataSnap.val() };
        } else {
            const historyLocal = await HistoryDB.getAll();
            report = historyLocal.find(r => r.id === id);
        }
        
        if (!report) {
            showCustomToast("Data tidak ditemukan di Cloud atau Lokal!", true);
            return;
        }
        
        window.pageOrder = report.pageOrder;
        window.pageConfigs = report.pageConfigs;
        window.customTitles = report.customTitles || {};
        
        document.getElementById('dynamic-form-pages-container').innerHTML = report.formDynamicHTML;
        document.getElementById('dynamic-preview-container').innerHTML = report.previewDynamicHTML;
        
        // FIX 2: Bersihkan class hide/skip yang terlanjur nyangkut di database
        document.querySelectorAll('.skip-print-page').forEach(el => el.classList.remove('skip-print-page'));
        
        for (let key in report.inputs) {
            let el = document.getElementById(key);
            if (el) el.value = report.inputs[key];
        }
        
        reinitDynamicEvents();
        updateReport();
        setGlobalLogos();
        applyGlobalParaf();
        renderDynamicNav();
        
        switchTab('report-tab');
        switchPreview('all');
        
        showCustomToast(`Preview: ${report.name}`, false);
    } catch(e) {
        console.error(e);
        showCustomToast("Gagal memuat preview! Mungkin gambar terlalu besar.", true);
    }
}

async function loadFromHistory(id) {
    try {
        showCustomToast("Mengunduh data dari Cloud...", false);
        let report = null;
        const metaSnap = await db.ref('history_meta/' + id).once('value');
        const dataSnap = await db.ref('history_data/' + id).once('value');
        
        if (metaSnap.exists() && dataSnap.exists()) {
            report = { ...metaSnap.val(), ...dataSnap.val() };
        } else {
            const historyLocal = await HistoryDB.getAll();
            report = historyLocal.find(r => r.id === id);
        }
        
        if (!report) {
            showCustomToast("Data tidak ditemukan di Cloud atau Lokal!", true);
            return;
        }

        showCustomConfirm("Muat Laporan", `Data di layar saat ini akan ditimpa dengan "${report.name}". Lanjutkan?`, () => {
            window.pageOrder = report.pageOrder;
            window.pageConfigs = report.pageConfigs;
            
            window.currentLoadedHistoryId = id;
            window.currentLoadedHistoryName = report.name;
            
            window.customTitles = report.customTitles || {};
            localStorage.setItem('bautPro_custom_titles', JSON.stringify(window.customTitles));

            document.getElementById('dynamic-form-pages-container').innerHTML = report.formDynamicHTML;
            document.getElementById('dynamic-preview-container').innerHTML = report.previewDynamicHTML;

            // FIX 3: Bersihkan class hide/skip yang terlanjur nyangkut di database
            document.querySelectorAll('.skip-print-page').forEach(el => el.classList.remove('skip-print-page'));

            for (let key in report.inputs) {
                let el = document.getElementById(key);
                if (el) {
                    el.value = report.inputs[key];
                    localStorage.setItem('bautPro_' + key, report.inputs[key]);
                }
            }

            if(report.editorEkstra) {
                const editor = document.getElementById('lembar-kerja');
                if(editor) {
                    editor.innerHTML = report.editorEkstra;
                    localStorage.setItem('bautPro_editor_ekstra', report.editorEkstra);
                }
            }

            reinitDynamicEvents();
            updateReport();
            renderDynamicNav();
            switchTab('form-tab');
            switchForm(window.pageOrder[0]);
            initScrollSpy();

            showCustomToast(`"${report.name}" berhasil dimuat!`, false);
        });
    } catch(e) {
        console.error(e);
        showCustomToast("Gagal memuat laporan! Mungkin gambar terlalu besar.", true);
    }
}

function reinitDynamicEvents() {
    // Reattach events for dynamically loaded inputs
    document.querySelectorAll('#dynamic-form-pages-container input, #dynamic-form-pages-container textarea, #dynamic-form-pages-container select').forEach(input => {
        if(input.type !== 'file' && !input.classList.contains('orient-select')) {
            input.addEventListener('input', () => {
                const outId = input.id.replace('inp-', 'out-');
                const outEl = document.getElementById(outId);
                if(outEl) {
                    if(outEl.tagName === 'INPUT' || outEl.tagName === 'TEXTAREA') outEl.value = input.value;
                    else outEl.innerText = input.value;
                }
            });
        } else if (input.type === 'file') {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        let targetId = input.getAttribute('data-target');
                        if (targetId && (targetId.includes('ttd') || targetId.includes('logo') || targetId.includes('paraf'))) {
                            removeWhiteBackground(event.target.result, function(transparentImg) {
                                const outEl = document.getElementById(targetId);
                                if(outEl) {
                                    outEl.src = transparentImg;
                                    outEl.classList.remove('hidden');
                                    const parent = outEl.parentElement;
                                    if(parent && parent.querySelector('span')) parent.querySelector('span').style.display = 'none';
                                }
                            });
                        } else if (targetId) {
                            const outEl = document.getElementById(targetId);
                            if(outEl) {
                                outEl.src = event.target.result;
                                outEl.classList.remove('hidden');
                                const parent = outEl.parentElement;
                                if(parent && parent.querySelector('span')) parent.querySelector('span').style.display = 'none';
                            }
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });

    document.querySelectorAll('.border-dashed').forEach(dropZone => {
        if(dropZone.id && dropZone.id.startsWith('drop-ev')) {
            const evId = dropZone.id.replace('drop-', ''); 
            const originalEvId = evId.split('_')[0]; 
            const uploaderMax = (originalEvId === 'ev1' || parseInt(originalEvId.replace('ev','')) % 2 === 0) ? 9 : 2; 
            // FIX: Berikan template array default agar input teks tetap dirender dari riwayat
            let defCaps = Array(uploaderMax).fill("PORT");
            window[evId + 'Uploader'] = new PhotoUploader(evId, uploaderMax, `out-${evId}`, defCaps);
        } else if (dropZone.id && dropZone.id.startsWith('drop-custom')) {
            const customId = dropZone.id.replace('drop-custom', '');
            window[`custom${customId}Uploader`] = new PhotoUploader(`custom${customId}`, 9, `out-custom${customId}`, ["Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5", "Foto 6", "Foto 7", "Foto 8", "Foto 9"]);
        }
    });

    injectFormActions(); // re-inject select orientations
}

// ============================================
// FUNGSI UPLOAD SINGLE IMAGE (FIXED UNTUK RIWAYAT)
// ============================================
function setupImageUpload(inputId, outputId, hideTextId = null) {
    const input = document.getElementById(inputId);
    // Kita hapus const output di sini agar dicari ulang secara dinamis saat upload
    
    if (input) {
        input.setAttribute('data-target', outputId); 
        if(hideTextId) input.setAttribute('data-hidetext', hideTextId);
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const clearBtn = document.getElementById('btn-clear-' + inputId);
            
            if (file) {
                if(clearBtn) clearBtn.classList.remove('hidden');

                const reader = new FileReader();
                reader.onload = function(event) {
                    // AMBIL ELEMEN OUTPUT SECARA DINAMIS (Penting saat memuat riwayat)
                    const currentOutput = document.getElementById(outputId);
                    if (!currentOutput) return;

                    if (outputId.includes('ttd') || outputId.includes('logo') || outputId.includes('paraf')) {
                        removeWhiteBackground(event.target.result, function(transparentImgUrl) {
                            currentOutput.src = transparentImgUrl;
                            currentOutput.style.display = 'block';
                            currentOutput.classList.remove('hidden');
                            if(hideTextId && document.getElementById(hideTextId)) document.getElementById(hideTextId).style.display = 'none';
                        });
                    } else {
                        currentOutput.src = event.target.result;
                        currentOutput.style.display = 'block';
                        currentOutput.classList.remove('hidden');
                        if(hideTextId && document.getElementById(hideTextId)) document.getElementById(hideTextId).style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            } else {
                clearFileAndPreview(inputId, outputId, 'normal', hideTextId);
            }
        });
    }
}

// ============================================
// LOGIKA DAFTAR ISI (TAMBAH & HAPUS ITEM)
// ============================================
function tambahDaftarIsi() {
    const container = document.getElementById('container-daftar-isi');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'flex gap-2 items-center';
    div.innerHTML = `<input type="text" oninput="updateReport()" class="flex-1 border rounded p-2 focus:ring-2 outline-none uppercase" placeholder="Masukkan nama lampiran..."><button type="button" onclick="hapusDaftarIsi(this)" class="bg-white border text-red-600 px-3 py-2 rounded font-bold hover:bg-red-50 transition">X</button>`;
    container.appendChild(div);
    div.querySelector('input').focus();
    updateReport();
}

function hapusDaftarIsi(btn) {
    const row = btn.parentElement;
    const container = document.getElementById('container-daftar-isi');
    if (!row || !container) return;
    if (container.children.length <= 1) {
        showCustomToast("Minimal harus ada 1 item Daftar Isi!", true);
        return;
    }
    row.remove();
    updateReport();
}

// UPDATE CORE REPORTS (MENGGUNAKAN CLASS GLOBAL)
function updateReport() {
    const getValue = (id) => { const el = document.getElementById(id); return el ? el.value : '-'; };
    const setClassVal = (className, val) => {
        document.querySelectorAll('.' + className).forEach(el => {
            if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = val;
            else el.innerText = val;
        });
    };
    
    const vPro = getValue('inp-proyek'), vKon = getValue('inp-kontrak'), vSp = getValue('inp-sp'), vDis = getValue('inp-district'), vLok = getValue('inp-lokasi'), vPel = getValue('inp-pelaksana');
    setClassVal('val-proyek', vPro); setClassVal('val-kontrak', vKon); setClassVal('val-sp', vSp); setClassVal('val-district', vDis); setClassVal('val-lokasi', vLok); setClassVal('val-pelaksana', vPel);

    document.querySelectorAll('[id^="container-daftar-isi"]').forEach(containerInp => {
        const suffix = containerInp.id.replace('container-daftar-isi', '');
        const containerOut = document.getElementById('out-daftar-isi' + suffix);
        if(containerOut) {
            const inputsDaftarIsi = containerInp.querySelectorAll('input');
            containerOut.innerHTML = ''; 
            inputsDaftarIsi.forEach((input, index) => {
                if(input.value.trim() !== '') {
                    containerOut.innerHTML += `<div class="flex gap-3 uppercase"><span class="whitespace-nowrap">${index + 1}.</span> <span>${sanitizeText(input.value)}</span></div>`;
                }
            });
        }
    });

    const tTtd = getValue('inp-tempat-ttd');
    const p1P = getValue('inp-pihak1-perusahaan'), p1J = getValue('inp-pihak1-jabatan'), p1N = getValue('inp-pihak1-nama'), p1K = getValue('inp-pihak1-nik');
    const p2P = getValue('inp-pihak2-perusahaan'), p2J = getValue('inp-pihak2-jabatan'), p2N = getValue('inp-pihak2-nama'), p2K = getValue('inp-pihak2-nik');
    
    let tglFmt = '3 JUNI 2026';
    if(document.getElementById('inp-tanggal')?.value) {
        const d = new Date(document.getElementById('inp-tanggal').value);
        tglFmt = `${d.getDate()} ${["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"][d.getMonth()]} ${d.getFullYear()}`;
    }

    setClassVal('val-tempat-ttd', tTtd); setClassVal('val-tgl-ttd', tglFmt);
    setClassVal('val-pihak1-perusahaan', p1P); setClassVal('val-pihak1-jabatan', p1J); setClassVal('val-pihak1-nama', p1N); setClassVal('val-pihak1-nik', p1K);
    setClassVal('val-pihak2-perusahaan', p2P); setClassVal('val-pihak2-jabatan', p2J); setClassVal('val-pihak2-nama', p2N); setClassVal('val-pihak2-nik', p2K);

    if (document.getElementById('inp-tkp-p1') && !window.isTkpEdited) {
        const t = getTkpTemplate(); document.getElementById('inp-tkp-p1').value = t.p1; document.getElementById('inp-tkp-p2').value = t.p2;
    }
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setVal('out-tkp-p1', getValue('inp-tkp-p1')); setVal('out-tkp-p2', getValue('inp-tkp-p2'));

    if (document.getElementById('inp-ut1-p1') && !window.isUt1Edited) document.getElementById('inp-ut1-p1').value = getUt1Template().p1;
    setVal('out-ut1-p1', getValue('inp-ut1-p1'));

    [7, 8, 9, 10, 11].forEach(i => {
        setVal(`out-opm${i}-wave`, getValue(`inp-opm7-wave`)); setVal(`out-opm${i}-kabel`, getValue(`inp-opm7-kabel`)); setVal(`out-opm${i}-core`, getValue(`inp-opm7-core`)); setVal(`out-opm${i}-catuan`, getValue(`inp-opm7-catuan`));
    });

    if (document.getElementById('inp-abd-paragraf') && !window.isAbdEdited) document.getElementById('inp-abd-paragraf').value = getAbdTemplate();
    setVal('out-abd-paragraf', getValue('inp-abd-paragraf'));
    setVal('out-abd-perusahaan1', getValue('inp-abd-kiri-perusahaan')); setVal('out-abd-jabatan1', getValue('inp-abd-kiri-jabatan')); 
    setVal('out-abd-nama1', getValue('inp-abd-kiri-nama')); setVal('out-abd-nik1', getValue('inp-abd-kiri-nik')); 

    window.pageOrder.forEach(pageId => {
        if(pageId.toString().startsWith('c') || pageId.toString().includes('_d')) {
            setVal(`out-custom-${pageId}-judul`, getValue(`inp-custom-${pageId}-judul`));
            setVal(`out-custom-${pageId}-p1`, getValue(`inp-custom-${pageId}-p1`));
            setVal(`out-custom-${pageId}-p2`, getValue(`inp-custom-${pageId}-p2`));
            
            setVal(`out-custom-${pageId}-perusahaan1`, getValue(`inp-custom-${pageId}-perusahaan1`));
            setVal(`out-custom-${pageId}-jabatan1`, getValue(`inp-custom-${pageId}-jabatan1`));
            setVal(`out-custom-${pageId}-nama1`, getValue(`inp-custom-${pageId}-nama1`));
            setVal(`out-custom-${pageId}-nik1`, getValue(`inp-custom-${pageId}-nik1`));
            setVal(`out-custom-${pageId}-perusahaan2`, getValue(`inp-custom-${pageId}-perusahaan2`));
            setVal(`out-custom-${pageId}-jabatan2`, getValue(`inp-custom-${pageId}-jabatan2`));
            setVal(`out-custom-${pageId}-nama2`, getValue(`inp-custom-${pageId}-nama2`));
            setVal(`out-custom-${pageId}-nik2`, getValue(`inp-custom-${pageId}-nik2`));
            setVal(`out-custom-${pageId}-paraf-kiri`, getValue(`inp-custom-${pageId}-paraf-kiri`));
            setVal(`out-custom-${pageId}-paraf-kanan`, getValue(`inp-custom-${pageId}-paraf-kanan`));
        }
    });
}

function getTkpTemplate() {
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.toUpperCase() : '-';
    return {
        p1: `Pada hari ini ${getValue('inp-hari')}, tanggal ${getValue('inp-tgl-teks')} bulan ${getValue('inp-bln-teks')} tahun ${getValue('inp-thn-teks')}, bertempat di kantor TIF district ${getValue('inp-district')}. Telah dilakukan Kesepakatan Tambah Kurang Perkerjaan terhadap Kontrak Perjanjian ${getValue('inp-proyek')} Antara PT. Telkom Infrastruktur Indonesia (TIF) dengan ${getValue('inp-pelaksana')} selanjutnya disebut MITRA dengan kesepakatan sebagai berikut:`,
        p2: `Dalam hal ini bertindak untuk dan atas nama PT. Telkom Infrastruktur Indonesia, telah melaksanakan pemeriksaan dan evaluasi terhadap kondisi nyata lapangan, atas kendala/permasalahan pelaksanaan pekerjaan sebagai berikut.`
    };
}

function getAbdTemplate() {
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.toUpperCase() : '-';
    return `Pada hari ini ${getValue('inp-hari')}, tanggal ${getValue('inp-tgl-teks')} bulan ${getValue('inp-bln-teks')} tahun ${getValue('inp-thn-teks')}, bertempat di ${getValue('inp-tempat-ttd')} telah diserahkan kelengkapan dokumen untuk pembuatan dokumen ABD Smallworld untuk Surat Pesanan ${getValue('inp-sp')} dari mitra ${getValue('inp-pelaksana')} kepada PT. TELKOM INFRASTRUKTUR INDONESIA Serta wakilnya yaitu Tim Survey Design Inventory (SDI) yang secara sah mewakili berdasarkan Kontrak ${getValue('inp-kontrak')} dengan lokasi sebagai berikut :`;
}

function getUt1Template() {
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.toUpperCase() : '-';
    let tglTtdFormat = '...';
    const inputTgl = document.getElementById('inp-tanggal')?.value;
    if(inputTgl) {
        const dateObj = new Date(inputTgl);
        const months = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
        tglTtdFormat = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    }
    return {
        p1: `Berdasarkan hasil pemeriksaan / Uji Terima Pertama (UT-I), yang dilaksanakan tanggal ${tglTtdFormat} oleh Tim Uji Terima terhadap Pengadaan dan Pemasangan Surat Pesanan ${getValue('inp-sp')} yang dilaksanakan oleh ${getValue('inp-pelaksana')} yang terikat Perjanjian Pemborongan / Kontrak Nomor: ${getValue('inp-kontrak')}`
    };
}

function terbilang(angka) {
    const huruf = ["", "SATU", "DUA", "TIGA", "EMPAT", "LIMA", "ENAM", "TUJUH", "DELAPAN", "SEMBILAN", "SEPULUH", "SEBELAS"];
    if (angka < 12) return huruf[angka];
    if (angka < 20) return terbilang(angka - 10) + " BELAS";
    if (angka < 100) return terbilang(Math.floor(angka / 10)) + " PULUH " + terbilang(angka % 10);
    if (angka < 200) return "SERATUS " + terbilang(angka - 100);
    if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " RATUS " + terbilang(angka % 100);
    if (angka < 2000) return "SERIBU " + terbilang(angka - 1000);
    if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " RIBU " + terbilang(angka % 1000);
    return "";
}

function generateTerbilang() {
    const dateInput = document.getElementById('inp-tanggal')?.value;
    if(!dateInput) return;
    const dateObj = new Date(dateInput);
    const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
    const months = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    
    if(document.getElementById('inp-hari')) document.getElementById('inp-hari').value = days[dateObj.getDay()];
    if(document.getElementById('inp-tgl-teks')) document.getElementById('inp-tgl-teks').value = terbilang(dateObj.getDate()).trim();
    if(document.getElementById('inp-bln-teks')) document.getElementById('inp-bln-teks').value = months[dateObj.getMonth()];
    if(document.getElementById('inp-thn-teks')) document.getElementById('inp-thn-teks').value = terbilang(dateObj.getFullYear()).trim();
    updateReport();
}

function resetTkpText() { window.isTkpEdited = false; updateReport(); showCustomToast("Teks TKP dikembalikan ke otomatis.", false); }
function resetAbdText() { window.isAbdEdited = false; updateReport(); showCustomToast("Teks ABD dikembalikan ke otomatis.", false); }
function resetUt1Text() { window.isUt1Edited = false; updateReport(); showCustomToast("Teks UT-1 dikembalikan ke otomatis.", false); }

class PhotoUploader {
    constructor(id, maxPhotos, outPrefix, defaultCaptions = []) {
        this.id = id; 
        this.maxPhotos = maxPhotos; 
        
        // FIX: Ekstrak suffix jika halaman ini adalah hasil duplikat
        let parts = id.split('_');
        this.baseId = parts[0];
        this.suffix = parts.length > 1 ? '_' + parts.slice(1).join('_') : '';
        this.outPrefixBase = outPrefix.split('_')[0]; // Ambil base outPrefix
        
        this.defaultCaptions = defaultCaptions; 
        this.photos = new Array(maxPhotos).fill(null); 
        this.captions = [...defaultCaptions];
        this.fileInput = document.getElementById(`file-${id}`); 
        this.gridContainer = document.getElementById(`grid-${id}`);
        
        if (this.gridContainer) {
            const savedBoxes = this.gridContainer.querySelectorAll('.eviden-grid-box');
            if(savedBoxes.length > 0) {
                savedBoxes.forEach((box, idx) => {
                    const img = box.querySelector('img');
                    if (img && img.src && img.src.startsWith('data:image')) {
                        this.photos[idx] = img.src;
                    }
                    const input = box.querySelector('input[type="text"]');
                    if (input && input.value) {
                        this.captions[idx] = input.value;
                    }
                });
            }
        }

        this.initEvents(); this.render();
        if(this.outPrefixBase.startsWith('out-custom')) this.adjustCustomGridLayout();
    }
    
    initEvents() {
        if(this.fileInput) this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        const dropZone = document.getElementById(`drop-${this.id}`);
        if(dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => dropZone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); }, false));
            ['dragenter', 'dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('bg-red-100', 'border-red-500'), false));
            ['dragleave', 'drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove('bg-red-100', 'border-red-500'), false));
            dropZone.addEventListener('drop', (e) => this.handleFiles(e.dataTransfer.files), false);
        }
    }
    
    handleFiles(files) {
        if(!files || files.length === 0) return;
        const newFiles = Array.from(files).filter(f => f.type.startsWith('image/')); let fileIdx = 0;
        for(let i=0; i<this.maxPhotos; i++) {
            if(!this.photos[i] && fileIdx < newFiles.length) { this.readAndSetFile(i, newFiles[fileIdx]); fileIdx++; }
        }
        if(fileIdx < newFiles.length) showCustomToast(`Hanya bisa menampung sisa maksimal ${this.maxPhotos} foto.`, true);
        if(this.fileInput) this.fileInput.value = '';
    }
    
    readAndSetFile(index, file) {
        const reader = new FileReader();
        reader.onload = (e) => { 
            this.photos[index] = e.target.result; 
            this.render(); 
            this.updatePreview(index); 
        };
        reader.readAsDataURL(file);
    }
    
    removePhoto(index) { this.photos[index] = null; this.render(); this.updatePreview(index); }
    
    triggerReplace(index) {
        let tempInput = document.getElementById('hidden-file-input-global');
        if (!tempInput) {
            tempInput = document.createElement('input'); tempInput.type = 'file'; tempInput.accept = 'image/*'; tempInput.id = 'hidden-file-input-global'; tempInput.style.position = 'absolute'; tempInput.style.opacity = '0'; tempInput.style.zIndex = '-1'; document.body.appendChild(tempInput);
        }
        tempInput.onchange = null; tempInput.value = ''; 
        tempInput.onchange = (e) => { if(e.target.files && e.target.files[0]) this.readAndSetFile(index, e.target.files[0]); };
        tempInput.click();
    }
    
    updateCaption(index, value) {
        this.captions[index] = value;
        // FIX: Gunakan baseId dan suffix agar ID preview cocok 100% dengan hasil clone DOM
        const targetId = `${this.outPrefixBase}-cap-${index+1}${this.suffix}`;
        const outCap = document.getElementById(targetId);
        if(outCap) outCap.innerText = value;
        
        if (this.gridContainer) {
            const boxes = this.gridContainer.querySelectorAll('.eviden-grid-box');
            if (boxes[index]) {
                const input = boxes[index].querySelector('input[type="text"]');
                if (input) input.setAttribute('value', value);
            }
        }
    }
    
    updatePreview(index) {
        const targetId = `${this.outPrefixBase}-img-${index+1}${this.suffix}`;
        const outImg = document.getElementById(targetId);
        if(outImg) {
            if(this.photos[index]) { outImg.src = this.photos[index]; outImg.classList.remove('hidden'); }
            else { outImg.src = ''; outImg.classList.add('hidden'); }
        }
        if(this.outPrefixBase.startsWith('out-custom')) this.adjustCustomGridLayout();
    }

    adjustCustomGridLayout() {
        const wrapperId = `${this.outPrefixBase}-grid-wrapper${this.suffix}`;
        const wrapper = document.getElementById(wrapperId); 
        if(!wrapper) return;
        const activeCount = this.photos.filter(p => p !== null).length;
        if(activeCount === 0) { wrapper.style.display = 'none'; } 
        else if(activeCount === 1) {
            wrapper.style.display = 'flex'; wrapper.className = "w-full flex-1 justify-center items-center overflow-hidden mb-4 min-h-0"; 
            for(let i=0; i<this.maxPhotos; i++) {
                const cell = document.getElementById(`${this.outPrefixBase}-cell-${i+1}${this.suffix}`); 
                const cap = document.getElementById(`${this.outPrefixBase}-cap-${i+1}${this.suffix}`); 
                const img = document.getElementById(`${this.outPrefixBase}-img-${i+1}${this.suffix}`); 
                if(cell) {
                    if(this.photos[i]) { cell.style.display = 'flex'; cell.className = "w-full h-full justify-center items-center overflow-hidden min-h-0"; if(img) { img.className = "w-full h-full object-fill"; img.classList.remove('hidden'); } if(cap) cap.style.display = 'none'; } 
                    else { cell.style.display = 'none'; }
                }
            }
        } else {
            wrapper.style.display = 'grid'; let colsClass = (activeCount === 2 || activeCount === 4) ? 'grid-cols-2' : 'grid-cols-3'; wrapper.className = `grid ${colsClass} gap-0 border-t border-l border-black w-full flex-none mb-4 min-h-0`;
            for(let i=0; i<this.maxPhotos; i++) {
                const cell = document.getElementById(`${this.outPrefixBase}-cell-${i+1}${this.suffix}`); 
                const cap = document.getElementById(`${this.outPrefixBase}-cap-${i+1}${this.suffix}`); 
                const img = document.getElementById(`${this.outPrefixBase}-img-${i+1}${this.suffix}`);
                if(cell) {
                    if(this.photos[i]) { cell.style.display = 'flex'; cell.className = "border-r border-b border-black flex flex-col p-1 h-[60mm]"; if(img) { img.className = "w-full h-full object-fill hidden"; img.classList.remove('hidden'); } if(cap) cap.style.display = 'block'; } 
                    else { cell.style.display = 'none'; }
                }
            }
        }
    }
    
    render() {
        if(!this.gridContainer) return;
        this.gridContainer.innerHTML = '';
        for(let i=0; i<this.maxPhotos; i++) {
            const hasPhoto = !!this.photos[i];
            const box = document.createElement('div'); box.className = 'bg-white p-2 border border-red-100 rounded shadow-sm flex flex-col eviden-grid-box';
            
            box.draggable = true;
            box.dataset.index = i;
            box.dataset.uploaderId = this.id;

            box.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ uploaderId: this.id, index: i }));
                box.style.opacity = '0.5';
            });
            box.addEventListener('dragend', () => {
                box.style.opacity = '1';
                document.querySelectorAll('.eviden-grid-box').forEach(b => b.classList.remove('border-red-500', 'border-2', 'scale-105'));
            });
            box.addEventListener('dragover', (e) => {
                e.preventDefault();
                box.classList.add('border-red-500', 'border-2', 'scale-105');
            });
            box.addEventListener('dragleave', () => {
                box.classList.remove('border-red-500', 'border-2', 'scale-105');
            });
            box.addEventListener('drop', (e) => {
                e.preventDefault();
                box.classList.remove('border-red-500', 'border-2', 'scale-105');
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const sUploaderId = data.uploaderId;
                    const sIdx = data.index;
                    const tUploaderId = this.id;
                    const tIdx = i;
                    
                    if (sUploaderId && window[`${sUploaderId}Uploader`] && window[`${tUploaderId}Uploader`]) {
                        const sUploader = window[`${sUploaderId}Uploader`];
                        const tUploader = window[`${tUploaderId}Uploader`];
                        
                        const tempPhoto = tUploader.photos[tIdx];
                        const tempCaption = tUploader.captions[tIdx];
                        
                        tUploader.photos[tIdx] = sUploader.photos[sIdx];
                        tUploader.captions[tIdx] = sUploader.captions[sIdx];
                        
                        sUploader.photos[sIdx] = tempPhoto;
                        sUploader.captions[sIdx] = tempCaption;
                        
                        sUploader.render();
                        sUploader.updatePreview(sIdx);
                        
                        if (sUploaderId !== tUploaderId) {
                            tUploader.render();
                        }
                        tUploader.updatePreview(tIdx);
                        
                        showCustomToast("Gambar berhasil ditukar! 🔄", false);
                    }
                } catch (err) {
                    console.error("Drop error", err);
                }
            });

            const title = document.createElement('span'); title.className = 'text-xs font-bold text-red-600 mb-1 flex justify-between px-1'; title.innerHTML = `<span>Foto ${i+1}</span> <span class="text-red-400 font-normal cursor-move" title="Tahan dan geser kotak ini untuk menukar urutan gambar">🔄 Geser</span>`; box.appendChild(title);
            const imgContainer = document.createElement('div'); imgContainer.className = 'w-full h-32 bg-red-50 flex items-center justify-center border border-red-200 rounded overflow-hidden mb-2 relative group eviden-img-wrapper cursor-pointer';
            
            if(hasPhoto) {
                const img = document.createElement('img'); img.src = this.photos[i]; img.className = 'w-full h-full object-fill'; imgContainer.appendChild(img);
                const overlay = document.createElement('div'); overlay.className = 'absolute inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity';
                const btnReplace = document.createElement('button'); btnReplace.type = 'button'; btnReplace.innerHTML = '🔄 Ganti'; btnReplace.className = 'bg-white text-red-600 border border-red-500 text-[10px] font-bold px-2 py-1 rounded hover:bg-red-50 shadow cursor-pointer z-10'; btnReplace.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.triggerReplace(i); };
                const btnDelete = document.createElement('button'); btnDelete.type = 'button'; btnDelete.innerHTML = '🗑️ Hapus'; btnDelete.className = 'bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-red-700 shadow cursor-pointer z-10'; btnDelete.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.removePhoto(i); };
                overlay.appendChild(btnReplace); overlay.appendChild(btnDelete); imgContainer.appendChild(overlay);
            } else {
                const span = document.createElement('span'); span.className = 'text-red-400 text-[10px] text-center px-2 pointer-events-none font-medium'; span.innerText = '(Klik untuk isi)'; imgContainer.appendChild(span); imgContainer.onclick = () => this.triggerReplace(i);
            }
            box.appendChild(imgContainer);
            if(this.defaultCaptions.length > 0) {
                const capInput = document.createElement('input'); capInput.type = 'text'; capInput.className = 'w-full border border-red-200 text-red-800 p-1 rounded text-xs text-center font-bold uppercase mt-auto outline-none focus:ring-1 focus:ring-red-500'; 
                capInput.value = this.captions[i] || ''; 
                capInput.setAttribute('value', this.captions[i] || '');
                capInput.oninput = (e) => this.updateCaption(i, e.target.value); 
                box.appendChild(capInput);
            }
            this.gridContainer.appendChild(box);
        }
    }
}

// ============================================
// LOGIKA EDITOR EKSTRA
// ============================================
function simpanEditorEkstra() {
    const editor = document.getElementById('lembar-kerja');
    if (!editor) { showCustomToast("Editor tidak ditemukan!", true); return; }
    try {
        localStorage.setItem('bautPro_editor_ekstra', editor.innerHTML);
        showCustomToast("Mantap! Laporan Ekstra berhasil disimpan ke draf lokal.", false);
    } catch (e) {
        showCustomToast("Gagal! Memori penuh, hapus beberapa gambar besar di editor.", true);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const hasSession = restoreSession();
    
    await migrateHistoryToIDB();
    
    generateDynamicPreviewPages();
    injectFormActions(); 
    renderDynamicNav(); 
    renderHistoryTab();

    updateReport();
    setGlobalLogos();

    // =========================================================================
    // FITUR BARU: LISTENER PENGHAPUSAN CLOUD UNTUK SINKRONISASI LOKAL REAL-TIME
    // Jika ada data di Cloud dihapus (oleh Admin/User lain), hapus juga di lokal
    // =========================================================================
    db.ref('history_meta').on('child_removed', async (snapshot) => {
        const deletedId = snapshot.key;
        if (deletedId) {
            try {
                await HistoryDB.delete(deletedId);
                
                if (window.currentLoadedHistoryId === deletedId) {
                    window.currentLoadedHistoryId = null;
                    window.currentLoadedHistoryName = null;
                }
                
                // Jika tab riwayat sedang dibuka saat data dihapus, update layarnya
                const histTab = document.getElementById('history-tab');
                if (histTab && !histTab.classList.contains('hidden')) {
                    renderHistoryTab(); 
                }
                const dashTab = document.getElementById('dashboard-tab');
                if (dashTab && !dashTab.classList.contains('hidden')) {
                    renderDashboard(); 
                }
            } catch(e) {
                console.warn("Gagal sinkronisasi hapus lokal:", e);
            }
        }
    });
    // =========================================================================

    const applyGlobalTtdTif = (ev) => { 
        removeWhiteBackground(ev.target.result, (res) => { 
            document.querySelectorAll('.img-ttd-kiri').forEach(img => { img.src = res; img.classList.remove('hidden'); }); 
            document.querySelectorAll('.txt-ttd-kiri').forEach(txt => txt.style.display = 'none'); 
        }); 
    };
    const applyGlobalTtdTa = (ev) => { 
        removeWhiteBackground(ev.target.result, (res) => { 
            document.querySelectorAll('.img-ttd-kanan').forEach(img => { img.src = res; img.classList.remove('hidden'); }); 
            document.querySelectorAll('.txt-ttd-kanan').forEach(txt => txt.style.display = 'none'); 
        }); 
    };

    // --- FIX TOMBOL HAPUS (X) UNTUK TTD, PARAF, DAN LOGO GLOBAL ---
    if(document.getElementById('inp-ttd-tif')) document.getElementById('inp-ttd-tif').addEventListener('change', (e) => { if(e.target.files[0]) { const btn = document.getElementById('btn-clear-inp-ttd-tif'); if(btn) btn.classList.remove('hidden'); const r = new FileReader(); r.onload = applyGlobalTtdTif; r.readAsDataURL(e.target.files[0]); } });
    if(document.getElementById('inp-ttd-ta')) document.getElementById('inp-ttd-ta').addEventListener('change', (e) => { if(e.target.files[0]) { const btn = document.getElementById('btn-clear-inp-ttd-ta'); if(btn) btn.classList.remove('hidden'); const r = new FileReader(); r.onload = applyGlobalTtdTa; r.readAsDataURL(e.target.files[0]); } });

    if(document.getElementById('inp-paraf-tif')) document.getElementById('inp-paraf-tif').addEventListener('change', (e) => { if(e.target.files[0]) { const btn = document.getElementById('btn-clear-inp-paraf-tif'); if(btn) btn.classList.remove('hidden'); const r = new FileReader(); r.onload = (ev) => { removeWhiteBackground(ev.target.result, (res) => { window.globalParafTif = res; applyGlobalParaf(); }); }; r.readAsDataURL(e.target.files[0]); } });
    if(document.getElementById('inp-paraf-ta')) document.getElementById('inp-paraf-ta').addEventListener('change', (e) => { if(e.target.files[0]) { const btn = document.getElementById('btn-clear-inp-paraf-ta'); if(btn) btn.classList.remove('hidden'); const r = new FileReader(); r.onload = (ev) => { removeWhiteBackground(ev.target.result, (res) => { window.globalParafTa = res; applyGlobalParaf(); }); }; r.readAsDataURL(e.target.files[0]); } });
    
    if(document.getElementById('inp-logo-kiri')) document.getElementById('inp-logo-kiri').addEventListener('change', (e) => { if(e.target.files[0]) { const btn = document.getElementById('btn-clear-inp-logo-kiri'); if(btn) btn.classList.remove('hidden'); const r = new FileReader(); r.onload = (ev) => { removeWhiteBackground(ev.target.result, (res) => { document.querySelectorAll('.out-logo-kiri').forEach(img => img.src = res); }); }; r.readAsDataURL(e.target.files[0]); } });
    if(document.getElementById('inp-logo-kanan')) document.getElementById('inp-logo-kanan').addEventListener('change', (e) => { if(e.target.files[0]) { const btn = document.getElementById('btn-clear-inp-logo-kanan'); if(btn) btn.classList.remove('hidden'); const r = new FileReader(); r.onload = (ev) => { removeWhiteBackground(ev.target.result, (res) => { document.querySelectorAll('.out-logo-kanan').forEach(img => img.src = res); }); }; r.readAsDataURL(e.target.files[0]); } });
    // --------------------------------------------------------------
    setupImageUpload('inp-img-tkp-rekap', 'out-tkp-img-rekap'); 
    setupImageUpload('inp-img-tkp-material', 'out-tkp-img-material'); 
    setupImageUpload('inp-img-boq', 'out-boq-tabel-img');
    [7,8,9,10,11].forEach(i => setupImageUpload(`inp-img-opm${i}`, `out-opm${i}-tabel-img`));
    [22,23,24,25,26].forEach(i => setupImageUpload(`inp-img-otdr${i}-full`, `out-otdr${i}-img-full`));
    setupImageUpload('inp-img-abd-table', 'out-abd-img-table'); 
    setupImageUpload('inp-ttd-abd-kiri', 'out-abd-img-ttd1', 'txt-ttd-kiri-abd');
    setupImageUpload('inp-img-kml', 'out-kml-img-table'); 
    setupImageUpload('inp-img-mancore', 'out-mancore-img-table');

    // BUG FIX EVIDEN 1: Menyinkronkan default caption Hal 6 dengan DOM saat load awal
    let defaultsEv1 = ["Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5", "Foto 6", "Foto 7", "Foto 8", "Foto 9"];
    window.ev1Uploader = new PhotoUploader('ev1', 9, 'out-ev1', defaultsEv1); 
    defaultsEv1.forEach((cap, idx) => { 
        const outCap = document.getElementById(`out-ev1-cap-${idx+1}`); 
        if(outCap) outCap.innerText = cap; 
    });
    
    const patterns = [
        { uploaderId: 'ev2', capId: 'out-ev2', odpName: "85", isLanjutan: false, max: 9 },
        { uploaderId: 'ev3', capId: 'out-ev3', odpName: "85", isLanjutan: true, max: 2 },
        { uploaderId: 'ev4', capId: 'out-ev4', odpName: "86", isLanjutan: false, max: 9 },
        { uploaderId: 'ev5', capId: 'out-ev5', odpName: "86", isLanjutan: true, max: 2 },
        { uploaderId: 'ev6', capId: 'out-ev6', odpName: "87", isLanjutan: false, max: 9 },
        { uploaderId: 'ev7', capId: 'out-ev7', odpName: "87", isLanjutan: true, max: 2 },
        { uploaderId: 'ev8', capId: 'out-ev8', odpName: "88", isLanjutan: false, max: 9 },
        { uploaderId: 'ev9', capId: 'out-ev9', odpName: "88", isLanjutan: true, max: 2 },
        { uploaderId: 'ev10', capId: 'out-ev10', odpName: "89", isLanjutan: false, max: 9 },
        { uploaderId: 'ev11', capId: 'out-ev11', odpName: "89", isLanjutan: true, max: 2 }
    ];

    patterns.forEach(p => {
        let defaults = !p.isLanjutan ? ["P-IN OUT SPL-1.04 ODC", `ODP FAE ${p.odpName}`, "AKSESORIS ODP", "PORT 1", "PORT 2", "PORT 3", "PORT 4", "PORT 5", "PORT 6"] : ["PORT 7", "PORT 8"];
        window[`${p.uploaderId}Uploader`] = new PhotoUploader(p.uploaderId, p.max, p.capId, defaults);
        defaults.forEach((cap, idx) => { const outCap = document.getElementById(`${p.capId}-cap-${idx+1}`); if(outCap) outCap.innerText = cap; });
    });

    setTimeout(() => {
        const savedEditor = localStorage.getItem('bautPro_editor_ekstra');
        const editor = document.getElementById('lembar-kerja');
        if (savedEditor && editor) {
            editor.innerHTML = savedEditor;
        }
    }, 600);

    setTimeout(initAutoSave, 500);
});

// ============================================
// LOGIKA CETAK PDF & VALIDASI
// ============================================

function cetakPDF() {
    validateBeforePrint();
}

function executePrint() {
    const modal = document.getElementById('print-validation-modal');
    if (modal) modal.classList.add('hidden');
    
    if (document.body.classList.contains('split-active')) {
        toggleSplitScreen();
    }
    
    switchTab('report-tab');
    document.querySelectorAll('[id^="preview-page-"]').forEach(pageEl => {
        pageEl.classList.remove('hidden');
        pageEl.style.display = 'block';
    });
    document.querySelectorAll('#preview-nav-container button').forEach(btn => {
        if(btn.id && btn.id.startsWith('btn-prev-')) btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
    });
    
    document.querySelectorAll('.preview-page-kertas img').forEach(img => {
        img.style.transition = 'none';
        img.style.outline = 'none';
    });
    
    autoSaveToHistoryOnPrint();
    
    setTimeout(() => { window.print(); }, 1000);
}

function validateBeforePrint() {
    let validationHTML = '';
    let allValid = true;
    emptyPagesToSkip = []; 

    window.pageOrder.forEach((id, index) => {
        let config = window.pageConfigs[id];
        let pageTitle = config.isDup ? `Hal ${index + 1} (Dup)` : `Hal ${index + 1} (${config.title})`;
        let formEl = document.getElementById('form-page-' + id);
        
        if (formEl) {
            let isLengkap = true;
            
            let inputs = formEl.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea');
            inputs.forEach(inp => {
                if (inp.value.trim() === '') isLengkap = false;
            });

            let fileInputs = formEl.querySelectorAll('input[type="file"]');
            fileInputs.forEach(fInp => {
                if (fInp.id && (fInp.id.startsWith('file-ev') || fInp.id.startsWith('file-custom'))) {
                    let uploaderName = fInp.id.replace('file-', '') + 'Uploader';
                    if (window[uploaderName]) {
                        let hasPhoto = window[uploaderName].photos.some(p => p !== null);
                        if (!hasPhoto) isLengkap = false;
                    }
                } else {
                    if (fInp.files.length === 0) {
                        let targetId = fInp.getAttribute('data-target');
                        if (targetId) {
                            let imgEl = document.getElementById(targetId);
                            if (!imgEl || !imgEl.getAttribute('src') || imgEl.getAttribute('src') === '') {
                                isLengkap = false;
                            }
                        } else {
                            isLengkap = false;
                        }
                    }
                }
            });

            if (isLengkap) {
                validationHTML += `<li class="text-red-700 font-bold text-[13px] mb-2 flex justify-between items-center border-b border-red-200 pb-1"><span>${pageTitle}</span> <span class="bg-red-100 px-2 py-0.5 rounded text-red-800 border border-red-300">✅ Lengkap</span></li>`;
            } else {
                validationHTML += `<li class="text-red-600 font-bold text-[13px] mb-2 flex justify-between items-center border-b border-red-200 pb-1"><span>${pageTitle}</span> <span class="bg-red-100 px-2 py-0.5 rounded text-red-800 border border-red-300">❌ Belum Lengkap</span></li>`;
                allValid = false;
                emptyPagesToSkip.push(id.toString()); 
            }
        }
    });

    let modal = document.getElementById('print-validation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'print-validation-modal';
        modal.className = 'fixed inset-0 z-[100] bg-black bg-opacity-60 flex items-center justify-center transition-opacity print-hide';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-11/12 max-w-md overflow-hidden border border-red-200 flex flex-col max-h-[85vh]">
            <div class="bg-red-700 px-5 py-4 flex justify-between items-center shrink-0">
                <h3 class="text-white font-extrabold text-lg flex items-center gap-2">📄 Status Pengisian Form</h3>
                <button type="button" onclick="document.getElementById('print-validation-modal').classList.add('hidden')" class="text-red-200 hover:text-white transition font-bold text-2xl leading-none">&times;</button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 bg-red-50">
                <p class="text-sm text-red-900 font-medium mb-4 text-center" id="validation-msg">
                    ${allValid ? 'Mantap! Semua halaman sudah terisi dengan lengkap.' : 'Perhatian! Ada halaman yang belum diisi penuh:'}
                </p>
                <ul id="validation-list" class="bg-white p-4 rounded-lg border border-red-100 shadow-inner max-h-48 overflow-y-auto">
                    ${validationHTML}
                </ul>
            </div>
            <div class="bg-white px-5 py-4 border-t border-red-100 flex justify-end gap-3 shrink-0">
                <button type="button" onclick="document.getElementById('print-validation-modal').classList.add('hidden')" class="px-4 py-2 bg-white border border-red-300 text-red-800 rounded-lg font-bold hover:bg-red-50 transition shadow-sm">
                    Batal Cetak
                </button>
                <button type="button" id="btn-lanjut-cetak" onclick="forcePrint()" class="px-6 py-2 ${allValid ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg font-bold transition shadow-md">
                    Lanjut Pilih Halaman
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// LOGIKA SKIP HALAMAN KOSONG
function forcePrint() {
    const modalValidation = document.getElementById('print-validation-modal');
    if (modalValidation) modalValidation.classList.add('hidden');
    
    const skipListEl = document.getElementById('skip-page-list');
    if (skipListEl) {
        skipListEl.innerHTML = window.pageOrder.map(p => {
            let config = window.pageConfigs[p];
            let displayTitle = config ? (config.isDup ? `Halaman (Duplikat)` : config.title) : `Halaman ${p}`;
            
            let isChecked = emptyPagesToSkip.includes(p.toString()) ? 'checked' : '';
            let textClass = emptyPagesToSkip.includes(p.toString()) ? 'text-red-600' : 'text-red-900';
            let extraWarning = emptyPagesToSkip.includes(p.toString()) ? ' (Kosong)' : '';

            return `
            <label class="flex items-center gap-3 p-2 bg-white rounded border border-red-200 cursor-pointer hover:bg-red-50 transition">
                <input type="checkbox" value="${p}" class="skip-checkbox w-5 h-5 text-red-600 focus:ring-red-500 border-red-300 rounded" ${isChecked}>
                <span class="font-bold text-sm ${textClass}">Sembunyikan Hal ${p} - ${displayTitle}${extraWarning}</span>
            </label>`;
        }).join('');

        const checkboxes = document.querySelectorAll('.skip-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        const btnToggle = document.getElementById('btn-toggle-all-skip');
        if(btnToggle) {
            btnToggle.innerText = allChecked ? "Batal Pilih Semua" : "Pilih Semua";
        }
    }
    document.getElementById('modal-confirm-skip').classList.remove('hidden');
}

// FUNGSI BARU UNTUK TOGGLE CHECKBOX
function toggleAllSkipCheckboxes() {
    const checkboxes = document.querySelectorAll('.skip-checkbox');
    let allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });
    
    const btnToggle = document.getElementById('btn-toggle-all-skip');
    if (btnToggle) {
        btnToggle.innerText = !allChecked ? "Batal Pilih Semua" : "Pilih Semua";
    }
}

function executePrintWithSkip() {
    document.getElementById('modal-confirm-skip').classList.add('hidden');
    
    const checkboxes = document.querySelectorAll('.skip-checkbox:checked');
    const selectedToSkip = Array.from(checkboxes).map(cb => cb.value);

    if (document.body.classList.contains('split-active')) {
        toggleSplitScreen();
    }
    switchTab('report-tab');
    
    document.querySelectorAll('[id^="preview-page-"]').forEach(pageEl => {
        pageEl.classList.remove('hidden');
        pageEl.style.display = 'block';
    });
    document.querySelectorAll('#preview-nav-container button').forEach(btn => {
        if(btn.id && btn.id.startsWith('btn-prev-')) btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
    });
    document.querySelectorAll('.preview-page-kertas img').forEach(img => {
        img.style.transition = 'none';
        img.style.outline = 'none';
    });

    // FIX 1: Save riwayat DULU sebelum halaman disembunyikan biar nggak error
    autoSaveToHistoryOnPrint();

    // BARU setelah itu tambahkan class hide ke halaman yang diskip
    selectedToSkip.forEach(pageNum => {
        const pageEl = document.getElementById('preview-page-' + pageNum);
        if(pageEl) pageEl.classList.add('skip-print-page');
    });

    showCustomToast("Menyiapkan dokumen PDF...", false);
    
    setTimeout(() => { 
        window.print(); 
    }, 500);
}

// Menghapus class skip saat dialog print selesai
window.addEventListener('afterprint', () => {
    document.querySelectorAll('.skip-print-page').forEach(el => {
        el.classList.remove('skip-print-page');
    });
});

// ============================================
// FITUR 100% LIVE SYNC & AUTO-SAVE (FIXED)
// ============================================
function initAutoSave() {
    let adaDataTersimpan = false;
    const inputs = document.querySelectorAll('input:not([type="file"]), textarea, select');
    
    inputs.forEach(el => {
        if (el.id) {
            const savedValue = localStorage.getItem('bautPro_' + el.id);
            if (savedValue !== null) {
                el.value = savedValue;
                adaDataTersimpan = true;
                
                // Mencegah teks paragraf ditimpa ulang oleh template otomatis saat web dimuat ulang
                if (el.id.includes('tkp-p')) window.isTkpEdited = true;
                if (el.id.includes('ut1-p')) window.isUt1Edited = true;
                if (el.id.includes('abd-paragraf')) window.isAbdEdited = true;
            }
        }
    });

    // Wajib panggil updateReport agar tampilan kertas sinkron dengan form yang di-load
    if (adaDataTersimpan) {
        updateReport();
    }

    // Event listener untuk menyimpan setiap ketikan secara live
    document.addEventListener('input', (e) => {
        if(e.target.matches('input:not([type="file"]), textarea, select')) {
            if (e.target.id) {
                localStorage.setItem('bautPro_' + e.target.id, e.target.value);
            }
            updateReport();
        }
    });
    
    document.addEventListener('change', (e) => {
        if(e.target.matches('input:not([type="file"]), textarea, select')) {
            if (e.target.id) {
                localStorage.setItem('bautPro_' + e.target.id, e.target.value);
            }
            updateReport();
        }
    });
    
    document.addEventListener('change', (e) => {
        if(e.target.matches('input:not([type="file"]), textarea, select')) {
            if (e.target.id) {
                localStorage.setItem('bautPro_' + e.target.id, e.target.value);
            }
            updateReport();
        }
    });
}

// ============================================
// FITUR GESER (PAN) DAN ZOOM GAMBAR PREVIEW (SINKRONISASI TTD & PARAF)
// ============================================

// Fungsi pembantu untuk memisahkan grup sinkronisasi (TTD vs Paraf Samping TTD vs Paraf Tabel)
function getSyncGroup(img) {
    // Cek apakah gambar adalah TTD/Paraf GLOBAL (berdasarkan class)
    let isGlobalTtdKiri = img.classList.contains('img-ttd-kiri');
    let isGlobalTtdKanan = img.classList.contains('img-ttd-kanan');
    let isGlobalParafKiri = img.classList.contains('img-paraf-kiri');
    let isGlobalParafKanan = img.classList.contains('img-paraf-kanan');
    
    let isInsideTable = !!img.closest('td');

    let selector = '';

    if (isGlobalTtdKiri) {
        selector = '.img-ttd-kiri';
    } else if (isGlobalTtdKanan) {
        selector = '.img-ttd-kanan';
    } else if (isGlobalParafKiri) {
        selector = '.img-paraf-kiri';
    } else if (isGlobalParafKanan) {
        selector = '.img-paraf-kanan';
    } else {
        // JIKA BUKAN GLOBAL (Artinya TTD khusus seperti ABD atau halaman Custom)
        // Kembalikan dirinya sendiri (tidak akan terpengaruh/mempengaruhi TTD Global)
        return [img]; 
    }

    let elements = Array.from(document.querySelectorAll(selector));

    // Pisahkan Paraf yang ada di SAMPING TTD dengan Paraf yang ada di DALAM TABEL
    if (isGlobalParafKiri || isGlobalParafKanan) {
        elements = elements.filter(el => !!el.closest('td') === isInsideTable);
    } else {
        // Pastikan TTD tidak ikut menarik class paraf yang tidak disengaja
        elements = elements.filter(el => !el.classList.contains('img-paraf-kiri') && !el.classList.contains('img-paraf-kanan') && !(el.id && el.id.includes('paraf')));
    }

    return elements;
}

// Mengambil state transform (scale, tx, ty)
function getTransformData(img) {
    return {
        scale: parseFloat(img.getAttribute('data-scale')) || 1,
        tx: parseFloat(img.getAttribute('data-tx')) || 0,
        ty: parseFloat(img.getAttribute('data-ty')) || 0
    };
}

// Menerapkan state transform ke element
function setTransformData(img, data) {
    img.setAttribute('data-scale', data.scale);
    img.setAttribute('data-tx', data.tx);
    img.setAttribute('data-ty', data.ty);
    img.style.transform = `translate(${data.tx}px, ${data.ty}px) scale(${data.scale})`;
}

let panState = { 
    isPanning: false, 
    img: null, 
    selectedImg: null, 
    syncGroup: [],
    startX: 0, 
    startY: 0, 
    initTx: 0, 
    initTy: 0, 
    scale: 1 
};

document.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'IMG' && e.target.closest('.preview-page-kertas') && !e.target.classList.contains('out-logo-kiri') && !e.target.classList.contains('out-logo-kanan')) {
        e.preventDefault(); 
        
        let tData = getTransformData(e.target);
        panState.isPanning = true;
        panState.img = e.target;
        panState.selectedImg = e.target;
        panState.syncGroup = getSyncGroup(e.target); // Dapatkan grup sinkronisasi
        panState.startX = e.clientX;
        panState.startY = e.clientY;
        panState.initTx = tData.tx;
        panState.initTy = tData.ty;
        panState.scale = tData.scale;
        
        document.querySelectorAll('.preview-page-kertas img').forEach(img => img.style.outline = 'none');
        e.target.style.outline = '3px dashed #ef4444';
        e.target.style.cursor = 'grabbing';
        
        panState.syncGroup.forEach(img => img.style.transition = 'none');
    } else {
        panState.selectedImg = null;
        document.querySelectorAll('.preview-page-kertas img').forEach(img => img.style.outline = 'none');
    }
});

document.addEventListener('mousemove', (e) => {
    if (panState.isPanning && panState.img) {
        let dx = e.clientX - panState.startX;
        let dy = e.clientY - panState.startY;
        let newTx = panState.initTx + dx;
        let newTy = panState.initTy + dy;
        
        // Terapkan translasi ke seluruh gambar di dalam grup sinkronisasi
        panState.syncGroup.forEach(targetImg => {
            setTransformData(targetImg, { scale: panState.scale, tx: newTx, ty: newTy });
        });
    }
});

window.addEventListener('mouseup', () => {
    if (panState.isPanning && panState.img) {
        panState.isPanning = false;
        panState.img.style.cursor = 'grab';
        panState.img = null;
    }
});

document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'IMG' && e.target.closest('.preview-page-kertas') && !e.target.classList.contains('out-logo-kiri') && !e.target.classList.contains('out-logo-kanan')) {
        if(!panState.isPanning) e.target.style.cursor = 'grab';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '=' || e.key === '-')) {
        if (panState.selectedImg) {
            e.preventDefault(); 
            
            let group = getSyncGroup(panState.selectedImg);
            let currentScale = parseFloat(panState.selectedImg.getAttribute('data-scale')) || 1;
            
            if (e.key === '+' || e.key === '=') currentScale += 0.1; 
            else if (e.key === '-') currentScale -= 0.1; 
            
            if (currentScale < 0.1) currentScale = 0.1;
            if (currentScale > 10) currentScale = 10;
            
            // Terapkan scale ke seluruh gambar di dalam grup sinkronisasi
            group.forEach(targetImg => {
                let tData = getTransformData(targetImg);
                tData.scale = currentScale;
                setTransformData(targetImg, tData);
            });
        }
    }
});

// ============================================
// GLOBAL FALLBACK UNTUK SEMUA FILE INPUT (MEMASTIKAN TOMBOL X MUNCUL)
// ============================================
document.addEventListener('change', function(e) {
    if (e.target && e.target.type === 'file') {
        const btnId = 'btn-clear-' + e.target.id;
        const btnClear = document.getElementById(btnId);
        if (btnClear) {
            if (e.target.files && e.target.files.length > 0) {
                btnClear.classList.remove('hidden');
            } else {
                btnClear.classList.add('hidden');
            }
        }
    }
});