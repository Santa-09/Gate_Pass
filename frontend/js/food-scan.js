// food-scan.js - Food scanner functionality
document.addEventListener('DOMContentLoaded', () => {
    const resultEl = document.getElementById('result');
    const successResult = document.getElementById('successResult');
    const errorResult = document.getElementById('errorResult');
    
    if (!resultEl) return;
    
    // Initialize scanner if available
    if (typeof Html5QrcodeScanner !== 'undefined') {
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader", 
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 }
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
        
        try {
            // Parse regNo from QR
            const regMatch = decodedText.match(/\|REG:([^|]+)/);
            const regNo = regMatch ? regMatch[1] : decodedText;
            
            const result = await window.freshersApp.verifyFood(regNo);
            
            if (result.status === 'success') {
                // Show success
                if (successResult) {
                    document.getElementById('scanName').textContent = result.data.Name;
                    document.getElementById('scanRegNo').textContent = result.data.RegNo;
                    document.getElementById('scanFood').textContent = result.data.Food;
                    document.getElementById('scanTime').textContent = new Date().toLocaleTimeString();
                    successResult.style.display = 'block';
                }
                
                playSound('success');
                
            } else if (result.status === 'warning') {
                // Food already redeemed
                if (errorResult) {
                    errorResult.querySelector('p').textContent = 'Food already redeemed for this ticket.';
                    errorResult.style.display = 'block';
                }
                playSound('warning');
                
            } else {
                // Show error
                if (errorResult) {
                    errorResult.querySelector('p').textContent = result.message || 'Invalid QR code';
                    errorResult.style.display = 'block';
                }
                playSound('error');
            }
            
        } catch (err) {
            console.error(err);
            if (errorResult) {
                errorResult.querySelector('p').textContent = 'Scanning error';
                errorResult.style.display = 'block';
            }
            playSound('error');
        }
    }
    
    function onScanFailure(error) {
        console.warn(`QR scan error: ${error}`);
    }
    
    function playSound(type) {
        const sounds = {
            success: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
            warning: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-960.mp3',
            error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
        };
        
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
});
