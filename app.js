const TOTE_ITEMS = {
  "213567": {
    description: "ADTRAN SDX611 ONT 1GE C-Chip",
    shorthand: "ONT - 611",
    maxQty: 5
  },

  "214181": {
    description: "ADTRAN SDX601QV, GPON 2.5G/1P",
    shorthand: "ONT - 601",
    maxQty: 5
  },

  "214152": {
    description: "ONT, ADTRAN, 632 V Indoor XGS 10G/2.5",
    shorthand: "ONT - 632",
    maxQty: 12
  },

  "213484": {
    description: "ADTRAN 854-6 DHCP",
    shorthand: "Modem - 854",
    maxQty: 10
  },

  "214595": {
    description: "ADTRAN, SMARTOS, SDG 8612, Gtwy",
    shorthand: "Modem - 8612 SOS",
    maxQty: 2
  },

  "214278": {
    description: "ADTRAN, Plume, SDG 8612 Gateway",
    shorthand: "Modem - 8612",
    maxQty: 10
  },

  "213264": {
    description: "Adtran 841-T6 WIFI 6 MESH EXT",
    shorthand: "Extender - 841",
    maxQty: 11
  }
};

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileStatus = document.getElementById("fileStatus");
const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");

let selectedFile = null;

function setLoadedFile(file) {
  selectedFile = file;

  fileStatus.textContent = file.name;
  fileStatus.classList.add("file-loaded");

  generateBtn.disabled = false;
}

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  setLoadedFile(file);
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();

  const file = event.dataTransfer.files[0];

  if (!file) return;

  setLoadedFile(file);
});

const resultsDiv = document.getElementById("results");

generateBtn.addEventListener("click", () => {

  if (!selectedFile) return;

  const reader = new FileReader();

  reader.onload = (e) => {

    const csvText = e.target.result;

    const lines = csvText.split(/\r?\n/);

    const counts = {};

    Object.keys(TOTE_ITEMS).forEach(part => {
      counts[part] = 0;
    });

    for (let i = 1; i < lines.length; i++) {

      const line = lines[i];

      if (!line.trim()) continue;

      const match = line.match(/(\d{6})-/);

      if (!match) continue;

      const partNumber = match[1];

      if (counts.hasOwnProperty(partNumber)) {
        counts[partNumber]++;
      }
    }

    let rows = "";
    let totalPieces = 0;

    Object.entries(TOTE_ITEMS).forEach(([partNumber, item]) => {

      const currentQty = counts[partNumber] || 0;
      const neededQty = item.maxQty - currentQty;

      if (neededQty > 0) {

       totalPieces += neededQty;
        
      rows += `
  <tr>
    <td>${item.shorthand}</td>
    <td>${neededQty}</td>
  </tr>
`;
      }

    });

   if (!rows) {

  resultsDiv.innerHTML = `
    <div class="result-item">
      <div class="result-part">
        Tote is fully stocked
      </div>
    </div>
  `;

  printBtn.disabled = true;
  return;
}

  const generatedAt = new Date().toLocaleString([], {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

resultsDiv.innerHTML = `
  <div class="generated-time">
    Pick List Generated: ${generatedAt}
  </div>

  <table class="pick-table">
    <thead>
     <tr>
  <th>Item</th>
  <th>Qty</th>
</tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="pick-summary">
    Total Pieces To Pick: ${totalPieces}
  </div>
`;
    printBtn.disabled = false;

  };

  reader.readAsText(selectedFile);

});

printBtn.addEventListener("click", () => {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TOTE REPLENISHMENT PICK LIST", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text(
    "Tech Name: ______________________________",
    20,
    35
  );

  const generatedAt = new Date().toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  doc.text(`Generated: ${generatedAt}`, 20, 45);

  doc.output("dataurlnewwindow");

});
