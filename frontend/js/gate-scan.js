const scanner = new Html5Qrcode("reader");

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  async text => {
    const parsed = parseQRContent(text);
    if (!parsed.REG) return;

    await apiPost({ action: 'verifyEntry', regNo: parsed.REG });
    qs('#result').textContent = "✔ Verified";
  }
);
