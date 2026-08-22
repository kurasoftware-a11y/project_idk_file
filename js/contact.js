(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form || !status || !submitButton) return;

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity() || submitButton.disabled) return;

    const data = new FormData(form);
    const inquiryType = String(data.get("inquiryType") || "Other").trim();
    const name = String(data.get("name") || "").trim();
    data.set("_subject", `[IDK FILE] ${inquiryType} inquiry from ${name}`);

    form.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
    setStatus("送信中です…", "pending");

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Formspree returned ${response.status}`);
      }

      form.reset();
      setStatus("お問い合わせを送信しました。", "success");
    } catch (error) {
      console.error("Form submission failed:", error);
      setStatus("送信できませんでした。時間をおいて、もう一度お試しください。", "error");
    } finally {
      form.removeAttribute("aria-busy");
      submitButton.disabled = false;
    }
  });
})();
