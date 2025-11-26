document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const formView = document.getElementById('consent-form');
    const certView = document.getElementById('certificate-view');
    const scannerBtn = document.getElementById('scanner-btn');
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('photo-canvas');
    const resetBtn = document.getElementById('reset-btn');
    const renewBtn = document.getElementById('renew-btn');
    const panicBtn = document.getElementById('panic-btn');
    const timerDisplay = document.getElementById('timer-display');
    const statusBadge = document.getElementById('status-badge');
    const certCard = document.querySelector('.certificate-card');

    // State
    let scanTimer = null;
    let consentTimer = null;
    let stream = null;
    let recognition = null;
    const SCAN_DURATION = 2000; // 2 seconds to hold
    const CONSENT_DURATION = 15 * 60; // 15 minutes in seconds

    // Initialize Camera
    async function initCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });
            video.srcObject = stream;
        } catch (err) {
            console.error("Camera error:", err);
            alert("Per favore abilita la fotocamera per registrare il consenso.");
        }
    }

    // Initialize Speech Recognition
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'it-IT';

            recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript.trim().toUpperCase();
                console.log("Heard:", command);

                if (command.includes('STOP') ||
                    command.includes('BASTA') ||
                    command.includes('NO') ||
                    command.includes('AIUTO')) {
                }

                // Start camera immediately
                initCamera();
                initSpeechRecognition();

                // Fingerprint Scanner Logic
                const startScan = (e) => {
                    e.preventDefault(); // Prevent scrolling/selection
                    scannerBtn.classList.add('scanning');

                    scanTimer = setTimeout(() => {
                        completeScan();
                    }, SCAN_DURATION);
                };

                const endScan = (e) => {
                    if (e) e.preventDefault();
                    scannerBtn.classList.remove('scanning');
                    if (scanTimer) {
                        clearTimeout(scanTimer);
                        scanTimer = null;
                    }
                };

                // Touch events
                scannerBtn.addEventListener('touchstart', startScan);
                scannerBtn.addEventListener('touchend', endScan);
                scannerBtn.addEventListener('touchcancel', endScan);

                // Mouse events (for desktop testing)
                scannerBtn.addEventListener('mousedown', startScan);
                scannerBtn.addEventListener('mouseup', endScan);
                scannerBtn.addEventListener('mouseleave', endScan);

                function completeScan() {
                    const p1 = document.getElementById('partner1').value.trim();
                    const p2 = document.getElementById('partner2').value.trim();

                    if (!p1 || !p2) {
                        alert("Inserisci i nomi di entrambi i partner.");
                        endScan();
                        return;
                    }

                    // Capture Photo
                    const context = canvas.getContext('2d');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const photoData = canvas.toDataURL('image/jpeg', 0.8);

                    generateCertificate(p1, p2, photoData);
                    endScan();
                }

                async function generateCertificate(p1, p2, photoData) {
                    const now = new Date();
                    const timestamp = now.toISOString();

                    // Display Data
                    document.getElementById('display-p1').textContent = p1;
                    document.getElementById('display-p2').textContent = p2;
                    document.getElementById('saved-photo').src = photoData;

                    // Format readable time
                    const dateStr = now.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
                    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    document.getElementById('cert-timestamp').textContent = `${dateStr} • ${timeStr}`;

                    // Generate Signature (Pseudo-Hash for demo)
                    const dataString = `${p1}|${p2}|${timestamp}|${photoData.substring(0, 50)}`; // Partial data for hash
                    const hash = await sha256(dataString);
                    document.getElementById('sig-hash').textContent = hash;

                    // Reset UI State
                    certCard.classList.remove('revoked-card');
                    document.querySelector('.partners-display').classList.remove('revoked-overlay');
                    document.querySelector('.photo-proof').classList.remove('revoked-overlay');
                    panicBtn.style.display = 'block';

                    // Switch Views
                    formView.classList.remove('active');
                    formView.classList.add('hidden');

                    setTimeout(() => {
                        certView.classList.remove('hidden');
                        certView.classList.add('active');
                        startConsentTimer();
                        if (recognition) recognition.start();
                    }, 500);
                }

                function startConsentTimer() {
                    let remaining = CONSENT_DURATION;
                    updateTimerDisplay(remaining);

                    statusBadge.className = 'status-badge valid';
                    statusBadge.innerHTML = '<span class="pulse"></span> ATTIVO';
                    renewBtn.classList.add('hidden');

                    if (consentTimer) clearInterval(consentTimer);

                    consentTimer = setInterval(() => {
                        remaining--;
                        updateTimerDisplay(remaining);

                        if (remaining <= 0) {
                            expireConsent();
                        }
                    }, 1000);
                }

                function updateTimerDisplay(seconds) {
                    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const s = (seconds % 60).toString().padStart(2, '0');
                    timerDisplay.textContent = `${m}:${s}`;
                }

                function expireConsent() {
                    clearInterval(consentTimer);
                    if (recognition) recognition.stop();

                    timerDisplay.textContent = "00:00";
                    statusBadge.className = 'status-badge expired';
                    statusBadge.textContent = "SCADUTO";
                    renewBtn.classList.remove('hidden');
                    panicBtn.style.display = 'none';
                }

                function revokeConsent() {
                    clearInterval(consentTimer);
                    if (recognition) recognition.stop();

                    // UI Updates for Revocation
                    statusBadge.className = 'status-badge revoked';
                    statusBadge.textContent = "REVOCATO";
                    timerDisplay.textContent = "STOP";

                    certCard.classList.add('revoked-card');
                    document.querySelector('.partners-display').classList.add('revoked-overlay');
                    document.querySelector('.photo-proof').classList.add('revoked-overlay');

                    panicBtn.style.display = 'none';
                    renewBtn.classList.add('hidden'); // Cannot renew a revoked consent

                    // Vibrate if supported
                    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
                }

                // Crypto Helper
                async function sha256(message) {
                    const msgBuffer = new TextEncoder().encode(message);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
                }

                // Event Listeners
                resetBtn.addEventListener('click', () => {
                    location.reload(); // Full reset
                });

                renewBtn.addEventListener('click', () => {
                    // Go back to form, keep names, require new scan
                    certView.classList.remove('active');
                    certView.classList.add('hidden');

                    setTimeout(() => {
                        formView.classList.remove('hidden');
                        formView.classList.add('active');
                        // Ensure camera is still running
                        if (!stream || !stream.active) initCamera();
                    }, 500);
                });

                panicBtn.addEventListener('click', revokeConsent);
            });
