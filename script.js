const button = document.getElementById("unlockBtn");
const status = document.getElementById("status");

button.addEventListener("click", async () => {
  const file = document.getElementById("pdfFile").files[0];
  const password = document.getElementById("password").value;

  if (!file) {
    status.innerText = "Select a PDF first";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);

  status.innerText = "Processing...";

  try {
    const response = await fetch("http://localhost:8000/unlock", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      status.innerText = error.error;
      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".pdf", "_unlocked.pdf");

    document.body.appendChild(a);
    a.click();

    a.remove();

    status.innerText = "Done!";
  } catch (err) {
    status.innerText = "Failed to unlock PDF";
  }
});
