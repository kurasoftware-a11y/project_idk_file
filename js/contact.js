(() => {
  "use strict";

  const recipient = "idk_file@outlook.com";
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const inquiryType = String(data.get("inquiryType") || "Other").trim();
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `[IDK FILE] ${inquiryType} inquiry from ${name}`;
    const body = [
      `Inquiry type: ${inquiryType}`,
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message
    ].join("\n");

    status.textContent = "メールアプリを開きます。内容を確認して送信してください。";
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
