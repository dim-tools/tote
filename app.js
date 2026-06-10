const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileStatus = document.getElementById("fileStatus");
const generateBtn = document.getElementById("generateBtn");

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  fileStatus.textContent = `Loaded: ${file.name}`;
  generateBtn.disabled = false;
});

generateBtn.addEventListener("click", () => {
  alert("Pick list generation coming next.");
});
