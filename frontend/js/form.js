document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const msgEl = document.getElementById("msg");

  function showMsg(message, isError = false) {
    msgEl.textContent = message;
    msgEl.className = isError ? "error" : "success";
    msgEl.style.display = "block";
    setTimeout(() => (msgEl.style.display = "none"), 5000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

    const type = form.querySelector('input[name="type"]').value;

    const data = {
      name: name.value.trim(),
      regNo: regNo.value.trim().toUpperCase(),
      branch: branch.value,
      section: section.value,
      type,
      food: food.value,
      email: email.value.trim()
    };

    try {
      const res = await window.apiPost({
        action: "register",
        data
      });

      if (res.status === "ok") {
        showMsg("Registration successful!");

        setTimeout(() => {
          if (type === "Senior") {
            window.location.href = `payment.html?regNo=${data.regNo}`;
          } else {
            window.location.href = `success.html?regNo=${data.regNo}`;
          }
        }, 1000);
      } else {
        showMsg(res.message || "Registration failed", true);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-user-plus"></i> Register as ${type}`;
      }
    } catch (err) {
      console.error(err);
      showMsg("Something went wrong. Try again.", true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-user-plus"></i> Register as ${type}`;
    }
  });
});
