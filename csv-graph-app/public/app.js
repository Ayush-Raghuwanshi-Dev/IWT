const form = document.getElementById("uploadForm");
const message = document.getElementById("message");
const preview = document.getElementById("preview");
const graphImage = document.getElementById("graphImage");

const setMessage = (text, isError = true) => {
  message.textContent = text;
  message.style.color = isError ? "#c0392b" : "#1f7a3f";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fileInput = form.querySelector("input[type='file']");
  if (!fileInput.files.length) {
    setMessage("Please choose a CSV file.");
    return;
  }

  const data = new FormData();
  data.append("csv", fileInput.files[0]);

  setMessage("Uploading and generating graph...", false);

  const response = await fetch("/upload", {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    setMessage(errorData.message || "Failed to generate graph.");
    preview.hidden = true;
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  graphImage.src = url;
  preview.hidden = false;
  setMessage("Graph generated successfully.", false);
});
