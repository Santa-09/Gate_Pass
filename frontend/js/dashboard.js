// dashboard.js - Protected Dashboard

document.addEventListener("DOMContentLoaded", async () => {
  // 🔐 SIMPLE ADMIN LOGIN
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "admin123";

  let username = sessionStorage.getItem("dashboard_user");

  if (!username) {
    const u = prompt("Enter admin username:");
    const p = prompt("Enter admin password:");

    if (u !== ADMIN_USER || p !== ADMIN_PASS) {
      alert("Access denied!");
      window.location.href = "index.html";
      return;
    }

    sessionStorage.setItem("dashboard_user", u);
  }

  const statsEl = document.getElementById("stats");
  if (!statsEl) return;

  try {
    // ✅ USE apiGet (NOT freshersApp)
    const res = await window.apiGet({ action: "stats" });

    if (res.status !== "ok") {
      statsEl.textContent = "Failed to load stats";
      return;
    }

    const s = res.data;

    statsEl.innerHTML = `
      <div class="stat-card">
        <i class="fas fa-users"></i>
        <h3>Total Registrations</h3>
        <div class="number">${s.total || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-user-graduate"></i>
        <h3>Freshers</h3>
        <div class="number">${s.freshers || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-user-friends"></i>
        <h3>Seniors</h3>
        <div class="number">${s.seniors || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-credit-card"></i>
        <h3>Paid</h3>
        <div class="number">${s.paid || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-clock"></i>
        <h3>Pending</h3>
        <div class="number">${s.pending || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-leaf"></i>
        <h3>Vegetarian</h3>
        <div class="number">${s.veg || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-drumstick-bite"></i>
        <h3>Non-Vegetarian</h3>
        <div class="number">${s.nonVeg || 0}</div>
      </div>

      <div class="stat-card">
        <i class="fas fa-door-open"></i>
        <h3>Entry Confirmed</h3>
        <div class="number">${s.entryConfirmed || 0}</div>
      </div>
    `;

  } catch (err) {
    console.error(err);
    statsEl.textContent = "Error fetching stats.";
  }
});
