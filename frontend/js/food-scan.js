document.addEventListener('DOMContentLoaded', ()=>{
  const resultEl = document.getElementById('result');
  const html5QrCode = new Html5Qrcode("reader");
  function onScanSuccess(decodedText, decodedResult){
    html5QrCode.stop().then(()=>{
      resultEl.textContent = 'Scanned: ' + decodedText;
      const parsed = parseQRContent(decodedText);
      if(!parsed || !parsed.REG){
        resultEl.textContent = 'Invalid pass format.';
        return;
      }
      apiGet({action:'verifyFood', regNo: parsed.REG}).then(res=>{
        if(res.status === 'ok'){
          let msg = 'Food allowed: ' + (res.data.Name||'') + ' - ' + (res.data.Food||'');
          resultEl.innerHTML = '<span style="color:green">' + msg + '</span>';
        } else {
          resultEl.innerHTML = '<span style="color:red">' + res.message + '</span>';
        }
      }).catch(err=>{
        console.error(err);
        resultEl.textContent = 'Server error';
      });
    }).catch(err=>console.warn('stop failed', err));
  }

  function onScanError(error){}

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
