document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('regForm');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      action: 'register',
      data: {
        name: fd.get('name'),
        regNo: fd.get('regNo'),
        branch: fd.get('branch'),
        section: fd.get('section'),
        type: fd.get('type'),
        food: fd.get('food'),
        email: fd.get('email')
      }
    };
    try{
      const res = await apiPost(data);
      if(res.status === 'ok'){
        // redirect to success page with regNo
        location.href = 'success.html?regNo=' + encodeURIComponent(data.data.regNo);
      } else {
        showMsg(res.message || 'Registration failed', true);
      }
    } catch(err){
      console.error(err);
      showMsg('Network error. Check API_URL in js/utils.js', true);
    }
  });
});
