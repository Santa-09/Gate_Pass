document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('regForm');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fd = new FormData(form);

    const res = await apiPost({
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
    });

    if (res.status === 'ok') {
      location.href = `success.html?regNo=${fd.get('regNo')}`;
    } else {
      showMsg(res.message, true);
    }
  });
});
