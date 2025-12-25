document.addEventListener('DOMContentLoaded', ()=>{
  const resultEl = document.getElementById('result');
  const html5QrCode = new Html5Qrcode("reader");
  function onScanSuccess(decodedText, decodedResult){
    // stop scanning
    html5QrCode.stop().then(()=>{
      resultEl.textContent = 'Scanned: ' + decodedText;
      // parse and call verifyEntry
      const parsed = parseQRContent(decodedText);
      if(!parsed || !parsed.REG){
        resultEl.textContent = 'Invalid pass format.';
        return;
      }
      apiGet({action:'verifyEntry', regNo: parsed.REG}).then(res=>{
        if(res.status === 'ok'){
          resultEl.innerHTML = '<span style="color:green">Entry allowed: ' + (res.data.Name||'') + '</span>';
        } else {
          resultEl.innerHTML = '<span style="color:red">' + res.message + '</span>';
        }
      }).catch(err=>{
        console.error(err);
        resultEl.textContent = 'Server error';
      });
    }).catch(err=>console.warn('stop failed', err));
  }

  function onScanError(error){
    // ignore for now
  }

  Html5Qrcode.getCameras().then(cameras=>{
    if(cameras && cameras.length){
      html5QrCode.start(cameras[0].id, {fps:10, qrbox:250}, onScanSuccess, onScanError);
    } else {
      resultEl.textContent = 'No camera found';
    }
  }).catch(err=>{
    console.error(err);
    resultEl.textContent = 'Camera permission denied or not available';
  });
});
