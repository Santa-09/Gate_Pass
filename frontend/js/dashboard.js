document.addEventListener('DOMContentLoaded', async () => {
  const statsEl = document.getElementById('stats');
  try {
    const res = await apiGet({ action: 'stats' });
    if (res.status !== 'ok') {
      statsEl.textContent = 'Failed to load stats';
      return;
    }
    const s = res.data;
    // build simple cards
    const html = `
      <div class="card"><h3>Registered</h3><p>Total: ${s.total}</p><p>Freshers: ${s.freshers}</p><p>Seniors: ${s.seniors}</p></div>
      <div class="card"><h3>Payments</h3><p>Paid: ${s.paid}</p><p>Pending: ${s.pending}</p></div>
      <div class="card"><h3>Food</h3><p>Veg: ${s.veg}</p><p>Non-Veg: ${s.nonveg}</p></div>
      <div class="card"><h3>Entry / Food Confirmed</h3><p>Entries Confirmed: ${s.entryConfirmed}</p><p>Food Confirmed: ${s.foodConfirmed}</p></div>
    `;
    statsEl.innerHTML = html;
  } catch (err) {
    console.error(err);
    statsEl.textContent = 'Error fetching stats. Make sure API_URL is set.';
  }
});
