// form.js - Form handling utilities
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            action: 'register',
            data: {
                name: formData.get('name'),
                regNo: formData.get('regNo'),
                branch: formData.get('branch'),
                section: formData.get('section'),
                type: formData.get('type'),
                food: formData.get('food'),
                email: formData.get('email')
            }
        };
        
        try {
            const res = await window.freshersApp.apiPost(data);
            
            if (res.status === 'ok') {
                // Show success message
                showMessage('Registration successful!', 'success');
                
                // Redirect based on type
                setTimeout(() => {
                    if (data.data.type === 'Senior') {
                        window.location.href = `payment.html?regNo=${data.data.regNo}`;
                    } else {
                        window.location.href = `success.html?regNo=${data.data.regNo}`;
                    }
                }, 1500);
            } else {
                showMessage(res.message || 'Registration failed', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } catch (err) {
            console.error(err);
            showMessage('Network error. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
});

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    
    // Create message element
    const msgEl = document.createElement('div');
    msgEl.className = `form-message ${type}`;
    msgEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style based on type
    const styles = {
        success: 'background: rgba(6, 214, 160, 0.1); color: #06d6a0; border-left: 4px solid #06d6a0;',
        error: 'background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border-left: 4px solid #ff6b6b;',
        info: 'background: rgba(0, 180, 216, 0.1); color: #00b4d8; border-left: 4px solid #00b4d8;'
    };
    
    msgEl.style.cssText = `
        padding: 12px 16px;
        margin: 15px 0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        ${styles[type] || styles.info}
    `;
    
    // Insert after form
    const form = document.getElementById('regForm');
    if (form) {
        form.parentNode.insertBefore(msgEl, form.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (msgEl.parentNode) {
                msgEl.remove();
            }
        }, 5000);
    } else {
        // Fallback to alert
        alert(message);
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}
