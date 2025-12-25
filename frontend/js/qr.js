// qr.js - QR Code Generation Utilities
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(location.search);
    const regNo = params.get('regNo');
    
    if (!regNo) {
        document.getElementById('pname').textContent = 'Missing registration number';
        return;
    }

    try {
        const res = await window.freshersApp.getRegistration(regNo);
        
        if (res.status !== 'ok') {
            document.getElementById('pname').textContent = 'Pass not found';
            return;
        }
        
        const d = res.data;

        // Fill ticket details
        document.querySelector('#pname').textContent = d.Name || '';
        document.querySelector('#preg').textContent = d.RegNo || '';
        document.querySelector('#pbranch').textContent = d.Branch || '';
        document.querySelector('#psec').textContent = d.Section || '';
        document.querySelector('#pfood').textContent = d.Food || '';
        document.querySelector('#pstatus').textContent = 'Status: ' + (d.Status || '-');

        // Food icon
        const foodIcon = document.querySelector('#foodicon');
        if (foodIcon) {
            foodIcon.src = (d.Food || '').toLowerCase().includes('veg') 
                ? 'assets/veg-icon.png' 
                : 'assets/nonveg-icon.png';
        }

        // Generate QR
        const qrText = `APP:FRESHER2025|REG:${d.RegNo}|NAME:${d.Name}|TYPE:${d.Type}|BRANCH:${d.Branch}|SEC:${d.Section}|FOOD:${d.Food}`;
        const qrContainer = document.querySelector('#qrcode');
        
        if (qrContainer) {
            qrContainer.innerHTML = "";
            
            // Use QRCode library if available
            if (typeof QRCode !== 'undefined') {
                QRCode.toCanvas(qrText, {
                    width: 220,
                    margin: 1,
                    color: { dark: '#000000', light: '#ffffff' }
                }, function(err, canvas) {
                    if (err) {
                        console.error("QR Error:", err);
                        qrContainer.textContent = "Error generating QR";
                    } else {
                        qrContainer.appendChild(canvas);
                        // Download link
                        const dl = document.querySelector('#downloadLink');
                        if (dl) {
                            dl.href = canvas.toDataURL("image/png");
                            dl.download = `ticket-${d.RegNo}.png`;
                        }
                    }
                });
            } else {
                qrContainer.textContent = "QR library not loaded";
            }
        }
    } catch (err) {
        console.error(err);
        alert('Failed to fetch pass. Please check your connection.');
    }
});

// Utility function to generate QR code
function generateQRCode(elementId, text, options = {}) {
    return new Promise((resolve, reject) => {
        const element = document.getElementById(elementId);
        if (!element) {
            reject(new Error('Element not found'));
            return;
        }

        element.innerHTML = '';

        const defaultOptions = {
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff"
        };

        const qrOptions = { ...defaultOptions, ...options, text };

        try {
            new QRCode(element, qrOptions);
            
            // Wait for rendering
            setTimeout(() => {
                const canvas = element.querySelector('canvas');
                if (canvas) {
                    resolve(canvas);
                } else {
                    reject(new Error('QR generation failed'));
                }
            }, 100);
        } catch (error) {
            reject(error);
        }
    });
}
