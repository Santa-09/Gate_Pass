document.addEventListener('DOMContentLoaded', async ()=>{
  const params = new URLSearchParams(location.search);
  const regNo = params.get('regNo');
  if(!regNo){
    document.getElementById('pname').textContent = 'Missing regNo';
    return;
  }

  try{
    const res = await apiGet({action:'getPass', regNo});
    if(res.status !== 'ok'){
      document.getElementById('pname').textContent = 'Pass not found';
      return;
    }
    const d = res.data;

    // Fill ticket details
    qs('#pname').textContent   = d.Name   || '';
    qs('#preg').textContent    = d.RegNo  || '';
    qs('#pbranch').textContent = d.Branch || '';
    qs('#psec').textContent    = d.Section|| '';
    qs('#pfood').textContent   = d.Food   || '';
    qs('#pstatus').textContent = 'Status: ' + (d.Status || '-');

    // Food icon
    const foodIcon = qs('#foodicon');
    foodIcon.src = (d.Food||'').toLowerCase().startsWith('veg') ? 'assets/veg.png' : 'assets/nonveg.png';

    // ✅ Generate QR safely
    const qrText = `APP:FRESHER2025|REG:${d.RegNo||''}|NAME:${d.Name||''}|BRANCH:${d.Branch||''}|SEC:${d.Section||''}|FOOD:${d.Food||''}`;
    const qrContainer = qs('#qrcode');
    qrContainer.innerHTML = "";

    QRCode.toCanvas(qrText, {
      width: 220,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    }, function(err, canvas){
      if(err){
        console.error("QR Error:", err);
        qrContainer.textContent = "Error generating QR";
      } else {
        qrContainer.appendChild(canvas);
        // Download link
        const dl = qs('#downloadLink');
        dl.href = canvas.toDataURL("image/png");
        dl.download = `ticket-${d.RegNo}.png`;
      }
    });

  } catch(err){
    console.error(err);
    showMsg('Failed to fetch pass. Make sure API_URL is set correctly.', true);
  }
});
