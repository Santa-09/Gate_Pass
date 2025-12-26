document.addEventListener('DOMContentLoaded', async () => {
  const regNo = new URLSearchParams(location.search).get('regNo');
  if (!regNo) return;

  const res = await apiGet({ action: 'getPass', regNo });
  if (res.status !== 'ok') return;

  qs('#pname').textContent = res.data.name;
  qs('#preg').textContent = res.data.reg_no;

  QRCode.toCanvas(
    `REG:${res.data.reg_no}`,
    { width: 220 },
    (err, canvas) => qs('#qrcode').appendChild(canvas)
  );
});
