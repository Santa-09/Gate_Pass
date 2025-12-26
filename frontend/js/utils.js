function qs(sel) {
  return document.querySelector(sel);
}

function showMsg(msg, isError = false) {
  alert(msg);
}

function parseQRContent(text) {
  const obj = {};
  text.split('|').forEach(p => {
    const [k, v] = p.split(':');
    if (k && v) obj[k.trim()] = v.trim();
  });
  return obj;
}
