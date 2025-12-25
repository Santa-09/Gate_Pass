// gate-scan.js - Gate scanner functionality
document.addEventListener('DOMContentLoaded', () => {
    const resultEl = document.getElementById('result');
    const successResult = document.getElementById('successResult');
    const errorResult = document.getElementById('errorResult');
    const warningResult = document.getElementById('warningResult');
    
    if (!resultEl) return;
    
    // Initialize scanner if Html5QrcodeScanner is available
    if (typeof Html5QrcodeScanner !== 'undefined') {
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader", 
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
            },
            false
        );
        
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    } else {
        resultEl.innerHTML = '<div class="scan-error">QR scanner library not loaded</div>';
    }
    
    async function onScanSuccess(decodedText) {
        // Hide previous results
        if (successResult) successResult.style.display = 'none';
        if (errorResult) errorResult.style.display = 'none';
        if (warningResult) warningResult.style.display = 'none';
        
        try {
            // Parse regNo from QR
            const regMatch = decodedText.match(/\|REG:([^|]+)/);
            const regNo = regMatch ? regMatch[1] : decodedText;
            
            const result = await window.freshersApp.verifyEntry(regNo);
            
            if (result.status === 'success') {
                // Show success
                if (successResult) {
                    document.getElementById('scanName').textContent = result.data.Name;
                    document.getElementById('scanRegNo').textContent = result.data.RegNo;
                    document.getElementById('scanType').textContent = result.data.Type;
                    document.getElementById('scanTime').textContent = new Date().toLocaleTimeString();
                    successResult.style.display = 'block';
                }
                
                // Play success sound
                playSound('success');
                
            } else if (result.status === 'warning') {
                // Show warning
                if (warningResult) {
                    document.getElementById('previousTime').textContent = 
                        new Date().toLocaleTimeString();
                    warningResult.style.display = 'block';
                }
                playSound('warning');
                
            } else {
                // Show error
                if (errorResult) {
                    errorResult.style.display = 'block';
                }
                playSound('error');
            }
            
        } catch (err) {
            console.error(err);
            if (errorResult) errorResult.style.display = 'block';
            playSound('error');
        }
    }
    
    function onScanFailure(error) {
        console.warn(`QR scan error: ${error}`);
    }
    
    function playSound(type) {
        const sounds = {
            success: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
            warning: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-960.mp3',
            error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
        };
        
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
});
