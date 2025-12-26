// dashboard.js - FINAL & STABLE

document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "admin123";

  const loginContainer = document.getElementById("loginContainer");
  const dashboard = document.getElementById("dashboard");
  const navbar = document.getElementById("navbar");
  const errorMsg = document.getElementById("errorMessage");

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // 🔐 LOGIN
  loginBtn.addEventListener("click", login);
  document.getElementById("password").addEventListener("keypress", e => {
    if (e.key === "Enter") login();
  });

  logoutBtn.addEventListener("click", e => {
    e.preventDefault();
    sessionStorage.removeItem("adminLoggedIn");
    showLogin();
  });

  function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("adminLoggedIn", "true");
      showDashboard();
    } else {
      errorMsg.style.display = "block";
      setTimeout(() => (errorMsg.style.display = "none"), 3000);
    }
  }

  function showDashboard() {
    loginContainer.style.display = "none";
    navbar.style.display = "block";
    dashboard.style.display = "block";
    loadStats();
  }

  function showLogin() {
    loginContainer.style.display = "flex";
    navbar.style.display = "none";
    dashboard.style.display = "none";
  }

  // 🔁 AUTO LOGIN
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    showDashboard();
  }

  // 📊 LOAD STATS
  async function loadStats() {
    try {
      const res = await window.apiGet({ action: "stats" });
      if (res.status !== "ok") return;

      const s = res.data;
      const statsEl = document.getElementById("stats");

      statsEl.innerHTML = `
        <div class="stat-card"><i class="fas fa-users"></i><h3>Total</h3><div class="number">${s.total}</div></div>
        <div class="stat-card"><i class="fas fa-user-graduate"></i><h3>Freshers</h3><div class="number">${s.freshers}</div></div>
        <div class="stat-card"><i class="fas fa-user-friends"></i><h3>Seniors</h3><div class="number">${s.seniors}</div></div>
        <div class="stat-card"><i class="fas fa-credit-card"></i><h3>Paid</h3><div class="number">${s.paid}</div></div>
        <div class="stat-card"><i class="fas fa-clock"></i><h3>Pending</h3><div class="number">${s.pending}</div></div>
        <div class="stat-card"><i class="fas fa-leaf"></i><h3>Veg</h3><div class="number">${s.veg}</div></div>
        <div class="stat-card"><i class="fas fa-drumstick-bite"></i><h3>Non-Veg</h3><div class="number">${s.nonVeg}</div></div>
        <div class="stat-card"><i class="fas fa-door-open"></i><h3>Entry</h3><div class="number">${s.entryConfirmed}</div></div>
      `;
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }
});
