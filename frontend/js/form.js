document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      regNo: form.regNo.value,
      branch: form.branch.value,
      section: form.section.value,
      type: form.type.value,
      food: form.food.value,
      email: form.email.value
    };

    const res = await window.apiPost({
      action: "register",
      data
    });

    if (res.status === "ok") {
      window.location.href = `success.html?regNo=${data.regNo}`;
    } else {
      alert(res.message);
    }
  });
});
