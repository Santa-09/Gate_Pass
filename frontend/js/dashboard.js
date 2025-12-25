// dashboard.js - Dashboard-specific functionality
document.addEventListener('DOMContentLoaded', async () => {
    const statsEl = document.getElementById('stats');
    
    try {
        const res = await window.freshersApp.getDashboardStats();
        
        if (res.status !== 'ok') {
            statsEl.textContent = 'Failed to load stats';
            return;
        }
        
        const s = res.data;
        
        // Build stat cards
        const html = `
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <h3>Total Registrations</h3>
                <div class="number">${s.total}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-user-graduate"></i>
                <h3>Freshers</h3>
                <div class="number">${s.freshers}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-user-friends"></i>
                <h3>Seniors</h3>
                <div class="number">${s.seniors}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-credit-card"></i>
                <h3>Paid</h3>
                <div class="number">${s.paid}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <h3>Pending</h3>
                <div class="number">${s.pending}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-leaf"></i>
                <h3>Vegetarian</h3>
                <div class="number">${s.veg}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-drumstick-bite"></i>
                <h3>Non-Vegetarian</h3>
                <div class="number">${s.nonVeg}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-door-open"></i>
                <h3>Entry Confirmed</h3>
                <div class="number">${s.entryConfirmed}</div>
            </div>
        `;
        
        statsEl.innerHTML = html;
        
    } catch (err) {
        console.error(err);
        statsEl.textContent = 'Error fetching stats.';
    }
});

// Initialize charts if on dashboard page
if (document.getElementById('registrationChart')) {
    // Chart initialization will be handled by dashboard.html
    console.log('Dashboard charts ready');
}
