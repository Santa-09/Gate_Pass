document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const msgEl = document.getElementById("msg");

  // explicit inputs
  const nameInput = document.getElementById("name");
  const regNoInput = document.getElementById("regNo");
  const branchInput = document.getElementById("branch");
  const sectionInput = document.getElementById("section");
  const foodInput = document.getElementById("food");
  const emailInput = document.getElementById("email");
  const typeInput = form.querySelector('input[name="type"]');

  function showMsg(text, isError = false) {
    msgEl.textContent = text;
    msgEl.className = isError ? "error" : "success";
    msgEl.style.display = "block";
    setTimeout(() => (msgEl.style.display = "none"), 5000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof window.apiPost !== "function") {
      showMsg("System not ready. Please refresh.", true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Registering...";

    const data = {
      name: nameInput.value.trim(),
      regNo: regNoInput.value.trim().toUpperCase(),
      branch: branchInput.value,
      section: sectionInput.value,
      type: typeInput.value,
      food: foodInput.value,
      email: emailInput.value.trim()
    };

    if (!data.name || !data.regNo || !data.branch || !data.section || !data.food || !data.email) {
      showMsg("Please fill all fields", true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Register as ${data.type}`;
      return;
    }

    try {
      const res = await window.apiPost({
        action: "register",
        data
      });

      if (res.status === "ok") {
        showMsg("Registration successful!");

        setTimeout(() => {
          if (data.type === "Senior") {
            window.location.href = `payment.html?regNo=${data.regNo}`;
          } else {
            window.location.href = `success.html?regNo=${data.regNo}`;
          }
        }, 1000);
      } else {
        showMsg(res.message || "Registration failed", true);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Register as ${data.type}`;
      }
    } catch (err) {
      console.error(err);
      showMsg("Something went wrong", true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Register as ${data.type}`;
    }
  });
});
